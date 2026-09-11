import { Search, ClipboardList, Sparkles } from "lucide-react";
import { steps } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";

const icons = {
  search: Search,
  list: ClipboardList,
  sparkles: Sparkles,
};

/**
 * 5. SIMPLES ASSIM — os 3 passos entre escolher o tema e a festa montada.
 * Mata a objeção "será que eu consigo fazer isso?".
 */
export function ThreeSteps() {
  return (
    <Section bg="cream">
      <SectionHead>
        <Eyebrow tone="purple">{steps.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
          <Highlight text={steps.title} tone="purple" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {steps.subtitle}
        </p>
      </SectionHead>

      <ol className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-6">
        {steps.items.map((s) => {
          const Icon = icons[s.icon];
          return (
            <li key={s.n} className="flex flex-col items-center text-center">
              {/* Quadro CHEIO no azul da marca: com o bege claro de antes
                  (bg-lilac) sobre o fundo creme, a diferença era de dois
                  tons e o ícone parecia apagado. */}
              <span className="relative flex size-16 items-center justify-center rounded-2xl bg-purple-ink text-white shadow-[0_12px_26px_-12px_rgba(29,78,216,0.9)]">
                <Icon className="size-7" aria-hidden />
                <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-cta text-[13px] font-extrabold text-white shadow-sm">
                  {s.n}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-ink sm:text-xl">
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                {s.desc}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-12 flex justify-center">
        <CTAButton size="lg" href="#planos" location="steps" trackId="steps-plans">
          {steps.cta}
        </CTAButton>
      </div>
    </Section>
  );
}
