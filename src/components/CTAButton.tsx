import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHECKOUT_URL } from "@/content";
import { PAGE_VARIANT } from "@/lib/track";

/**
 * Botão de CTA. Por padrão aponta para o CHECKOUT_URL (content.ts), mas
 * aceita `href` para outros destinos (ex.: "#planos" para rolar aos planos).
 *
 * Cores: o CTA é VERDE (--color-cta) — tom profundo justamente para o texto
 * BRANCO passar em 4,5:1. O azul da marca (--color-purple/--color-purple-ink)
 * fica reservado para formas, selos e texto de destaque, não para os botões.
 *
 * Formato: retângulo de cantos arredondados (`rounded-2xl`), não pílula —
 * é o formato da referência e dá mais área de toque no celular.
 *
 * No mobile o botão ocupa quase toda a largura (`w-full`), como pede um
 * tráfego majoritariamente de Instagram/TikTok; a partir de sm ele encolhe
 * para o tamanho do conteúdo, a menos que `fullWidth` esteja ligado.
 */
export function CTAButton({
  children,
  variant = "primary",
  size = "md",
  href,
  attention = false,
  shine = true,
  arrow = true,
  fullWidth = false,
  className,
  location = "cta",
  trackId,
}: {
  children: React.ReactNode;
  variant?: "primary" | "gold" | "outline";
  size?: "md" | "lg";
  href?: string;
  /** true: continua ocupando a largura toda no desktop (CTA da hero). */
  fullWidth?: boolean;
  /** brilho pulsante — reservado para os CTAs principais. */
  attention?: boolean;
  /** faixa de brilho que atravessa o botão. Só vale com `attention`. */
  shine?: boolean;
  /** mostra a seta à direita (padrão: true). */
  arrow?: boolean;
  className?: string;
  /** Posição do CTA para o rastreamento (data-cta-location). */
  location?: string;
  /** Identificador do CTA (data-track-id). Padrão: `${location}-checkout`. */
  trackId?: string;
}) {
  return (
    <a
      href={href ?? CHECKOUT_URL}
      data-cta-location={location}
      data-track-id={trackId ?? `${location}-checkout`}
      data-page-variant={PAGE_VARIANT}
      className={cn(
        "group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl text-center font-cta uppercase leading-tight tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
        fullWidth ? "max-w-lg" : "max-w-md sm:w-auto",
        // Alvo de toque confortável no celular. A altura vem do `min-h`, e
        // NÃO do padding vertical: com `py` grande, um rótulo que quebra em
        // duas linhas dobrava a altura e o botão virava um quadrado. Assim a
        // linha única mantém os 60px e a de duas cresce só o necessário.
        // O padding lateral menor no celular é o espaço que decide se o
        // rótulo cabe em uma linha ou joga a última palavra sozinha embaixo.
        size === "lg"
          ? "min-h-[60px] px-5 py-3 text-[1rem] sm:px-8 sm:text-[1.1rem]"
          : "min-h-[52px] px-4 py-3 text-[0.85rem] sm:px-7 sm:text-[0.95rem]",
        variant === "outline"
          ? "border-2 border-white/35 bg-transparent text-white hover:bg-white/10"
          : variant === "gold"
            ? "bg-gold text-ink shadow-[0_10px_26px_-8px_rgba(240,180,41,0.75)] hover:brightness-105"
            : "bg-gradient-to-b from-cta to-cta-dark text-white shadow-[0_12px_28px_-8px_rgba(34,180,85,0.6)] ring-1 ring-inset ring-white/20 hover:brightness-110",
        attention && "cta-attention",
        attention &&
          shine &&
          "before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3 before:-skew-x-[20deg] before:bg-white/25 before:content-[''] before:[animation:cta-shine_3.4s_ease-in-out_infinite]",
        className,
      )}
    >
      {/* `inline-block` + `text-balance`: quando o rótulo não cabe em uma
          linha, as duas ficam com o mesmo peso em vez de sobrar uma palavra
          órfã na segunda ("...+ 5 / BÔNUS"). */}
      <span className="relative inline-block text-balance">{children}</span>
      {arrow && <ArrowRight className="relative size-5 shrink-0" aria-hidden />}
    </a>
  );
}
