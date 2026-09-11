"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Rede de segurança (App Router). Se um erro de renderização escapar em algum
 * webview atípico (o tráfego vem de anúncios abertos no navegador in-app do
 * Instagram/Facebook/TikTok), o Next mostra ESTA tela em vez de uma página em
 * branco — página em branco é venda 100% perdida. Mantido leve e sem
 * dependências para carregar mesmo sob falha.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      (
        window as unknown as { clarity?: (...a: unknown[]) => void }
      ).clarity?.("event", "render_error");
    } catch {
      /* nunca deixar o handler de erro lançar */
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <h1 className="font-display text-2xl text-ink sm:text-3xl">
        Recarregue a página
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink-soft">
        Tivemos um probleminha ao abrir. É rápido: toque abaixo para tentar de
        novo ou ir direto para os planos.
      </p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-6 font-cta text-base uppercase text-white shadow-[0_10px_24px_-8px_rgba(34,180,85,0.7)]"
        >
          Tentar de novo
        </button>
        <Link
          href="/#planos"
          className="flex min-h-[48px] items-center justify-center rounded-2xl border border-ink/20 px-6 font-cta text-sm uppercase text-ink"
        >
          Ver os planos
        </Link>
      </div>
    </div>
  );
}
