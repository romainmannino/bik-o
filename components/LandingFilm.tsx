"use client";

import { useEffect, useRef, useState } from "react";

// Film de lancement : version 16:9 sur ordinateur, 9:16 sur mobile en portrait.
const SOURCES = {
  wide: { src: "/film/bikeo-film-16x9.mp4", poster: "/film/poster-16x9.jpg" },
  tall: { src: "/film/bikeo-film-9x16.mp4", poster: "/film/poster-9x16.jpg" },
};

export default function LandingFilm() {
  const [format, setFormat] = useState<"wide" | "tall">("wide");
  const [started, setStarted] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px) and (orientation: portrait)");
    const apply = () => {
      // On ne change pas de version en cours de lecture.
      if (video.current && !video.current.paused) return;
      setFormat(mq.matches ? "tall" : "wide");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const play = () => {
    const v = video.current;
    if (!v) return;
    setStarted(true);
    v.muted = false;
    v.play().catch(() => {
      // Si le navigateur refuse le son, on lance en muet : les contrôles permettent de le réactiver.
      v.muted = true;
      v.play().catch(() => setStarted(false));
    });
  };

  const { src, poster } = SOURCES[format];
  return (
    <div className={"landingFilmFrame " + (format === "tall" ? "isTall" : "isWide")}>
      <video
        key={format}
        ref={video}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        onEnded={() => setStarted(false)}
        aria-label="Film de présentation Bikéo, 58 secondes, avec voix off"
      />
      {!started && (
        <button type="button" className="landingFilmPlay" onClick={play}>
          <span aria-hidden="true">▶</span>
          Lancer le film <small>58 s · son</small>
        </button>
      )}
    </div>
  );
}
