import { Plus } from "lucide-react";
import { faq } from "@/content";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAButton } from "@/components/CTAButton";

/**
 * 12. FAQ — accordion em <details>/<summary> nativos.
 *
 * Sem biblioteca de accordion: o elemento nativo abre antes mesmo da
 * hidratação, tem acessibilidade de fábrica e mantém a seção como Server
 * Component (zero JS no cliente) — o que importa num tráfego de anúncio em
 * conexão lenta. A seta gira via seletor de [open].
 */
export function FAQSection() {
  return (
    <Section bg="cream">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Eyebrow tone="purple">{faq.eyebrow}</Eyebrow>
          <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
            {faq.title}
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {faq.items.map((item, i) => (
            <details
              key={i}
              // Mesmo `name` nos <details> = accordion exclusivo nativo: abrir
              // uma pergunta fecha a anterior, sem JS no cliente. Em navegador
              // antigo o atributo é ignorado e volta a abrir várias — degrada
              // para o comportamento de antes, nunca quebra.
              name="faq"
              className="group overflow-hidden rounded-2xl border border-border bg-lilac"
            >
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-extrabold text-ink transition-colors hover:bg-sand [&::-webkit-details-marker]:hidden">
                {item.q}
                {/* Bolinha azul cheia com um "+" branco. Aberta, ela gira 45°
                    e o "+" vira "×" — o mesmo gesto diz "abre" e "fecha" sem
                    trocar de ícone.

                    `purple-ink` (e não o `purple` vivo) porque aqui o azul
                    carrega um ícone branco: fecha 6,3:1, contra os 3,1:1 do
                    vivo. Variante explícita no seletor: o `group-open:` do
                    Tailwind não gera regra para <details open>. */}
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-ink text-white transition-transform duration-200 [details[open]_&]:rotate-45"
                >
                  <Plus className="size-[18px]" strokeWidth={3} />
                </span>
              </summary>
              <div className="px-5 pb-5 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton size="lg" href="#planos" location="faq" trackId="faq-plans">
            {faq.cta}
          </CTAButton>
        </div>
      </div>
    </Section>
  );
}
