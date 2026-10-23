// Veille Facebook des marques via Bright Data (dataset « Pages Posts by Profile URL »).
// Utilisé par le cron quotidien et par le bouton « Vérifier » de l'admin.

import { createAdminClient } from "@/lib/supabase/admin";
import { rehostImages, rehostVideo, linkPreviewImage, isHosted, isFacebookCdn } from "@/lib/social-media";

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

// Type de contenu affiché dans l'admin : vidéo, carrousel, photo, lien partagé ou sans visuel.
export type MediaKind = "video" | "carousel" | "photo" | "link" | "article" | "none";
const isVideoFile = (x: unknown): x is string =>
  typeof x === "string" && /^https:\/\//i.test(x) && /\.(mp4|mov|webm)(\?|$)/i.test(x);
const VIDEO_PAGE = /facebook\.com\/(reel|watch|[^/?#]+\/videos)\//i;
// Bright Data donne la durée en secondes ou en millisecondes selon les posts.
const toSeconds = (x: unknown) => {
  const n = Number(x);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n > 900 ? Math.round(n / 1000) : Math.round(n);
};

export function mediaInfo(row: any, sourceUrl = "") {
  const attachments = Array.isArray(row?.attachments) ? row.attachments : [];
  let videoUrl: string | null = null;
  let videoSeconds: number | null = null;
  let hasVideo = VIDEO_PAGE.test(sourceUrl) || VIDEO_PAGE.test(String(row?.url || "")) || /reel|video/i.test(String(row?.post_type || ""));
  for (const a of attachments) {
    if (!a || typeof a !== "object") continue;
    if (!(/video|reel/i.test(String(a.type || "")) || a.video_url)) continue;
    hasVideo = true;
    const v = [a.video_url, a.url, a.attachment_url].find(isVideoFile);
    if (v && !videoUrl) {
      videoUrl = v;
      videoSeconds = toSeconds(a.video_length);
    }
  }
  const extra = [row?.video_url, ...(Array.isArray(row?.videos) ? row.videos.map((x: any) => (typeof x === "string" ? x : x?.video_url || x?.url)) : [])];
  for (const v of extra) {
    if (!videoUrl && isVideoFile(v)) {
      videoUrl = v;
      hasVideo = true;
    }
  }
  if (videoSeconds === null) videoSeconds = toSeconds(row?.video_length);
  const images = mediaUrls(row);
  const kind: MediaKind = hasVideo ? "video" : images.length > 1 ? "carousel" : images.length === 1 ? "photo" : "none";
  return { kind, images, videoUrl, videoSeconds };
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

export async function scrape(url: string, start: string, end: string, deadline = Date.now() + 240000, numOfPosts = 20) {
  const { rows, raw, snapshotId } = await scrapeDataset(
    DATASET,
    [{ url, num_of_posts: numOfPosts, start_date: start, end_date: end }],
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
// days = longueur de la fenêtre vérifiée (4 jours par défaut, jusqu'à 31 pour un rattrapage).
export async function runMonitor(s: any, brandId: string, pageUrl: string, deadline: number, days = 4): Promise<MonitorResult> {
  const span = Math.min(31, Math.max(1, Math.round(days) || 4));
  const yesterday = addDays(new Date(), -1);
  const windowEnd = iso(yesterday);
  const windowStart = addDays(yesterday, -(span - 1));
  const windowStop = addDays(yesterday, 1);
  const checked = { start: fmt(windowStart), end: fmt(yesterday) };
  const fail = async (error: string, extra: Partial<MonitorResult> = {}, imported = 0): Promise<MonitorResult> => {
    await s.rpc("admin_mark_brand_social_monitor", { p_brand_id: brandId, p_error: error, p_imported: imported });
    return { ok: false, error, checked, records: 0, imported, diagnostic: {}, ...extra };
  };
  try {
    const scraped = await scrape(pageUrl, checked.start, checked.end, deadline, Math.max(20, span * 3));
    const rows = scraped.rows;
    const posts = rows.filter((r: any) => r && !r.error && r.post_id);
    const errorRows = rows.filter((r: any) => r?.error);

    // Les RPC v2 (type de média, vidéo) sont réservées au serveur : clé service si disponible.
    const db = createAdminClient() || s;
    const { data: existing, error: listError } = await db.rpc("admin_list_brand_social_content_v2");
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
      let info = mediaInfo(row, sourceUrl);
      let media = info.images;
      // Partage d'une vidéo d'une autre page, ou vidéo sans lien de lecture : le dataset « post »
      // renvoie souvent la miniature et le fichier vidéo. Une seule tentative, à l'import.
      if ((media.length === 0 || (info.kind === "video" && !info.videoUrl)) && sourceUrl && Date.now() + 100000 < deadline) {
        try {
          const one = await scrapeDataset(POST_DATASET, [{ url: sourceUrl }], Date.now() + 90000);
          const r = one.rows.find((x: any) => x && !x.error);
          if (r) {
            const more = mediaInfo(r, sourceUrl);
            if (!media.length) media = more.images;
            info = {
              kind: info.kind === "video" || more.kind === "video" ? "video" : more.kind !== "none" ? more.kind : info.kind,
              images: media,
              videoUrl: info.videoUrl || more.videoUrl,
              videoSeconds: info.videoSeconds ?? more.videoSeconds,
            };
          }
        } catch {}
      }
      let kind: MediaKind = info.kind;
      if (media.length === 0 && caption) {
        const preview = await linkPreviewImage(caption);
        if (preview) {
          media = [preview];
          if (kind === "none") kind = "link";
        }
      }
      if (!caption && media.length === 0 && !info.videoUrl) {
        empty++;
        continue;
      }
      const folder = `social/${brandId}/${postId}`;
      // Copie durable des images et de la vidéo (les liens Facebook expirent sous ~6 jours).
      media = (await rehostImages(media, folder)).urls;
      const videoUrl = info.videoUrl && Date.now() + 70000 < deadline ? await rehostVideo(info.videoUrl, folder) : null;
      const { error } = await db.rpc("admin_create_brand_social_content_pending_v2", {
        p_brand_id: brandId,
        p_title: row.user_username_raw || row.page_name || "Actualité marque",
        p_caption: caption,
        p_media_urls: media,
        p_source_network: "facebook",
        p_source_url: sourceUrl,
        p_external_post_id: postId,
        p_published_at: row.date_posted || null,
        p_media_kind: kind,
        p_video_url: videoUrl,
        p_video_seconds: info.videoSeconds,
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

// Contenus Facebook encore actifs (à valider ou disponibles) à compléter : images restées sur Facebook,
// vidéo pas encore copiée, ou post sans visuel jamais relu. Les posts à relire le sont en un seul
// appel Bright Data ; chaque post n'est relu qu'une fois (media_checked_at), sauf liens expirés.
const normUrl = (u: unknown) => String(u || "").split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
const reelId = (u: unknown) => String(u || "").match(/\/(?:reel|videos)\/(\d+)/)?.[1] || "";
function rowKeys(r: any) {
  const keys = [normUrl(r?.url), normUrl(r?.input?.url), String(r?.post_id || ""), String(r?.shortcode || ""), reelId(r?.url), reelId(r?.input?.url)];
  for (const a of Array.isArray(r?.attachments) ? r.attachments : []) keys.push(String(a?.id || ""));
  return new Set(keys.filter(Boolean));
}
const itemKeys = (x: any) => [normUrl(x.source_url), String(x.external_post_id || ""), reelId(x.source_url)].filter(Boolean);

export async function refreshStoredMedia(existing: any[], brandId: string, deadline: number) {
  const admin = createAdminClient();
  if (!admin) return { skipped: "clé service Supabase absente" };
  const urlsOf = (x: any): string[] => (Array.isArray(x.media_urls) ? x.media_urls : []).filter((u: any) => typeof u === "string");
  const cdnLeft = (x: any) => urlsOf(x).some((u) => !isHosted(u) && isFacebookCdn(u));
  const neverChecked = (x: any) =>
    !x.media_checked_at && (urlsOf(x).length === 0 || (x.media_kind === "video" && !(x.video_url && isHosted(x.video_url))));
  const todo = existing
    .filter((x) => x.brand_id === brandId && x.source_network === "facebook" && ["pending", "available"].includes(x.status))
    .filter((x) => cdnLeft(x) || neverChecked(x))
    .slice(0, 10);

  let fixed = 0, rescraped = 0, unchanged = 0, videos = 0;
  const errors: string[] = [];
  const plans = [];
  for (const item of todo) {
    const before = urlsOf(item);
    const folder = `social/${brandId}/${item.external_post_id || item.id}`;
    const media = before.length ? (await rehostImages(before, folder)).urls : [];
    const allHosted = media.length > 0 && media.length === before.length && media.every(isHosted);
    const canRead = /facebook\.com\//i.test(String(item.source_url || ""));
    const rescrape = canRead && ((!allHosted && before.some(isFacebookCdn)) || neverChecked(item));
    plans.push({ item, before, folder, media, allHosted, rescrape });
  }

  const toRead = plans.filter((p) => p.rescrape);
  let rows: any[] = [];
  let readOk = false;
  if (toRead.length && Date.now() + 100000 < deadline) {
    try {
      const res = await scrapeDataset(POST_DATASET, toRead.map((p) => ({ url: p.item.source_url })), Math.min(deadline - 45000, Date.now() + 170000));
      rows = res.rows.filter((r: any) => r && !r.error);
      readOk = true;
    } catch (e: any) {
      errors.push(String(e?.message || e).slice(0, 200));
    }
  }
  const indexed = rows.map((r) => ({ r, keys: rowKeys(r) }));

  for (const p of plans) {
    if (Date.now() + 15000 > deadline) break;
    const { item, before, folder } = p;
    let media = p.media;
    let kind: MediaKind = item.media_kind || (media.length > 1 ? "carousel" : media.length ? "photo" : "none");
    let videoUrl: string | null = item.video_url || null;
    let videoSeconds: number | null = item.video_seconds ?? null;
    const row = p.rescrape ? indexed.find((x) => itemKeys(item).some((k) => x.keys.has(k)))?.r : undefined;
    if (row) {
      rescraped++;
      const info = mediaInfo(row, item.source_url);
      if (!p.allHosted && info.images.length) media = (await rehostImages(info.images, folder)).urls;
      if (info.kind === "video") kind = "video";
      else if (kind === "none" && info.kind !== "none") kind = info.kind;
      videoSeconds = info.videoSeconds ?? videoSeconds;
      if (info.videoUrl && !(videoUrl && isHosted(videoUrl)) && Date.now() + 70000 < deadline) {
        const hosted = await rehostVideo(info.videoUrl, folder);
        if (hosted) {
          videoUrl = hosted;
          videos++;
        }
      }
    }
    if (media.length === 0 && item.original_caption) {
      const preview = await linkPreviewImage(String(item.original_caption));
      if (preview) {
        media = (await rehostImages([preview], folder)).urls;
        if (kind === "none" && media.length) kind = "link";
      }
    }
    const patch: Record<string, unknown> = { media_urls: media, media_kind: kind, video_url: videoUrl, video_seconds: videoSeconds };
    if (p.rescrape && readOk) patch.media_checked_at = new Date().toISOString();
    const same =
      JSON.stringify(media) === JSON.stringify(before) &&
      kind === item.media_kind &&
      videoUrl === (item.video_url || null) &&
      videoSeconds === (item.video_seconds ?? null) &&
      !patch.media_checked_at;
    if (same) {
      unchanged++;
      continue;
    }
    const { error } = await admin.from("brand_social_contents").update(patch).eq("id", item.id);
    if (error) errors.push(error.message);
    else fixed++;
  }
  return { candidates: todo.length, read: toRead.length, rescraped, fixed, videos, unchanged, errors };
}
