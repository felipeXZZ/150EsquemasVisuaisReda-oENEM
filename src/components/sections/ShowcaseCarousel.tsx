import { showcase } from "@/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";
import { PAGE_VARIANT } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * Proporção real das pranchas (1055 × 1491), na maior largura gerada — fixa o
 * espaço do card e evita CLS. As duas larguras saem do `npm run carrosel`.
 */
const SHEET_W = 640;
const SHEET_H = 904;

/** Uma volta completa da faixa. As duas correm no MESMO tempo (e, como têm o
 *  mesmo número de cards, na mesma velocidade) — só mudam de sentido. */
const DURACAO = "17s";

type Item = (typeof showcase.items)[number];

/**
 * 2.5 VITRINE — carrossel duplo logo abaixo da hero.
 *
 * Duas faixas correndo em sentidos opostos: é o movimento que segura o olho
 * na dobra seguinte à hero e, ao mesmo tempo, entrega VOLUME (muitos esquemas
 * diferentes passando) e PROVA (as páginas são as do PDF, dá pra ler o que
 * cada uma ensina) antes de pedir qualquer coisa.
 *
 * Por que duas faixas e não uma: uma faixa só lê como "banner decorativo";
 * duas, em sentidos contrários, leem como catálogo grande. As velocidades são
 * diferentes de propósito — iguais, as faixas "espelham" e o olho percebe a
 * repetição.
 *
 * Fundo AZUL PROFUNDO: a hero é creme e as pranchas também são claras. Sobre
 * o creme elas sumiriam; sobre o azul, cada card vira um retângulo branco
 * recortado — e o CTA verde fica o ponto mais quente da tela.
 *
 * Zero JavaScript: animação em CSS (globals.css), pausa no hover e, com
 * `prefers-reduced-motion`, as faixas param e viram rolagem manual.
 */
export function ShowcaseCarousel() {
  // Índices pares na faixa de cima, ímpares na de baixo (ver nota em content.ts).
  const topRow = showcase.items.filter((_, i) => i % 2 === 0);
  const bottomRow = showcase.items.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="vitrine"
      className="relative overflow-hidden bg-plum py-14 text-white sm:py-20"
    >
      <div className="mx-auto max-w-2xl px-5 text-center">
        <Eyebrow tone="gold">{showcase.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight sm:text-4xl">
          <Highlight text={showcase.title} tone="gold" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-invert sm:text-base">
          {showcase.paragraph}
        </p>
      </div>

      {/* As faixas sangram até a borda da tela de propósito: cortadas nos dois
          lados, elas sugerem que continuam para fora do enquadramento. */}
      <div className="mt-9 flex flex-col gap-3 sm:mt-11 sm:gap-4">
        <Row items={topRow} />
        <Row items={bottomRow} reverse />
      </div>

      <div className="mt-10 px-5">
        <div className="flex justify-center">
          <CTAButton
            size="lg"
            href="#planos"
            location="showcase"
            trackId="showcase-plans"
          >
            {showcase.cta}
          </CTAButton>
        </div>

      </div>
    </section>
  );
}

/**
 * Uma faixa em loop contínuo. A lista é duplicada e o trilho anda até -50%,
 * então a segunda metade assume exatamente onde a primeira parou.
 *
 * A margem vai em TODOS os cards (inclusive o último) em vez de `gap`: com
 * `gap`, o trilho fica com um vão a menos que o número de cards e o -50%
 * cairia fora do ponto, criando um "pulo" a cada volta.
 */
function Row({
  items,
  reverse = false,
}: {
  items: Item[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <div className="marquee-mask edge-fade no-scrollbar relative w-full overflow-hidden">
      <ul
        className={cn("marquee-track flex w-max", reverse && "marquee-reverse")}
        style={{ "--marquee-duration": DURACAO } as React.CSSProperties}
      >
        {loop.map((item, i) => {
          const duplicate = i >= items.length;
          return (
            <li
              key={i}
              aria-hidden={duplicate}
              className="mr-3 w-[190px] shrink-0 sm:mr-4 sm:w-[250px] lg:w-[290px]"
            >
              <a
                href="#planos"
                tabIndex={duplicate ? -1 : undefined}
                data-cta-location="showcase-card"
                data-track-id="showcase-card-plans"
                data-page-variant={PAGE_VARIANT}
                className="block overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)] ring-1 ring-white/15 transition-transform duration-200 hover:-translate-y-1"
              >
                {/* <img> em vez de next/image DE PROPÓSITO: as pranchas já
                    saem prontas do `npm run carrosel` nas duas larguras que os
                    cards usam. Passá-las pelo otimizador faria o servidor
                    processar 17 imagens a cada `npm run dev` frio — e é o
                    otimizador que derrubava o dev. Assim o navegador baixa
                    arquivo estático (com cache imutável, ver next.config.ts) e
                    nem o dev nem a Vercel fazem trabalho nenhum. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/carrosel/${item.slug}-640.webp`}
                  srcSet={`/carrosel/${item.slug}-400.webp 400w, /carrosel/${item.slug}-640.webp 640w`}
                  sizes="(min-width: 1024px) 290px, (min-width: 640px) 250px, 190px"
                  alt={
                    duplicate
                      ? ""
                      : `${item.code}, ${item.name}: esquema visual pronto para aplicar na redação`
                  }
                  width={SHEET_W}
                  height={SHEET_H}
                  /* eager + fetchPriority baixa: as pranchas fora do
                     enquadramento nunca entrariam pelo lazy-load (o overflow
                     as esconde do observer) e a faixa giraria com buracos.
                     Prioridade baixa mantém o LCP da hero na frente. */
                  loading="eager"
                  fetchPriority="low"
                  decoding="async"
                  className="h-auto w-full"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
