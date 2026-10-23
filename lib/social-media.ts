// Médias des contenus marques : les liens d'images Facebook (fbcdn) sont signés et expirent
// quelques jours après la collecte. On copie donc les images dans le bucket public « brand-assets ».
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "brand-assets";
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

export const isHosted = (u: string) => /\.supabase\.co\/storage\/v1\/object\/public\//.test(u);
export const isFacebookCdn = (u: string) => /fbcdn\.net\//i.test(u);

// Date d'expiration d'un lien fbcdn (paramètre oe=, timestamp hexadécimal). null si inconnue.
export function cdnExpiry(u: string): number | null {
  const m = u.match(/[?&]oe=([0-9A-Fa-f]{6,10})/);
  return m ? parseInt(m[1], 16) * 1000 : null;
}
export const isExpired = (u: string) => {
  const e = cdnExpiry(u);
  return e !== null && e < Date.now();
};

// Copie les images dans Supabase Storage. Une image qui ne peut pas être copiée est gardée
// telle quelle si son lien est encore valide, abandonnée s'il est expiré.
export async function rehostImages(urls: string[], folder: string) {
  const admin = createAdminClient();
  const out: string[] = [];
  let copied = 0, failed = 0;
  for (let i = 0; i < urls.length && i < 10; i++) {
    const u = urls[i];
    if (isHosted(u)) {
      out.push(u);
      continue;
    }
    if (!admin) {
      if (!isExpired(u)) out.push(u);
      continue;
    }
    try {
      const r = await fetch(u, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000), cache: "no-store" });
      const type = (r.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const ext = IMAGE_TYPES[type];
      if (!r.ok || !ext) throw new Error("not an image");
      const body = new Uint8Array(await r.arrayBuffer());
      if (body.byteLength === 0 || body.byteLength > 15 * 1024 * 1024) throw new Error("size");
      const path = `${folder}/${i}.${ext}`;
      const { error } = await admin.storage.from(BUCKET).upload(path, body, { contentType: type, upsert: true });
      if (error) throw new Error(error.message);
      out.push(admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      copied++;
    } catch {
      failed++;
      if (!isExpired(u)) out.push(u);
    }
  }
  return { urls: out, copied, failed };
}

// Copie une vidéo (mp4) dans Supabase Storage pour la lire dans l'admin et la réutiliser en magasin.
// Renvoie null si la vidéo est indisponible, trop lourde ou si la clé service manque.
const MAX_VIDEO_BYTES = 90 * 1024 * 1024;
export async function rehostVideo(url: string, folder: string): Promise<string | null> {
  if (!url) return null;
  if (isHosted(url)) return url;
  const admin = createAdminClient();
  if (!admin) return null;
  try {
    const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(60000), cache: "no-store" });
    const type = (r.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!r.ok || !/^video\/mp4$|^application\/octet-stream$/.test(type)) return null;
    if (Number(r.headers.get("content-length") || 0) > MAX_VIDEO_BYTES) return null;
    const body = new Uint8Array(await r.arrayBuffer());
    if (body.byteLength === 0 || body.byteLength > MAX_VIDEO_BYTES) return null;
    const path = `${folder}/video.mp4`;
    const { error } = await admin.storage.from(BUCKET).upload(path, body, { contentType: "video/mp4", upsert: true });
    if (error) return null;
    return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}

// Image d'aperçu (og:image) du premier lien externe cité dans le texte d'un post.
export async function linkPreviewImage(text: string): Promise<string | null> {
  const links = (text.match(/https?:\/\/[^\s<>"')]+/g) || [])
    .map((u) => u.replace(/[.,;:!?…]+$/, ""))
    .filter((u) => !/(facebook\.com|fb\.me|fb\.watch|instagram\.com)/i.test(u))
    .slice(0, 2);
  for (const link of links) {
    try {
      const r = await fetch(link, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (!r.ok || !/html/i.test(r.headers.get("content-type") || "")) continue;
      const html = (await r.text()).slice(0, 500000);
      for (const tag of html.match(/<meta\s[^>]*>/gi) || []) {
        if (!/(property|name)=["'](og:image(:secure_url)?|twitter:image(:src)?)["']/i.test(tag)) continue;
        const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
        if (!content) continue;
        const abs = new URL(content.replace(/&amp;/g, "&"), r.url).toString();
        if (/^https:\/\//i.test(abs)) return abs;
      }
    } catch {}
  }
  return null;
}
