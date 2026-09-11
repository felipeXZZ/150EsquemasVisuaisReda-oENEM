import { Check } from "lucide-react";
import { finalCta } from "@/content";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";

/**
 * 13. CTA FINAL — faixa escura antes do rodapé.
 *
 * Último empurrão: repete a promessa, o pacote e o preço, e devolve a pessoa
 * aos planos (#planos) em vez de mandar direto ao checkout — quem chegou até
 * aqui sem clicar costuma querer conferir a comparação uma última vez.
 */
export function FinalCTA() {
  return (
    <section className="bg-plum px-5 py-16 text-center text-white sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-balance text-[1.85rem] leading-[1.1] sm:text-[2.75rem]">
          <Highlight text={finalCta.title} tone="gold" />
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink-invert sm:text-lg">
          {finalCta.subtitle}
        </p>

        <p className="mx-auto mt-8 inline-flex rounded-full bg-white/10 px-5 py-2 text-[13px] font-extrabold uppercase tracking-wide text-gold ring-1 ring-gold/40">
          {finalCta.highlight}
        </p>

        <p className="font-display mt-5 text-5xl leading-none text-white sm:text-6xl">
          {finalCta.price}
        </p>
        <p className="mt-2 text-[12px] font-extrabold uppercase tracking-wide text-ink-invert">
          {finalCta.priceNote}
        </p>

        {/* Sem pulso/brilho: a pedido, o efeito de atenção ficou EXCLUSIVO do
            botão da hero — repetido em toda dobra ele vira ruído e para de
            chamar atenção justamente onde importa. */}
        <div className="mt-8 flex w-full justify-center">
          <CTAButton
            size="lg"
            href="#planos"
            location="final-cta"
            trackId="final-cta-plans"
          >
            {finalCta.cta}
          </CTAButton>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-bold sm:text-[13px]">
          {finalCta.badges.map((b) => (
            <li key={b} className="inline-flex items-center gap-1.5">
              <Check className="size-4 shrink-0 text-gold" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
