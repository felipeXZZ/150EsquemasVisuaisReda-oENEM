import { cn } from "@/lib/utils";

/** Rótulo curto em maiúsculas acima dos títulos de seção. */
export function Eyebrow({
  children,
  className,
  tone = "purple",
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * purple / green / ink → fundo CLARO (todos acima de 4,5:1).
   * gold → fundo ESCURO (o amarelo some sobre creme).
   */
  tone?: "purple" | "green" | "ink" | "gold";
}) {
  const toneClass =
    tone === "green"
      ? "text-green-ink"
      : tone === "ink"
        ? "text-ink-soft"
        : tone === "gold"
          ? "text-gold"
          : "text-purple-ink";

  return (
    <p className={cn("eyebrow text-xs font-extrabold uppercase", toneClass, className)}>
      {children}
    </p>
  );
}
