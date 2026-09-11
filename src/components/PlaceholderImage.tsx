import { cn } from "@/lib/utils";

/**
 * ESPAÇO RESERVADO PARA MATERIAL REAL.
 *
 * Bloco com proporção fixa (zero CLS) e o texto do que precisa entrar ali.
 * Usado onde o conteúdo NÃO pode ser inventado nem substituído por ilustração:
 * prints, fotos de clientes, depoimentos e o vídeo demonstrativo.
 *
 * O visual é deliberadamente "não finalizado" (tracejado + rótulo) para nunca
 * ser confundido com prova social real numa revisão rápida da página.
 */
export function PlaceholderImage({
  label,
  ratio = "3/4",
  className,
  rounded = "rounded-2xl",
}: {
  /** Texto descritivo do que deve entrar ali. */
  label: string;
  /** aspect-ratio CSS, ex.: "1/1", "4/3", "16/9", "3/4". */
  ratio?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn(
        "flex w-full items-center justify-center overflow-hidden border-2 border-dashed border-ink/20 bg-sand p-4",
        rounded,
        className,
      )}
      role="img"
      aria-label={label}
      data-placeholder="true"
    >
      <span className="text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-ink-soft">
        {label}
      </span>
    </div>
  );
}
