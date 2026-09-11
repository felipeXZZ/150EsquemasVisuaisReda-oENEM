"use client";

import { useEffect } from "react";
import { trackEvent, trackCtaClick, trackInitiateCheckout, withUtms } from "@/lib/track";

// Host do checkout — para disparar checkout_redirect só quando for pro checkout.
// ⚠️ Se o checkout mudar de domínio, ESTA linha tem que mudar junto: é ela que
// libera a reescrita das UTMs e o InitiateCheckout no clique. Errada, o funil
// perde a atribuição sem dar nenhum erro visível.
const CHECKOUT_HOST = "pay.wiapy.com";

/**
 * Rastreamento central (montado uma vez no layout):
 *  - 1 listener delegado para TODOS os CTAs ([data-cta-location]) → cta_click
 *    (+ checkout_redirect quando o link vai para o checkout);
 *  - links de diagnóstico ([data-diag]) → dispara o evento indicado
 *    (ex.: examples_click);
 *  - IntersectionObserver para hero_view (50% por 1s), bonus_section_view e
 *    offer_view (50%, uma única vez cada).
 * Não há eventos padrão (PageView/ViewContent/etc.) aqui — esses são da Utmify.
 */
export function Tracking() {
  useEffect(() => {
    // ---- cliques (captura, antes de a navegação começar) ----
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      const diagEl = target?.closest?.("[data-diag]");
      if (diagEl) trackEvent(diagEl.getAttribute("data-diag") || "diag");

      const cta = target?.closest?.("[data-cta-location]");
      if (cta) {
        trackCtaClick(cta);
        const link = cta.closest("a") as HTMLAnchorElement | null;
        if (link && link.href.includes(CHECKOUT_HOST)) {
          // Reescreve o href AGORA (captura, antes da navegação) para carregar
          // as UTMs da campanha ao checkout — sem isso o IC fica órfão da fonte.
          link.href = withUtms(link.href);
          const loc = cta.getAttribute("data-cta-location") || "cta";
          trackEvent("checkout_redirect", { cta_location: loc });
          // IC padrão do Meta no clique — garante sinal de checkout para a Meta
          // mesmo se o lado do checkout (wiapy/Utmify) não disparar.
          // Completo = 27,90; 1ª etapa do popup = 17,90; 2ª etapa (para quem
          // fechou a 1ª) = 12,90; qualquer outro caminho leva ao Básico = 10.
          // ⚠️ Todo caminho de upsell precisa estar AQUI: um data-cta-location
          // sem linha própria cai no 10 e reporta o valor errado ao Meta.
          const icValue =
            loc === "plan-premium"
              ? 27.9
              : loc === "upsell-accept"
                ? 17.9
                : loc === "upsell-auto-accept"
                  ? 12.9
                  : 10;
          trackInitiateCheckout(icValue, { cta_location: loc });
        }
      }
    };
    document.addEventListener("click", onClick, true);

    // ---- eventos de visibilidade (uma vez cada) ----
    const observers: IntersectionObserver[] = [];

    const onceVisible = (id: string, eventName: string, dwellMs = 0) => {
      const el = document.getElementById(id);
      if (!el) return;
      let fired = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
            if (visible && !fired) {
              if (dwellMs > 0) {
                if (!timer) {
                  timer = setTimeout(() => {
                    fired = true;
                    trackEvent(eventName);
                    io.disconnect();
                  }, dwellMs);
                }
              } else {
                fired = true;
                trackEvent(eventName);
                io.disconnect();
              }
            } else if (!visible && timer) {
              clearTimeout(timer);
              timer = null;
            }
          }
        },
        { threshold: [0, 0.5, 1] },
      );
      io.observe(el);
      observers.push(io);
    };

    onceVisible("hero", "hero_view", 1000); // 50% por 1s
    onceVisible("bonus", "bonus_section_view");
    onceVisible("planos", "offer_view");

    // ---- profundidade de rolagem (25/50/75/90%, uma vez cada) ----
    // O relatório do Clarity diz quantos chegam ao fim, mas não ONDE param.
    // Com estes marcos dá para achar a seção que derruba a leitura.
    const marcos = [25, 50, 75, 90];
    const atingidos = new Set<number>();
    let ticking = false;
    const medirScroll = () => {
      const doc = document.documentElement;
      const rolavel = doc.scrollHeight - window.innerHeight;
      if (rolavel <= 0) return;
      const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const m of marcos) {
        if (pct >= m && !atingidos.has(m)) {
          atingidos.add(m);
          trackEvent("scroll_depth", { percent: m });
        }
      }
      if (atingidos.size === marcos.length) {
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        medirScroll();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    medirScroll(); // conta quem já abre com a página inteira visível

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}
