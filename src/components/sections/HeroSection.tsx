import Image from "next/image";
import { ShieldCheck, Sparkles, Star } from "lucide-react";
import { hero } from "@/content";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";
import { PAGE_VARIANT } from "@/lib/track";

/**
 * 2. HERO — primeira dobra.
 *
 * Ordem no MOBILE (a maior parte do tráfego): selo → headline → subheadline →
 * mockup do produto → CTA → linha de segurança. O mockup entra logo depois do
 * texto porque é ele que materializa a promessa ("isso aqui é um material de
 * verdade, com projetos dentro") antes de pedir o clique.
 *
 * No desktop vira duas colunas: texto à esquerda, mockup à direita.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-cream px-5 pb-14 pt-8 sm:pb-20 sm:pt-12"
    >
      {/* Fundo CHAPADO de propósito: nada de gradiente nem de manchas
          desfocadas atrás do texto — a hero é a dobra que precisa ler mais
          rápido, e o mockup já dá cor suficiente. */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* ---------------- Coluna de texto ---------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Eyecatcher da oferta */}
          {/* A pílula INTEIRA escala com a largura da tela: fonte fluida
              (`clamp`) e estrelas medidas em `em`. Com tamanho fixo, 5
              estrelas + uma frase de ~37 caracteres em negrito não cabem em
              telas de 360–414px — a frase quebrava em duas linhas e o selo
              ficava com cara de erro. Assim cabe em uma linha de 360px pra
              cima, e o teto de 13px preserva o tamanho no desktop. */}
          <p className="inline-flex max-w-full items-center gap-1 rounded-full bg-white px-3 py-2 text-[clamp(10px,3vw,13px)] font-bold leading-snug text-ink shadow-[0_8px_24px_-10px_rgba(26,35,56,0.45)] ring-1 ring-ink/10 sm:gap-1.5 sm:px-4 sm:py-2.5">
            {hero.badgeStars > 0 ? (
              <span
                role="img"
                aria-label={`${hero.badgeStars} de 5 estrelas`}
                className="flex shrink-0 items-center"
              >
                {Array.from({ length: hero.badgeStars }).map((_, i) => (
                  <Star key={i} className="size-[1.15em] fill-gold text-gold" />
                ))}
              </span>
            ) : (
              <Sparkles className="size-[1.3em] shrink-0 text-gold" aria-hidden />
            )}
            <span>
              <Highlight text={hero.badge} tone="purple" />
            </span>
          </p>

          {/* Headline maior e subheadline menor, a pedido: a diferença de
              tamanho entre as duas é o que faz a promessa ser lida primeiro. */}
          <h1 className="font-display text-balance mt-5 text-[2.15rem] leading-[1.04] text-ink sm:text-[3.1rem] lg:text-[3.5rem]">
            {/* sem `underline`: o traço dourado por baixo do destaque saiu a
                pedido — o azul sozinho já separa "Esquemas Visuais" do resto */}
            <Highlight text={hero.headline} tone="purple" />
          </h1>

          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
            {hero.subheadline}
          </p>

          {/* Mockup — no MOBILE aparece aqui, logo abaixo da subheadline;
              no desktop ele vive na coluna da direita. */}
          <div className="mt-8 w-full lg:hidden">
            <HeroMockup />
          </div>

          {/* O texto do CTA da hero é MAIOR que o dos outros botões: é o
              clique que a dobra inteira existe para conseguir.

              Como ele cresce, três coisas andam juntas para a frase caber em
              UMA linha até em telas de 360px (onde ela já batia na borda com
              o tamanho antigo): a fonte é fluida (`clamp`, do 1rem atual no
              celular pequeno até 1,35rem no desktop), o espaçamento entre
              letras volta ao normal e o padding lateral encolhe no mobile —
              os dois devolvem ~30px de largura útil. */}
          <div className="cta-pulse mt-8 flex w-full justify-center lg:justify-start">
            <CTAButton
              size="lg"
              fullWidth
              href="#planos"
              location="hero"
              trackId="hero-plans"
              attention
              shine={false}
              className="px-5 text-[clamp(1rem,4.6vw,1.35rem)] tracking-normal sm:px-8 sm:text-[1.35rem]"
            >
              {hero.cta}
            </CTAButton>
          </div>

          {/* Uma linha só, colada no botão: escudo + segurança + prazo. Os
              três microbenefícios com ícone saíram daqui a pedido. */}
          <p className="mt-3 flex items-center justify-center gap-2 text-[13px] font-medium text-ink-soft/80 lg:justify-start">
            <ShieldCheck className="size-[18px] shrink-0 text-green-ink" aria-hidden />
            <span>{hero.reassurance}</span>
          </p>
        </div>

        {/* ---------------- Mockup (desktop) ---------------- */}
        <div className="hidden lg:block">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

/**
 * Mockup do produto — a prova de que existe material de verdade por trás da
 * promessa. É o candidato a LCP da página, por isso vem em `eager` com
 * fetchPriority alto (o antigo `priority` foi descontinuado no Next 16).
 *
 * Clicar leva aos planos: a arte é grande e as pessoas tocam nela.
 */
function HeroMockup() {
  return (
    <a
      href="#planos"
      data-cta-location="hero-mockup"
      data-track-id="hero-mockup-plans"
      data-page-variant={PAGE_VARIANT}
      aria-label="Ver os planos"
      className="hero-float block"
    >
      <Image
        src={hero.mockup.src}
        alt={hero.mockup.alt}
        width={hero.mockup.width}
        height={hero.mockup.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        quality={65}
        sizes="(min-width: 1024px) 560px, (min-width: 640px) 520px, 92vw"
        className="mx-auto h-auto w-full max-w-[560px] object-contain"
      />
    </a>
  );
}
