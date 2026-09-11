import { getTheme } from "@/content";
import { ThemeArt } from "./ThemeArt";

/**
 * Faixa de temas que passa sozinha, em loop contínuo (CSS puro, sem JS).
 * Os itens são duplicados e o track anima até -50%, criando um loop sem
 * emenda. Pausa no hover e respeita prefers-reduced-motion (globals.css).
 *
 * Como as miniaturas são SVG inline (<ThemeArt/>), não há request de imagem
 * nem lazy-loading para gerenciar: a faixa nunca aparece com buraco.
 */
export function Marquee({ themes: ids }: { themes: string[] }) {
  const loop = [...ids, ...ids];

  return (
    <div className="marquee-mask relative w-full overflow-hidden">
      <div className="marquee-track flex w-max">
        {loop.map((id, i) => {
          const t = getTheme(id);
          const duplicate = i >= ids.length;
          return (
            <figure
              key={i}
              aria-hidden={duplicate}
              className="mr-3 w-36 shrink-0 sm:w-44"
            >
              <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
                <div className="aspect-[3/4]">
                  <ThemeArt
                    theme={id}
                    label={duplicate ? "" : `Tema ${t.name}`}
                  />
                </div>
              </div>
              <figcaption className="mt-2 text-center text-[12px] font-bold text-ink">
                {t.name}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
