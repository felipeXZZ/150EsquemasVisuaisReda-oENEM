import Image from "next/image";
import { Gift, TriangleAlert } from "lucide-react";
import { bonuses } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { BonusCover } from "@/components/BonusCover";
import { CTAButton } from "@/components/CTAButton";

/**
 * 8. BÔNUS — os 5 materiais complementares do Plano Completo.
 *
 * Cada bônus tem capa própria e valor percebido individual; a soma (R$196) é
 * a mesma âncora usada no preço "de" do Completo, para os dois números
 * conversarem em vez de parecerem inventados separadamente.
 *
 * Layout do card: selo numerado saindo da borda, mockup grande e a linha de
 * preço fechada numa faixa verde. O objetivo é que, batendo o olho, a leitora
 * veja três coisas nesta ordem — "é bônus", "é isto aqui", "é de graça".
 */
export function BonusSection() {
  return (
    <Section bg="cream" id="bonus">
      <SectionHead>
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-white text-purple-ink shadow-sm">
          <Gift className="size-6" aria-hidden />
        </span>
        <Eyebrow tone="purple">{bonuses.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
          <Highlight text={bonuses.title} tone="purple" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {bonuses.subtitle}
        </p>
      </SectionHead>

      {/* Grade de 6 colunas com cards de 2: dá 3 por linha e permite empurrar
          o 4º para a coluna 2, deixando os dois últimos centralizados em vez
          de encostados na esquerda. */}
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-7">
        {bonuses.items.map((b, i) => (
          <li
            key={b.title}
            className={[
              "relative flex flex-col rounded-[28px] bg-white p-5 pt-8 text-center",
              "shadow-[0_20px_44px_-26px_rgba(26,35,56,0.5)] ring-1 ring-black/5",
              "sm:p-6 sm:pt-9 lg:col-span-2",
              i === 3 ? "lg:col-start-2" : "",
            ].join(" ")}
          >
            {/* Selo numerado — sai da borda superior de propósito, para o card
                ler como "presente etiquetado" e não como mais um item da lista. */}
            <span className="absolute -top-3 right-5 z-10 rounded-full bg-gold px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-ink shadow-[0_6px_16px_-6px_rgba(26,35,56,0.6)] sm:right-7 sm:text-xs">
              {b.tag}
            </span>

            {/* Capa: foto real se houver `src`, senão a capa desenhada.
                As capas são FOTOGRAFIAS de cena (o livro sobre a mesa, com a
                luz e os papéis ao fundo): entram sangrando até a borda do
                bloco, com os cantos arredondados, e não soltas sobre um fundo
                tingido — o fundo faz parte da arte. Por isso `overflow-hidden`
                aqui e nenhum padding. */}
            <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl">
              {b.src ? (
                // Proporção 4:5, o tamanho real das capas. As cinco têm o
                // MESMO tamanho, então os cinco cards ficam iguais.
                <Image
                  src={b.src}
                  alt={`Capa do bônus: ${b.title}`}
                  width={620}
                  height={775}
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 70vw"
                  loading="lazy"
                  quality={75}
                  className="h-auto w-full"
                />
              ) : (
                <BonusCover
                  tag={b.tag}
                  title={b.title}
                  icon={b.icon}
                  colors={b.colors}
                />
              )}
            </div>

            <h3 className="font-display text-balance mt-5 text-[19px] leading-tight text-ink sm:text-xl">
              {b.title}
            </h3>
            <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-soft">
              {b.description}
            </p>

            {/* Faixa de preço: o valor riscado e o "grátis" na mesma linha,
                dentro de um bloco verde — é o fechamento visual do card. */}
            <p className="mt-5 rounded-2xl bg-green-soft px-4 py-3 text-[15px] font-extrabold text-ink-soft ring-1 ring-green/25">
              De <span className="old-price">{b.price}</span> por{" "}
              <span className="font-display ml-0.5 text-[19px] uppercase tracking-wide text-green-ink">
                Grátis
              </span>
            </p>
          </li>
        ))}
      </ul>

      {/* Soma dos bônus: valor ancorado (riscado) e o selo de gratuidade logo
          abaixo, para o leitor ver o "196" antes de ver que não paga por ele. */}
      <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-[0_12px_32px_-18px_rgba(26,35,56,0.4)] ring-1 ring-black/5 sm:p-7">
        <p className="text-[15px] font-extrabold uppercase tracking-wide text-ink sm:text-base">
          {bonuses.totalLabel}
        </p>
        <p className="old-price text-3xl font-extrabold sm:text-4xl">
          {bonuses.totalValue}
        </p>
        {/* Selo VERDE — a cor do botão de compra, não o dourado do resto da
            dobra. Sobre o creme o selo dourado lia como mais um enfeite; o
            verde é o único lugar da página que significa "isto você não
            paga", então é ele que precisa fechar a conta dos R$ 196,00. */}
        <span className="rounded-full bg-cta px-7 py-2.5 text-base font-extrabold uppercase tracking-wide text-white shadow-[0_10px_24px_-10px_rgba(34,180,85,0.9)] sm:text-lg">
          {bonuses.freeLabel}
        </span>
      </div>

      {/* Escassez: o mesmo aviso que aparece no preço, dito na hora em que o
          leitor acabou de somar o valor dos bônus. */}
      <div className="mx-auto mt-4 flex max-w-2xl items-center gap-4 rounded-2xl bg-gold/10 px-5 py-4 text-left ring-1 ring-gold/40">
        <TriangleAlert className="size-6 shrink-0 text-ink-soft" aria-hidden />
        {/* `text-pretty` e não `text-balance`: o balanceamento deixava as três
            linhas com larguras diferentes e o bloco saía torto ao lado do
            ícone. Aqui só o órfão da última linha precisa ser evitado. */}
        <p className="text-pretty text-[15px] font-extrabold leading-relaxed text-ink sm:text-base">
          {bonuses.warning}
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <CTAButton size="lg" href="#planos" location="bonus" trackId="bonus-plans">
          {bonuses.cta}
        </CTAButton>
      </div>
    </Section>
  );
}
