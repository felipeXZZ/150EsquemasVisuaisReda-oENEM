import {
  Library,
  FileText,
  Link2,
  ListChecks,
  Zap,
  Gift,
  type LucideIcon,
} from "lucide-react";

/** Chaves usadas em `bonuses.items[].icon` (content.ts). */
const icons: Record<string, LucideIcon> = {
  library: Library,
  papers: FileText,
  link: Link2,
  checklist: ListChecks,
  zap: Zap,
};

/**
 * CAPA/MOCKUP DO BÔNUS — desenhada em CSS (sem arquivo de imagem).
 *
 * Cada bônus ganha uma capa com identidade própria (cor + ícone + título),
 * no formato de um material digital. Serve enquanto não houver a arte final:
 * basta preencher o `src` do bônus no content.ts para a capa real entrar no
 * lugar, mantendo a mesma proporção.
 */
export function BonusCover({
  tag,
  title,
  icon,
  colors,
}: {
  tag: string;
  title: string;
  icon: string;
  /** [cor principal, cor de fundo clara] */
  colors: [string, string];
}) {
  const Icon = icons[icon] ?? Gift;
  const [main, soft] = colors;

  return (
    <div
      style={{ aspectRatio: "3/4", backgroundColor: soft }}
      className="relative flex w-full flex-col justify-between overflow-hidden rounded-xl p-4 ring-1 ring-black/5"
    >
      {/* Lombada, para o bloco ler como "material" e não como card vazio */}
      <span
        aria-hidden
        style={{ backgroundColor: main }}
        className="absolute inset-y-0 left-0 w-2"
      />
      {/* Brilho suave no canto */}
      <span
        aria-hidden
        className="absolute -right-6 -top-6 size-20 rounded-full bg-white/50"
      />

      <span
        aria-hidden
        style={{ backgroundColor: main }}
        className="relative flex size-10 items-center justify-center rounded-full text-white shadow-sm"
      >
        <Icon className="size-5" />
      </span>

      <span className="relative">
        <span
          style={{ color: main }}
          className="block text-[9px] font-extrabold uppercase tracking-widest"
        >
          {tag}
        </span>
        <span className="mt-1 block text-[12px] font-extrabold leading-tight text-ink">
          {title}
        </span>
      </span>
    </div>
  );
}
