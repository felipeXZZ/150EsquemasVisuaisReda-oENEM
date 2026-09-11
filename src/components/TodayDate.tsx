"use client";

import { useSyncExternalStore } from "react";

/**
 * Data do dia em que a pessoa ABRE o site, no fuso do navegador dela.
 *
 * Por que não dá para calcular no servidor: a página é pré-renderizada
 * estaticamente, então uma data vinda do servidor seria a data do BUILD e
 * envelheceria no dia seguinte.
 *
 * Por que useSyncExternalStore e não useState+useEffect: o snapshot do
 * servidor é `null` (nada é impresso no HTML, então não há divergência de
 * hidratação) e o do cliente já sai pronto no primeiro render após a
 * hidratação — sem setState dentro de efeito e sem render em cascata.
 */

// A data só muda à meia-noite; guardar em módulo mantém o snapshot estável
// entre renders, que é o que o useSyncExternalStore exige.
let cached: string | null = null;

function getSnapshot() {
  if (cached === null) cached = new Date().toLocaleDateString("pt-BR");
  return cached;
}

/** Não há nada para observar: o valor é fixo durante a sessão. */
function subscribe() {
  return () => {};
}

export function TodayDate({ className }: { className?: string }) {
  const today = useSyncExternalStore(subscribe, getSnapshot, () => null);

  // Enquanto não hidratou, reserva a largura de uma data completa para o
  // texto da barra não "pular" quando ela aparecer.
  return (
    <span className={className}>
      {today ?? <span className="invisible">00/00/0000</span>}
    </span>
  );
}
