"use client";

import { useEffect, useRef } from "react";

/**
 * Embed do Wistia (vídeo demonstrativo vertical).
 *
 * Os scripts do Wistia só são baixados quando a pessoa chega perto do vídeo
 * — juntos passam de 100 KB e penalizariam todo mundo que nunca rola até
 * aqui. O container já reserva a altura pela proporção (`aspect`), então o
 * layout não pula quando o player carrega.
 */
export function WistiaPlayer({
  mediaId,
  aspect,
  className,
}: {
  mediaId: string;
  /** largura/altura, ex.: 0.5625 para 9/16 (vertical). */
  aspect: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !mediaId) return;

    const load = () => {
      const add = (src: string, isModule = false) => {
        if (document.querySelector(`script[src="${src}"]`)) return;
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        if (isModule) s.type = "module";
        document.head.appendChild(s);
      };
      add("https://fast.wistia.com/player.js");
      add(`https://fast.wistia.com/embed/${mediaId}.js`, true);
    };

    if (typeof IntersectionObserver === "undefined") {
      load();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        load();
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mediaId]);

  return (
    <div
      ref={ref}
      style={{ aspectRatio: String(aspect) }}
      className={className}
    >
      {/* @ts-expect-error — custom element do Wistia, sem tipos no React */}
      <wistia-player media-id={mediaId} aspect={String(aspect)} />
    </div>
  );
}
