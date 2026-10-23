"use client";

import { useEffect, useState } from "react";
import styles from "./SocialContentCard.module.css";

// Carte d'un contenu marque (admin) : type de média visible d'un coup d'œil, aperçu complet au clic.
type Kind = "video" | "carousel" | "photo" | "link" | "article" | "none";

const isVideoFile = (u: string) => /\.(mp4|mov|webm)(\?|$)/i.test(u);
const VIDEO_PAGE = /facebook\.com\/(reel|watch|[^/?#]+\/videos)\//i;

function resolve(x: any) {
  const all: string[] = (Array.isArray(x.media_urls) ? x.media_urls : []).filter((u: any) => typeof u === "string" && u);
  const images = all.filter((u) => !isVideoFile(u));
  const video: string | null = x.video_url || all.find(isVideoFile) || null;
  const source = String(x.source_url || "");
  let kind: Kind = x.media_kind;
  if (!kind) {
    if (video || VIDEO_PAGE.test(source)) kind = "video";
    else if (source && !/facebook\.com/i.test(source) && x.source_network !== "facebook") kind = "article";
    else kind = images.length > 1 ? "carousel" : images.length ? "photo" : "none";
  }
  return { kind, images, video, seconds: Number(x.video_seconds) || null, source };
}

const duration = (s: number | null) => (s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : "");
const date = (d?: string) => {
  if (!d) return "";
  const t = new Date(d);
  return Number.isFinite(t.getTime()) ? t.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "";
};
const network = (n?: string) => (n ? n.charAt(0).toUpperCase() + n.slice(1) : "Web");

function label(kind: Kind, n: number, seconds: number | null) {
  if (kind === "video") return "Vidéo" + (seconds ? " · " + duration(seconds) : "");
  if (kind === "carousel") return `Carrousel · ${n} photos`;
  if (kind === "photo") return "Photo";
  if (kind === "link") return "Lien partagé";
  if (kind === "article") return "Article";
  return "Sans visuel";
}

const Icon = ({ kind }: { kind: Kind }) =>
  kind === "video" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
  ) : kind === "carousel" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="4" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 8v10a2 2 0 0 0 2 2h10" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
  ) : kind === "link" || kind === "article" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  ) : kind === "none" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 11h14M5 16h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="9" cy="10" r="1.6" fill="currentColor" /><path d="m5 17 5-5 3 3 2-2 4 4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
  );

export default function SocialContentCard({
  item,
  eyebrow,
  onIgnore,
  onApprove,
}: {
  item: any;
  eyebrow?: string;
  onIgnore?: () => void;
  onApprove?: () => void;
}) {
  const { kind, images, video, seconds, source } = resolve(item);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const caption = String(item.original_caption || item.caption || "");
  const tag = label(kind, images.length, seconds);
  const cover = images[0];

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
    };
  }, [open, images.length]);

  const show = () => {
    setIndex(0);
    setOpen(true);
  };

  return (
    <>
      <article className={styles.card}>
        <button type="button" className={styles.media} onClick={show} aria-label={"Aperçu : " + tag}>
          {cover ? (
            <img src={cover} alt="" loading="lazy" />
          ) : (
            <span className={styles.empty}>
              <Icon kind={kind} />
              <em>{kind === "video" ? "Vidéo sans miniature" : "Aucun visuel récupéré"}</em>
            </span>
          )}
          <span className={styles.badge + " " + styles["k_" + kind]}>
            <Icon kind={kind} />
            {tag}
          </span>
          {kind === "video" && cover && <span className={styles.play} aria-hidden="true"><Icon kind="video" /></span>}
          {kind === "carousel" && (
            <span className={styles.strip} aria-hidden="true">
              {images.slice(1, 4).map((u) => <img key={u} src={u} alt="" loading="lazy" />)}
              {images.length > 4 && <i>+{images.length - 4}</i>}
            </span>
          )}
        </button>
        <div>
          <small>{eyebrow || `${item.brands?.name || item.brand_name || "Marque"} · ${network(item.source_network)}`}</small>
          <b>{item.title || "Publication détectée"}</b>
          <p>{caption}</p>
          <nav className={styles.meta}>
            {date(item.published_at) && <span>{date(item.published_at)}</span>}
            <button type="button" onClick={show}>Aperçu</button>
            {source && <a href={source} target="_blank" rel="noreferrer">Voir l’original ↗</a>}
          </nav>
          {(onIgnore || onApprove) && (
            <footer>
              {onIgnore && <button onClick={onIgnore}>Ignorer</button>}
              {onApprove && <button onClick={onApprove}>Valider</button>}
            </footer>
          )}
        </div>
      </article>

      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Aperçu du contenu">
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.stage}>
              {kind === "video" && video ? (
                <video src={video} poster={cover} controls autoPlay playsInline />
              ) : images.length ? (
                <>
                  <img src={images[index]} alt="" />
                  {kind === "video" && (
                    <p className={styles.notice}>
                      La vidéo n’est pas encore copiée dans Bikéo : seule sa miniature est disponible.
                      {source && <> <a href={source} target="_blank" rel="noreferrer">La regarder sur Facebook ↗</a></>}
                    </p>
                  )}
                  {images.length > 1 && (
                    <>
                      <button type="button" className={styles.prev} disabled={index === 0} onClick={() => setIndex(index - 1)} aria-label="Image précédente">‹</button>
                      <button type="button" className={styles.next} disabled={index === images.length - 1} onClick={() => setIndex(index + 1)} aria-label="Image suivante">›</button>
                      <span className={styles.counter}>{index + 1} / {images.length}</span>
                    </>
                  )}
                </>
              ) : (
                <span className={styles.emptyLarge}>
                  <Icon kind={kind} />
                  <em>{kind === "video" ? "Vidéo partagée : aucun aperçu fourni par Facebook" : "Aucun visuel récupéré pour ce post"}</em>
                  {source && <a href={source} target="_blank" rel="noreferrer">Ouvrir le post original ↗</a>}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((u, i) => (
                  <button type="button" key={u} className={i === index ? styles.on : ""} onClick={() => setIndex(i)} aria-label={`Image ${i + 1}`}>
                    <img src={u} alt="" />
                  </button>
                ))}
              </div>
            )}
            <aside className={styles.text}>
              <header>
                <span className={styles.badge + " " + styles["k_" + kind]}><Icon kind={kind} />{tag}</span>
                <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Fermer">×</button>
              </header>
              <small>{item.brands?.name || item.brand_name || "Marque"} · {network(item.source_network)}{date(item.published_at) ? " · " + date(item.published_at) : ""}</small>
              <h3>{item.title || "Publication détectée"}</h3>
              <p>{caption || "Pas de texte."}</p>
              {source && <a className={styles.original} href={source} target="_blank" rel="noreferrer">Voir le post original ↗</a>}
              {(onIgnore || onApprove) && (
                <footer>
                  {onIgnore && <button onClick={() => { setOpen(false); onIgnore(); }}>Ignorer</button>}
                  {onApprove && <button onClick={() => { setOpen(false); onApprove(); }}>Valider</button>}
                </footer>
              )}
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
