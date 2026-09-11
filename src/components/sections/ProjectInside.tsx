import { Check } from "lucide-react";
import { projectInside } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { Media } from "@/components/Media";

/**
 * 6. COMO É UM PROJETO POR DENTRO — "não é só uma foto bonita".
 *
 * Reproduz visualmente uma página interna do material: referência visual à
 * esquerda e, à direita, a ficha do projeto (espaço, dificuldade, orçamento,
 * tempo de montagem, paleta e elementos). É o que separa a oferta de um
 * simples álbum de inspirações.
 */
export function ProjectInside() {
  const d = projectInside.demo;

  return (
    <Section bg="white">
      <SectionHead>
        <Eyebrow tone="purple">{projectInside.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
          <Highlight text={projectInside.title} tone="purple" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {projectInside.subtitle}
        </p>
      </SectionHead>

      {/* "Página" do projeto */}
      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-28px_rgba(26,35,56,0.5)] ring-1 ring-black/5">
        <div className="grid gap-0 md:grid-cols-[0.85fr_1fr]">
          {/* Referência visual */}
          <div className="relative">
            <Media
              src={d.src || undefined}
              theme={d.theme}
              label={`${d.code}, ${d.name}`}
              ratio="3/4"
              rounded="rounded-none"
              className="h-full"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-ink shadow-sm">
              Referência visual
            </span>
          </div>

          {/* Ficha do projeto */}
          <div className="p-6 sm:p-8">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-purple-ink">
              {d.code}
            </p>
            <h3 className="font-display mt-1 text-2xl leading-tight text-ink sm:text-3xl">
              {d.name}
            </h3>

            {/* Especificações */}
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
              {d.specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                    {s.label}
                  </dt>
                  <dd className="mt-0.5 text-[13px] font-extrabold leading-snug text-ink">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Paleta */}
            <h4 className="mt-7 text-[12px] font-extrabold uppercase tracking-wide text-ink">
              {d.paletteTitle}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-3">
              {d.palette.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-7 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[12px] font-bold text-ink-soft">
                    {c.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* Elementos principais */}
            <h4 className="mt-7 text-[12px] font-extrabold uppercase tracking-wide text-ink">
              {d.elementsTitle}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {d.elements.map((e) => (
                <li
                  key={e}
                  className="rounded-full bg-sand px-3 py-1.5 text-[12px] font-bold text-ink"
                >
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Você também encontra */}
        <div className="border-t border-border bg-lilac px-6 py-6 sm:px-8">
          <h4 className="text-[13px] font-extrabold uppercase tracking-wide text-ink">
            {projectInside.includesTitle}
          </h4>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {projectInside.includes.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[14px] font-bold text-ink"
              >
                <Check className="size-4 shrink-0 text-green-ink" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-ink-soft">
        {projectInside.note}
      </p>
    </Section>
  );
}
