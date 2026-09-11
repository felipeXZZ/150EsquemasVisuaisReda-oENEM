"use client";

import { useEffect, useRef, useState } from "react";
import { urgencyBar } from "@/content";
import { Countdown } from "@/components/Countdown";
import { TodayDate } from "@/components/TodayDate";

/**
 * 1. BARRA DE URGÊNCIA — faixa fina grudada no topo.
 *
 * Ela acompanha a rolagem SÓ enquanto a hero está na tela: assim que a hero
 * sai por cima, a faixa desliza para fora e não volta mais até a pessoa
 * subir de novo. A ideia é dar o aviso na primeira dobra sem roubar altura
 * de tela no resto da página (ainda mais no celular).
 *
 * Duas mecânicas independentes, ligadas pelo content.ts:
 *  - `showTodayDate`: anexa a data do dia em que a pessoa abre o site (lida
 *    no navegador dela — o servidor não serve, porque a página é estática e
 *    a data ficaria congelada no dia do build);
 *  - `deadline`: contador regressivo até uma data REAL de fim da promoção.
 */
export function UrgencyBar() {
  const hasDeadline =
    !!urgencyBar.deadline && !Number.isNaN(new Date(urgencyBar.deadline).getTime());

  // Começa VISÍVEL: o HTML estático já sai com a barra na tela, então ela não
  // "pisca" entrando depois que o JS carrega.
  const [show, setShow] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    // rootMargin no topo = altura da própria barra: sem isso a hero ainda
    // conta como "visível" pela fresta que fica atrás da faixa.
    const barHeight = barRef.current?.offsetHeight ?? 0;
    const io = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold: 0, rootMargin: `-${barHeight}px 0px 0px 0px` },
    );
    io.observe(heroEl);
    return () => io.disconnect();
  }, []);

  // Fundo VERMELHO de alerta (--color-danger, #C62B24), a pedido: a faixa
  // volta a ler como aviso de prazo em vez de topo de marca. O verde continua
  // reservado para os botões de compra. Com texto branco o vermelho fecha
  // 5,6:1, acima dos 4,5:1 da WCAG AA.
  // (Versão anterior: `bg-purple-ink`, azul da marca.)
  return (
    <div
      ref={barRef}
      aria-hidden={!show}
      className={`sticky top-0 z-50 w-full bg-danger px-4 py-2 text-white shadow-sm transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <p className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-center text-[12px] font-bold uppercase tracking-wide sm:text-[13px]">
        <span>
          <span aria-hidden>{urgencyBar.emoji}</span> {urgencyBar.text}
        </span>
        {urgencyBar.showTodayDate && <TodayDate className="tabular-nums" />}
        {hasDeadline && (
          <Countdown
            deadline={urgencyBar.deadline as string}
            label={urgencyBar.countdownLabel}
          />
        )}
      </p>
    </div>
  );
}
