"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { stickyBar } from "@/content";
import { PAGE_VARIANT } from "@/lib/track";

/**
 * Barra fixa no rodapé, SÓ no mobile (lg:hidden).
 *
 * Aparece depois que a pessoa passa da primeira dobra e SOME quando a seção
 * de planos entra na tela — para não cobrir os próprios botões dos planos
 * nem atrapalhar a leitura do FAQ.
 */
export function StickyMobileCTA() {
  const [pastFold, setPastFold] = useState(false);
  const [plansVisible, setPlansVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastFold(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const plansEl = document.getElementById("planos");
    let io: IntersectionObserver | null = null;
    if (plansEl) {
      io = new IntersectionObserver(
        ([entry]) => setPlansVisible(entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(plansEl);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastFold && !plansVisible;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(26,35,56,0.14)] backdrop-blur-sm transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
            {stickyBar.label}
          </p>
          <p className="text-xl font-extrabold text-ink">{stickyBar.price}</p>
        </div>
        <a
          href="#planos"
          tabIndex={show ? undefined : -1}
          data-cta-location="sticky"
          data-track-id="sticky-plans"
          data-page-variant={PAGE_VARIANT}
          className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-4 py-3.5 text-center font-cta text-[0.8rem] uppercase leading-tight tracking-wide text-white shadow-[0_10px_24px_-8px_rgba(34,180,85,0.7)] active:translate-y-px"
        >
          {stickyBar.cta}
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </a>
      </div>
    </div>
  );
}
