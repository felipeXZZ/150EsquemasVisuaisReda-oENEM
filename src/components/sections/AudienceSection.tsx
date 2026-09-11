import { audience } from "@/content";
import { Section } from "@/components/Section";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";

/**
 * 7. SE VOCÊ... — a seção que responde "isso é para mim?".
 *
 * Entrou no lugar da comparação "apostila x esquema visual" (o componente
 * continua em PinterestComparison.tsx, desligado no page.tsx).
 *
 * Era uma lista de rótulos ("Estudantes que vão fazer o ENEM"); virou uma
 * GRADE DE ESPELHOS: quatro cartões que descrevem o que a pessoa faz hoje.
 * Quem varre a página não lê os quatro — para no que descreve a própria
 * semana dela, e é isso que a seção precisa entregar antes da dobra de bônus.
 *
 * Fundo BRANCO: a dobra escura logo acima é o carrossel, e o claro aqui
 * devolve a alternância clara/escura da página. Os cartões são `lilac`, que
 * é o mesmo cinza-azulado dos itens do FAQ — separa cartão de fundo sem
 * desenhar borda.
 *
 * O título é a abertura da frase de cada cartão, e não um enunciado próprio
 * ("Se você... trava na folha em branco"). Vai em duas cores (o {{você}} em
 * azul, via `Highlight`), como o resto dos títulos da página.
 *
 * Os ícones são emoji vindos do `content.ts` (não `lucide`): quatro desenhos
 * coloridos e distintos, onde o `lucide` daria quatro traços iguais. Ficam
 * `aria-hidden` — o texto do cartão já diz tudo, e um leitor de tela
 * anunciando "ampulheta" antes de cada frase só atrasaria a leitura.
 */
export function AudienceSection() {
  return (
    <Section bg="white">
      <h2 className="font-display text-balance mx-auto max-w-3xl text-center text-[2rem] leading-tight text-ink sm:text-[2.75rem]">
        <Highlight text={audience.title} tone="purple" />
      </h2>

      {/* Uma coluna no celular, duas no tablet, as quatro no desktop — a
          referência mostra a fileira única, que só cabe a partir de lg.
          `items-stretch` (padrão do grid) mantém os quatro cartões com a
          MESMA altura: com alturas diferentes, a fileira lê como bagunça. */}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4">
        {audience.items.map((item) => (
          <li
            key={item.text}
            /* O anel escuro fraco é o que dá contorno ao cartão sobre o
               branco. O destacado troca por vermelho — a mesma cor de
               atenção do resto da página — e não por azul: em azul ele se
               dissolveria no título e no CTA. */
            className={
              "rounded-2xl bg-lilac p-5 ring-1 sm:p-6 " +
              ("destaque" in item && item.destaque
                ? "ring-danger-vivid/45"
                : "ring-black/5")
            }
          >
            <span aria-hidden className="block text-[1.75rem] leading-none">
              {item.icon}
            </span>
            {/* `text-ink-soft` com o corpo em 15px: é texto de apoio, e o
                peso da seção está no título e nos ícones. */}
            <p className="mt-4 text-[15px] font-medium leading-snug text-ink-soft">
              {item.text}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <CTAButton
          size="lg"
          href="#planos"
          location="audience"
          trackId="audience-plans"
        >
          {audience.cta}
        </CTAButton>
      </div>
    </Section>
  );
}
