"use client";

import { useEffect } from "react";
import { BACK_REDIRECT_URL } from "@/content";

// Enquanto for o placeholder, o redirect fica desligado (segurança).
const PLACEHOLDER = "meubackredirect.com.br";

/**
 * Back-redirect: ao apertar "voltar", leva o visitante para BACK_REDIRECT_URL,
 * preservando os parâmetros de query (UTMs). Empilha o histórico para capturar
 * o clique no "voltar". Baseado no script padrão de back-redirect.
 */
export function BackRedirect() {
  useEffect(() => {
    const target = BACK_REDIRECT_URL?.trim();
    if (!target || target.includes(PLACEHOLDER)) return; // não configurado

    const search = document.location.search.replace("?", "");
    const url =
      target + (target.indexOf("?") > 0 ? "&" : "?") + search;

    history.pushState({}, "", location.href);
    history.pushState({}, "", location.href);
    history.pushState({}, "", location.href);

    const onPopState = () => {
      setTimeout(() => {
        location.href = url;
      }, 1);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
}
