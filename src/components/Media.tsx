import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeArt } from "./ThemeArt";
import { PlaceholderImage } from "./PlaceholderImage";

/**
 * Bloco visual de proporção fixa (zero CLS) que resolve, nesta ordem:
 *
 *  1. `src` preenchido  → a FOTO REAL (next/image, otimizada);
 *  2. `theme` informado → a ilustração vetorial da festa (<ThemeArt/>);
 *  3. nenhum dos dois   → o placeholder cinza descritivo.
 *
 * Trocar ilustração por foto = preencher o `src` no content.ts. O container
 * mantém a mesma proporção, então o layout nunca "pula".
 */
export function Media({
  src,
  theme,
  label,
  ratio = "3/4",
  className,
  rounded = "rounded-2xl",
  eager = false,
  sizes = "100vw",
  fit = "cover",
  quality = 75,
}: {
  /** caminho da foto em /public (ex.: "/festas/safari-boho.webp"). */
  src?: string;
  /** id do tema em `themes` — usado para desenhar a ilustração de fallback. */
  theme?: string;
  /** texto alternativo / descrição. */
  label: string;
  ratio?: string;
  className?: string;
  rounded?: string;
  /**
   * true para a imagem acima da dobra (candidata a LCP): carrega em `eager`
   * com fetchPriority alto. O antigo `priority` foi descontinuado no Next 16
   * — a documentação recomenda `loading`/`fetchPriority` no lugar.
   */
  eager?: boolean;
  sizes?: string;
  fit?: "cover" | "contain";
  quality?: number;
}) {
  if (!src) {
    if (theme) {
      return (
        <div
          style={{ aspectRatio: ratio }}
          className={cn("relative w-full overflow-hidden", rounded, className)}
        >
          <ThemeArt theme={theme} label={label} />
        </div>
      );
    }
    return (
      <PlaceholderImage
        label={label}
        ratio={ratio}
        className={className}
        rounded={rounded}
      />
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn("relative w-full overflow-hidden", rounded, className)}
    >
      <Image
        src={src}
        alt={label}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        quality={quality}
        className={fit === "contain" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
