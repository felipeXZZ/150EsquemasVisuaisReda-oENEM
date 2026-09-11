"use client";

import { useEffect } from "react";

/**
 * Garante que a página sempre abra no TOPO — ao recarregar ou ao voltar
 * (botão "voltar" / bfcache). Desativa o scroll restoration do navegador,
 * que normalmente devolve o usuário para onde ele estava.
 */
export function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const toTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    toTop();
    // pageshow cobre o cache de voltar/avançar (Safari/Firefox)
    window.addEventListener("pageshow", toTop);
    return () => window.removeEventListener("pageshow", toTop);
  }, []);

  return null;
}
