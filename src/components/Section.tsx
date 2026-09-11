import { cn } from "@/lib/utils";

type Bg = "cream" | "white" | "sand" | "lilac" | "green" | "plum";

const bgMap: Record<Bg, string> = {
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  lilac: "bg-lilac text-ink",
  green: "bg-green-soft text-ink",
  plum: "bg-plum text-white",
};

/**
 * Container de seção: fundo alternado e respiro vertical consistente.
 * O padding é generoso de propósito — o briefing pede bastante espaço entre
 * as seções, e no mobile isso separa cada etapa do argumento de venda.
 */
export function Section({
  children,
  bg = "cream",
  className,
  id,
}: {
  children: React.ReactNode;
  bg?: Bg;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("px-5 py-14 sm:py-20", bgMap[bg], className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Cabeçalho padrão de seção (eyebrow + título + texto), centralizado. */
export function SectionHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {children}
    </div>
  );
}
