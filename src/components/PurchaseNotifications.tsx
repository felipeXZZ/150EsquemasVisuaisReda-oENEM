"use client";

import { useEffect, useRef, useState } from "react";
import { Check, PartyPopper } from "lucide-react";
import { purchaseNotifications as cfg } from "@/content";

/**
 * Balãozinho de "fulana acabou de comprar" no canto inferior ESQUERDO.
 *
 * O primeiro aparece `firstDelaySeconds` depois de a página abrir; cada um
 * fica `visibleSeconds` na tela e o próximo entra depois de um intervalo
 * sorteado entre `gapSecondsMin` e `gapSecondsMax` — o sorteio existe para o
 * ritmo não virar um relógio, que é como se percebe que o aviso é automático.
 *
 * A lista de pessoas vive em content.ts e roda em círculo, sem repetir a mesma
 * duas vezes seguidas. ⚠️ Leia o aviso de publicidade enganosa que está lá:
 * este componente AFIRMA vendas, e por isso só pode ficar no ar com dados
 * reais.
 *
 * Canto esquerdo de propósito: o direito é a área do botão de WhatsApp/topo em
 * quase todo site.
 *
 * Encostado embaixo (`bottom-4`), como um aviso de sistema — é o lugar onde a
 * pessoa espera esse tipo de balão, e longe do miolo da página. ⚠️ Se um dia
 * o <StickyMobileCTA /> voltar ao page.tsx, ele ocupa a faixa de baixo inteira
 * no celular e passa por cima daqui: nesse caso suba para `bottom-24`.
 *
 * Fica FORA do <main> (é camada, não conteúdo) e abaixo do popup de upsell no
 * empilhamento (z-40 contra z-[120]): se os dois coincidirem, o popup manda.
 *
 * Respeita "reduzir movimento": sem prefers-reduced-motion o cartão desliza da
 * esquerda; com ele, só aparece e some.
 */
export function PurchaseNotifications() {
  /** Índice da pessoa da vez em `cfg.people`. -1 = nenhuma ainda. */
  const [index, setIndex] = useState(-1);
  /** Cartão na tela? Separado do índice para o slide de saída acontecer. */
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const people = cfg.people;
    if (people.length === 0) return;

    const wait = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    let next = 0;

    /** Mostra uma pessoa, esconde, e agenda a próxima. Repete pra sempre. */
    const cycle = () => {
      setIndex(next);
      setVisible(true);
      next = (next + 1) % people.length;

      wait(cfg.visibleSeconds * 1000, () => {
        setVisible(false);
        const gap =
          cfg.gapSecondsMin +
          Math.random() * (cfg.gapSecondsMax - cfg.gapSecondsMin);
        wait(gap * 1000, cycle);
      });
    };

    wait(cfg.firstDelaySeconds * 1000, cycle);

    const running = timers.current;
    return () => {
      running.forEach(clearTimeout);
      running.length = 0;
    };
  }, []);

  if (index < 0) return null;
  const person = cfg.people[index];

  return (
    <div
      aria-label={cfg.ariaLabel}
      // aria-live polite: o leitor de tela anuncia no intervalo dele, sem
      // interromper a leitura da página.
      aria-live="polite"
      // w-fit + max-w da largura da tela: o cartão tem o tamanho do texto que
      // está nele, e só encolhe se não couber na tela. Nada de truncate/"…" —
      // nome cortado com reticências some justo com a informação que importa.
      className={`pointer-events-none fixed bottom-4 left-3 z-40 w-fit max-w-[calc(100vw-1.5rem)] transition-all duration-500 ease-out sm:bottom-5 sm:left-5 motion-reduce:transition-opacity ${
        visible
          ? "translate-x-0 opacity-100"
          : "-translate-x-4 opacity-0 motion-reduce:translate-x-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_10px_28px_-10px_rgba(26,35,56,0.35)]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-soft">
          <PartyPopper aria-hidden className="size-[1.15rem] text-green-ink" />
        </span>
        <span>
          {/* text-pretty evita a última linha com uma palavra só, caso a tela
              seja estreita a ponto de a frase precisar quebrar. */}
          <span className="block text-pretty text-[0.875rem] font-bold leading-tight text-ink">
            {person.name} {cfg.actionLabel}
          </span>
          <span className="mt-1 flex items-start gap-1 text-[0.75rem] leading-tight text-ink-soft">
            <Check aria-hidden className="mt-px size-3.5 shrink-0 text-green-ink" />
            <span>
              {person.city} · {cfg.timeLabel}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
