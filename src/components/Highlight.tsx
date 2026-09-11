import React from "react";
import { cn } from "@/lib/utils";

/**
 * Renderiza um headline com trechos destacados.
 * Sintaxe na string de conteúdo (content.ts):
 *   {{texto}}  → destaque colorido, mesmo tamanho
 *   [[numero]] → destaque colorido em 1,5x — trata o número como elemento
 *                gráfico, comunicando volume antes mesmo da leitura
 *   \n         → quebra de linha manual
 */
export function Highlight({
  text,
  tone = "purple",
  underline = false,
}: {
  text: string;
  /**
   * "purple" para fundo CLARO (azul escuro, 6,3:1).
   * "gold" só para fundo ESCURO — sobre creme o amarelo desaparece.
   * "green" para fundo CLARO quando o destaque é economia/oferta (5,2:1).
   */
  tone?: "purple" | "gold" | "green";
  /** true: risca um traço amarelo por baixo do trecho {{destacado}}. */
  underline?: boolean;
}) {
  const parts = text.split(/(\[\[.*?\]\]|\{\{.*?\}\})/g).filter(Boolean);
  const cls =
    tone === "gold" ? "hl-gold" : tone === "green" ? "hl-green" : "hl-purple";
  // 1.5em (e não px) para escalar junto com o tamanho responsivo do headline.
  const numCls = cn(cls, "text-[1.5em] leading-none");

  return (
    <>
      {parts.map((part, i) => {
        const isNumber = part.startsWith("[[") && part.endsWith("]]");
        const isPlain = part.startsWith("{{") && part.endsWith("}}");

        if (isNumber || isPlain) {
          return (
            <span
              key={i}
              className={cn(
                isNumber ? numCls : cls,
                isPlain && underline && "hl-underline",
              )}
            >
              {part.slice(2, -2)}
            </span>
          );
        }
        const lines = part.split("\n");
        return (
          <React.Fragment key={i}>
            {lines.map((ln, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {ln}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}
