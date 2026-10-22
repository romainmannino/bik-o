// Veille Facebook des marques via Bright Data (dataset « Pages Posts by Profile URL »).
// Utilisé par le cron quotidien et par le bouton « Vérifier » de l'admin.

import { createAdminClient } from "@/lib/supabase/admin";
import { rehostImages, linkPreviewImage, isHosted, isFacebookCdn } from "@/lib/social-media";

export const DATASET = "gd_lkaxegm826bjpoo9m5";
export const POST_DATASET = "gd_lyclm1571iy3mv57zw"; // un post Facebook par URL
const BD = "https://api.brightdata.com/datasets/v3";

export const fmt = (d: Date) =>
  String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0") + "-" + d.getUTCFullYear();
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
export const dedupe = (s: string) => {
  const seen = new Set<string>();
  return s
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter((x) => {
      const k = x.toLowerCase().replace(/\s+/g, " ");
      if (!x || seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .join("\n\n");
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Une image exploitable : https, pas un fichier vidéo, pas une page facebook.com (lien de post/reel).
const isImage = (x: unknown): x is string =>
  typeof x === "string" &&
  /^https:\/\//i.test(x) &&
  !/\.(mp4|mov|webm|m3u8)(\?|$)/i.test(x) &&
  !/^https:\/\/(www\.|m\.|web\.)?facebook\.com\//i.test(x);

export function mediaUrls(row: any) {
  const attachments = Array.isArray(row?.attachments) ? row.attachments : [];
  const urls: string[] = [];
  for (const a of attachments) {
    if (!a || typeof a !== "object") continue;
    const video = /video|reel/i.test(String(a.type || "")) || !!a.video_url;
    const candidates = video
      ? [a.thumbnail_url, a.preview_url, a.image_url, a.url]
      : [a.thumbnail_url, a.image_url, a.url];
    const hit = candidates.find(isImage);
    if (hit) urls.push(hit);
  }
  // Images portées par le post lui-même (aperçu de lien partagé, image principale…)
  for (const extra of [row?.post_image, row?.image_url, row?.thumbnail_url, row?.preview_url, row?.post_external_image]) {
    if (isImage(extra)) urls.push(extra);
  }
  return [...new Set(urls)];
}

export function dateInWindow(row: any, from: Date, to: Date) {
  const raw = row?.date_posted || row?.date || row?.timestamp;
  if (!raw) return false;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) && d >= from && d < to;
}

// Bright Data peut répondre en tableau JSON, en { data: [...] } ou en NDJSON.
function parseRecords(raw: string): any[] {
  const text = raw.trim();
  if (!text) return [];
  try {
    const j = JSON.parse(text);
    if (Array.isArray(j)) return j;
    if (Array.isArray(j?.data)) return j.data;
    return [];
  } catch {
    return text
      .split(/\r?\n/)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter((x) => x && typeof x === "object" && !Array.isArray(x));
  }
}

function snapshotIdOf(raw: string): string | null {
  try {
    const j = JSON.parse(raw);
    return !Array.isArray(j) && typeof j?.snapshot_id === "string" ? j.snapshot_id : null;
  } catch {
    return null;
  }
}

const auth = (key: string) => ({ Authorization: "Bearer " + key });

// La requête synchrone /scrape est coupée par Bright Data au bout d'une minute : il renvoie alors
// HTTP 202 + snapshot_id et continue la collecte. On suit la progression puis on télécharge le snapshot.
async function waitForSnapshot(key: string, id: string, deadline: number, firstWaitMs: number) {
  let wait = firstWaitMs;
  let lastStatus = "en attente";
  while (Date.now() + wait < deadline) {
    await sleep(wait);
    wait = 10000;
    const p = await fetch(`${BD}/progress/${id}`, { headers: auth(key), cache: "no-store" });
    if (!p.ok) {
      if (p.status === 401 || p.status === 404) throw new Error(`Bright Data : suivi du snapshot ${id} impossible (${p.status})`);
      continue;
    }
    const status = String((await p.json().catch(() => ({})))?.status || "");
    lastStatus = status || lastStatus;
    if (status === "failed") throw new Error(`Bright Data : la collecte a échoué (snapshot ${id})`);
    if (status !== "ready") continue;
    const s = await fetch(`${BD}/snapshot/${id}?format=json`, { headers: auth(key), cache: "no-store" });
    if (s.status === 202) continue;
    if (!s.ok) throw new Error(`Bright Data : téléchargement du snapshot ${id} impossible (${s.status})`);
    return parseRecords(await s.text());
  }
  throw new Error(
    `Bright Data n'a pas terminé la collecte à temps (snapshot ${id}, statut « ${lastStatus} »). La période sera revérifiée au prochain passage.`,
  );
}

// Appel synchrone d'un dataset Bright Data, avec bascule automatique sur le snapshot si la collecte
// dépasse la minute autorisée par /scrape.
export async function scrapeDataset(dataset: string, input: Record<string, unknown>[], deadline: number) {
  const key = process.env.BRIGHTDATA_API_KEY;
  if (!key) throw new Error("BRIGHTDATA_API_KEY manquante");
  const r = await fetch(`${BD}/scrape?dataset_id=${dataset}&notify=false&include_errors=true&format=json`, {
    method: "POST",
    headers: { ...auth(key), "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
    cache: "no-store",
  });
  const raw = await r.text();
  if (r.status === 202 || (r.ok && snapshotIdOf(raw))) {
    const snapshotId = snapshotIdOf(raw);
    if (!snapshotId) throw new Error("Bright Data a mis la collecte en file d'attente sans identifiant de snapshot");
    const retryAfter = Number(r.headers.get("retry-after"));
    const rows = await waitForSnapshot(key, snapshotId, deadline, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 10000);
    return { rows, raw, snapshotId };
  }
  if (!r.ok) throw new Error("Bright Data répond " + r.status + (raw ? " : " + raw.slice(0, 200) : ""));
  return { rows: parseRecords(raw), raw, snapshotId: null as string | null };
}

export async function scrape(url: string, start: string, end: string, deadline = Date.now() + 240000) {
  const { rows, raw, snapshotId } = await scrapeDataset(
    DATASET,
    [{ url, num_of_posts: 20, start_date: start, end_date: end }],
    deadline,
  );
  return {
    rows,
    debug: {
      snapshotId,
      rawBytes: raw.length,
      parsed: rows.length,
      postIds: rows.filter((x: any) => x?.post_id).length,
      errors: rows.filter((x: any) => x?.error).map((x: any) => String(x.error).slice(0, 250)),
    },
  };
}

export type MonitorResult = {
  ok: boolean;
  error?: string;
  noRecords?: boolean;
  checked: { start: string; end: string };
  records: number;
  imported: number;
  diagnostic: Record<string, unknown>;
};

// Vérifie la fenêtre glissante J-4 → J-1 d'une marque, importe les nouveaux posts en « pending »
// et met à jour l'état du moniteur. Ne lève jamais : renvoie un résultat exploitable par les routes.
export async function runMonitor(s: any, brandId: string, pageUrl: string, deadline: number): Promise<MonitorResult> {
  const yesterday = addDays(new Date(), -1);
  const windowEnd = iso(yesterday);
  const windowStart = addDays(yesterday, -3);
  const windowStop = addDays(yesterday, 1);
  const checked = { start: fmt(windowStart), end: fmt(yesterday) };
  const fail = async (error: string, extra: Partial<MonitorResult> = {}, imported = 0): Promise<MonitorResult> => {
    await s.rpc("admin_mark_brand_social_monitor", { p_brand_id: brandId, p_error: error, p_imported: imported });
    return { ok: false, error, checked, records: 0, imported, diagnostic: {}, ...extra };
  };
  try {
    const scraped = await scrape(pageUrl, checked.start, checked.end, deadline);
    const rows = scraped.rows;
    const posts = rows.filter((r: any) => r && !r.error && r.post_id);
    const errorRows = rows.filter((r: any) => r?.error);

    const { data: existing, error: listError } = await s.rpc("admin_list_brand_social_content");
    if (listError) throw new Error(listError.message);
    const knownIds = new Set<string>((existing || []).map((x: any) => String(x.external_post_id || "")).filter(Boolean));
    const knownUrls = new Set<string>((existing || []).map((x: any) => String(x.source_url || "")).filter(Boolean));

    let imported = 0, duplicates = 0, outside = 0, empty = 0;
    const invalid = rows.length - posts.length;
    const createErrors: string[] = [];
    for (const row of posts) {
      if (!dateInWindow(row, windowStart, windowStop)) {
        outside++;
        continue;
      }
      const postId = String(row.post_id);
      const sourceUrl = String(row.url || "");
      if (knownIds.has(postId) || (sourceUrl && knownUrls.has(sourceUrl))) {
        duplicates++;
        continue;
      }
      const caption = dedupe(String(row.content || ""));
      let media = mediaUrls(row);
      if (media.length === 0 && caption) {
        const preview = await linkPreviewImage(caption);
        if (preview) media = [preview];
      }
      if (!caption && media.length === 0) {
        empty++;
        continue;
      }
      // Copie durable des images (les liens Facebook expirent sous ~6 jours).
      media = (await rehostImages(media, `social/${brandId}/${postId}`)).urls;
      const { error } = await s.rpc("admin_create_brand_social_content_pending", {
        p_brand_id: brandId,
        p_title: row.user_username_raw || row.page_name || "Actualité marque",
        p_caption: caption,
        p_media_urls: media,
        p_source_network: "facebook",
        p_source_url: sourceUrl,
        p_external_post_id: postId,
        p_published_at: row.date_posted || null,
      });
      if (error) {
        createErrors.push(error.message);
        continue;
      }
      imported++;
      knownIds.add(postId);
      if (sourceUrl) knownUrls.add(sourceUrl);
    }
    // Répare les contenus déjà importés dont les images sont restées sur Facebook ou manquent.
    const refreshed = Date.now() + 30000 < deadline ? await refreshStoredMedia(existing || [], brandId, deadline) : null;
    const diagnostic = { ...scraped.debug, invalid, duplicates, outside, empty, createErrors, refreshed };

    if (posts.length === 0) {
      const reason = errorRows.length
        ? "Bright Data a renvoyé une erreur : " + String(errorRows[0].error).slice(0, 200)
        : "Bright Data n’a retourné aucune publication pour la période du " + checked.start + " au " + checked.end;
      return fail(reason + " ; période à revérifier.", { noRecords: true, records: rows.length, diagnostic });
    }
    if (createErrors.length) {
      return fail("Import incomplet : " + createErrors.join(" | "), { records: rows.length, diagnostic }, imported);
    }
    await s.rpc("admin_mark_brand_social_monitor_window", {
      p_brand_id: brandId,
      p_error: null,
      p_imported: imported,
      p_window_end: windowEnd,
    });
    return { ok: true, checked, records: rows.length, imported, diagnostic };
  } catch (e: any) {
    return fail(e?.message || "Vérification impossible");
  }
}

// Contenus Facebook encore actifs (à valider ou disponibles) dont les visuels ne sont pas copiés
// dans Supabase : on copie les images encore valides, sinon on relit le post chez Bright Data.
export async function refreshStoredMedia(existing: any[], brandId: string, deadline: number) {
  const admin = createAdminClient();
  if (!admin) return { skipped: "clé service Supabase absente" };
  const todo = existing
    .filter((x) => x.brand_id === brandId && x.source_network === "facebook" && ["pending", "available"].includes(x.status))
    .filter((x) => {
      const media: string[] = Array.isArray(x.media_urls) ? x.media_urls : [];
      return media.length === 0 || media.some((u) => typeof u === "string" && !isHosted(u) && isFacebookCdn(u));
    })
    .slice(0, 8);
  let fixed = 0, rescraped = 0, unchanged = 0;
  for (const item of todo) {
    if (Date.now() + 20000 > deadline) break;
    const before: string[] = (Array.isArray(item.media_urls) ? item.media_urls : []).filter((u: any) => typeof u === "string");
    const folder = `social/${brandId}/${item.external_post_id || item.id}`;
    let media = before.length ? (await rehostImages(before, folder)).urls : [];
    const allHosted = media.length > 0 && media.length === before.length && media.every(isHosted);
    if (!allHosted && before.some(isFacebookCdn) && item.source_url && Date.now() + 90000 < deadline) {
      // Liens expirés : on relit le post pour obtenir des liens frais.
      try {
        const { rows } = await scrapeDataset(POST_DATASET, [{ url: item.source_url }], Math.min(deadline - 20000, Date.now() + 90000));
        const row = rows.find((r: any) => r && !r.error);
        if (row) {
          rescraped++;
          const fresh = mediaUrls(row);
          if (fresh.length) media = (await rehostImages(fresh, folder)).urls;
        }
      } catch {}
    }
    if (media.length === 0 && item.original_caption) {
      const preview = await linkPreviewImage(String(item.original_caption));
      if (preview) media = (await rehostImages([preview], folder)).urls;
    }
    if (JSON.stringify(media) === JSON.stringify(before)) {
      unchanged++;
      continue;
    }
    const { error } = await admin.from("brand_social_contents").update({ media_urls: media }).eq("id", item.id);
    if (!error) fixed++;
  }
  return { candidates: todo.length, fixed, rescraped, unchanged };
}
