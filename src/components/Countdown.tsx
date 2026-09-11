"use client";

import { useEffect, useState } from "react";

/**
 * Contagem regressiva REAL até uma data fixa (ISO) definida no content.ts.
 *
 * Regra deliberada: NÃO existe contador "evergreen" que reinicia a cada visita.
 * Se a promoção não tem prazo de verdade, o campo `deadline` fica null e nem
 * este componente é montado — nada de urgência fabricada.
 *
 * Quando o prazo passa, o componente some sozinho (não zera nem reinicia).
 */
const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({
  deadline,
  label,
}: {
  /** data ISO de fim da promoção, ex.: "2026-08-31T23:59:59-03:00". */
  deadline: string;
  label?: string;
}) {
  const deadlineMs = new Date(deadline).getTime();
  // Fica null no servidor: o relógio de quem visita é que manda, e imprimir um
  // valor no HTML causaria divergência de hidratação.
  const [secs, setSecs] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(deadlineMs)) return;
    // Guarda só o total de segundos: quando o valor não muda, o setState com o
    // mesmo número não provoca re-render. Por isso dá para consultar a cada
    // 250ms (o contador aparece quase instantaneamente ao abrir a página) sem
    // pagar 4 renders por segundo.
    const update = () => {
      const diff = Math.floor((deadlineMs - Date.now()) / 1000);
      setSecs(diff > 0 ? diff : null);
    };
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [deadlineMs]);

  if (secs === null) return null;

  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      {label && <span className="font-medium opacity-90">{label}</span>}
      <span className="font-extrabold">
        {d > 0 && `${d}d `}
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </span>
  );
}
