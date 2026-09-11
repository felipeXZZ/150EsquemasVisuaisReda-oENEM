import { Check, X } from "lucide-react";
import { comparison } from "@/content";
import { Section } from "@/components/Section";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";

/**
 * 7. DIFERENCIAÇÃO — "Pinterest mostra a festa. Nós mostramos como fazer."
 *
 * É a seção que define a categoria do produto na cabeça da visitante: ela já
 * tem inspiração salva; o que falta é o plano. Por isso o contraste entre as
 * duas colunas é o elemento visual mais forte da página.
 *
 * Dobra CLARA (branca). Ficava azul escura como o carrossel logo acima e as
 * duas viravam um bloco escuro só, de duas telas de altura — sem essa
 * respirada no meio, nem o carrossel nem esta seção pareciam começar. Branco
 * (e não creme) porque a dobra de bônus logo abaixo já é creme.
 *
 * Com a seção clara, o contraste entre as colunas inverte: "procurar
 * inspiração" fica APAGADA (creme, recuada) e "escolher um projeto pronto"
 * fica ESCURA com anel dourado — a mesma linguagem do card do Plano Completo
 * nos planos, que é o outro lugar da página onde a escolha certa é a escura.
 */
export function PinterestComparison() {
  return (
    <Section bg="white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-balance text-[1.9rem] leading-[1.1] text-ink sm:text-5xl">
          {/* `purple` (azul da marca) no lugar do dourado: sobre branco o
              amarelo some — ver a nota de `tone` em Highlight.tsx. */}
          <Highlight text={comparison.title} tone="purple" />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
          {comparison.subtitle}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 md:grid-cols-2 md:gap-6">
        {/* Antes — juntar referências soltas. Card em TOM VERMELHO (fundo
            rosado, anel e texto no vermelho da marca): o creme neutro que
            ficava aqui não dizia nada, só parecia "a outra coluna". Vermelho
            nomeia o lado como o problema antes mesmo de a visitante ler os
            itens, e faz par com o azul+dourado do lado certo. */}
        <div className="rounded-3xl bg-danger-vivid/[0.06] p-6 ring-1 ring-danger-vivid/20 sm:p-7">
          <h3 className="text-lg font-extrabold text-danger sm:text-xl">
            {comparison.before.title}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {comparison.before.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] font-semibold leading-snug text-danger/85"
              >
                {/* X vermelho SOLTO e grosso, sem chip atrás. Com o card já
                    rosado, o quadradinho cheio virava um bloco dentro de outro
                    bloco da mesma cor; o traço puro marca mais e espelha o
                    peso do ✅ da coluna certa. */}
                <X
                  aria-hidden
                  className="mt-px size-5 shrink-0 text-danger-vivid"
                  strokeWidth={4}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Depois — escolher um projeto pronto. Card em TOM VERDE (fundo
            menta, anel e texto no verde da marca), par exato do card vermelho
            ao lado: a leitura vira semáforo — vermelho é o que ela faz hoje,
            verde é o que ela passa a ter. Era azul profundo com anel dourado
            (o card do Plano Completo adiantado); o escuro ganhava a atenção
            pelo peso, não pelo significado, e brigava com o vermelho novo. */}
        {/* O card certo tem que PESAR mais que o errado, senão a seção vira
            duas listas empatadas. O destaque vem todo em verde: menta mais
            forte que o rosa do card ao lado, anel de 2px no verde do botão de
            compra e sombra verde por baixo (o mesmo brilho do selo "hoje:
            grátis"). Nada de escuro nem de dourado — a cor continua sendo o
            argumento. */}
        <div className="relative rounded-3xl bg-green/[0.13] p-6 shadow-[0_24px_60px_-26px_rgba(34,180,85,0.75)] ring-2 ring-cta/70 sm:p-7">
          <h3 className="text-xl font-extrabold text-green-ink sm:text-2xl">
            {comparison.after.title}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {comparison.after.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base font-bold leading-snug text-green-ink sm:text-[17px]"
              >
                {/* Check VERDE SOLTO e grosso, sem chip atrás — espelha o X do
                    card vermelho. Sobre o menta, o quadradinho cheio virava
                    bloco dentro de bloco da mesma cor. */}
                <Check
                  aria-hidden
                  className="mt-0.5 size-[22px] shrink-0 text-green-ink"
                  strokeWidth={4}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <CTAButton
          size="lg"
          href="#planos"
          location="comparison"
          trackId="comparison-plans"
        >
          {comparison.cta}
        </CTAButton>
      </div>
    </Section>
  );
}
