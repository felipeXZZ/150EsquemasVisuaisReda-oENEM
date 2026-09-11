import { Play } from "lucide-react";
import { video } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAButton } from "@/components/CTAButton";
import { WistiaPlayer } from "@/components/WistiaPlayer";

/**
 * 4. SEÇÃO DE VÍDEO — quebra escura no meio da página.
 *
 * Enquanto não houver vídeo gravado (`video.mediaId` vazio no content.ts),
 * mostra um espaço reservado com a proporção final — assim o layout já está
 * pronto e nada muda de posição quando o vídeo entrar.
 */
export function VideoSection() {
  const hasVideo = Boolean(video.mediaId);

  return (
    <Section bg="plum">
      <SectionHead>
        <Eyebrow tone="gold">{video.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-white sm:text-4xl">
          {video.title}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-invert sm:text-base">
          {video.subtitle}
        </p>
      </SectionHead>

      <div className="mx-auto mt-9 w-full max-w-[300px]">
        {hasVideo ? (
          <WistiaPlayer
            mediaId={video.mediaId}
            aspect={video.aspect}
            className="overflow-hidden rounded-3xl shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]"
          />
        ) : (
          <div
            style={{ aspectRatio: String(video.aspect) }}
            role="img"
            aria-label={video.placeholder}
            data-placeholder="true"
            className="flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/30 bg-white/5 p-6 text-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white/15">
              <Play className="size-6 translate-x-0.5 text-white" aria-hidden />
            </span>
            <span className="text-[11px] font-bold uppercase leading-snug tracking-wide text-ink-invert">
              {video.placeholder}
            </span>
          </div>
        )}
      </div>

      <div className="mt-9 flex justify-center">
        <CTAButton size="lg" href="#planos" location="video" trackId="video-plans">
          {video.cta}
        </CTAButton>
      </div>
    </Section>
  );
}
