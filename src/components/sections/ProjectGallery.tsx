import { gallery, getTheme, tierLabels, type Tier } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { Media } from "@/components/Media";
import { Marquee } from "@/components/Marquee";
import { CTAButton } from "@/components/CTAButton";

/** Cor do ponto da etiqueta de faixa de custo. */
const tierDot: Record<Tier, string> = {
  economica: "bg-green",
  intermediaria: "bg-gold",
  completa: "bg-purple",
};

/**
 * 3. O QUE VOCÊ VAI RECEBER — galeria dos projetos.
 *
 * Cada card carrega o número do projeto, o tema e uma etiqueta de faixa de
 * custo. As faixas são sempre apresentadas como ESTIMATIVA (nunca como preço
 * garantido), reforçado pela nota ao final da seção.
 */
export function ProjectGallery() {
  return (
    <Section bg="white" id="projetos">
      <SectionHead>
        <Eyebrow tone="purple">{gallery.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
          <Highlight text={gallery.title} tone="purple" />
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {gallery.paragraph}
        </p>
      </SectionHead>

      {/* Galeria — 2 colunas no celular (leitura tipo mural), até 5 no desktop */}
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
        {gallery.items.map((p) => {
          const t = getTheme(p.theme);
          const tier = tierLabels[p.tier];
          return (
            <li key={p.code} className="group">
              <figure className="relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-14px_rgba(26,35,56,0.4)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-1">
                <Media
                  src={p.src || undefined}
                  theme={p.theme}
                  label={`${p.code} — festa com tema ${t.name}`}
                  ratio="3/4"
                  rounded="rounded-none"
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                />

                {/* Etiqueta de faixa de custo */}
                <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-ink shadow-sm backdrop-blur-sm">
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full ${tierDot[p.tier]}`}
                  />
                  {tier.label}
                </span>

                <figcaption className="px-3 pb-3 pt-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-purple-ink">
                    {p.code}
                  </p>
                  <p className="mt-0.5 text-[13px] font-extrabold leading-tight text-ink">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-ink-soft">
                    {tier.budget}
                  </p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      {/* Faixa com os demais temas, em loop */}
      <p className="mt-12 text-center text-[13px] font-bold text-ink-soft">
        {gallery.stripLabel}
      </p>
      <div className="mt-5">
        <Marquee themes={gallery.strip} />
      </div>

      <div className="mt-10 flex justify-center">
        <CTAButton size="lg" href="#planos" location="gallery" trackId="gallery-plans">
          {gallery.cta}
        </CTAButton>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-ink-soft">
        {gallery.note}
      </p>
    </Section>
  );
}
