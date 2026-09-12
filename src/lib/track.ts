/**
 * Rastreamento — funções reutilizáveis para CTAs e eventos de diagnóstico.
 *
 * Contexto: a página usa a Utmify (script de UTMs + pixel da Utmify), que já
 * cuida de PageView/ViewContent/InitiateCheckout/Purchase e da atribuição por
 * UTMs no checkout. NÃO há Meta Pixel bruto, CAPI, GA4 nem GTM instalados aqui.
 *
 * Por isso esta camada é AGNÓSTICA e defensiva:
 *  - empurra cada evento para window.dataLayer (pronto p/ GA4/GTM se conectados);
 *  - chama window.fbq("trackCustom", ...) SOMENTE se o fbq existir.
 * Assim não duplicamos os eventos padrão da Utmify nem quebramos nada.
 */

export const PAGE_VARIANT = "redacao_enem_v1";

const PRODUCT_NAME = "+150 Esquemas Visuais para Redação Nota 1000 no ENEM";
const PRODUCT_PRICE = 27.9;
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type Payload = Record<string, unknown>;
type AnyWindow = Window & {
  dataLayer?: Payload[];
  fbq?: (...args: unknown[]) => void;
};

/** Lê utm_* e fbclid da URL atual (sem substituir/duplicar nada). */
export function getUtms(): Payload {
  const out: Payload = {};
  if (typeof window === "undefined") return out;
  try {
    const p = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = p.get(k);
      if (v) out[k] = v;
    }
    const fbclid = p.get("fbclid");
    if (fbclid) out.fbclid = fbclid;
  } catch {
    /* ignore */
  }
  return out;
}

/**
 * Anexa as UTMs (+fbclid) da URL atual a uma URL de checkout, SEM duplicar:
 * se o parâmetro já existe no destino (ex.: a Utmify já reescreveu o link),
 * o valor original é preservado. Garante que a campanha chegue no checkout
 * mesmo quando o auto-rewrite da Utmify não reconhece o domínio do checkout
 * ou ainda não carregou no momento do clique — que é o que zera a atribuição
 * e faz o IC (Início de Checkout) sumir do funil.
 */
export function withUtms(url: string): string {
  if (typeof window === "undefined") return url;
  try {
    const dest = new URL(url, window.location.origin);
    for (const [k, v] of Object.entries(getUtms())) {
      if (!dest.searchParams.has(k)) dest.searchParams.set(k, String(v));
    }
    return dest.toString();
  } catch {
    return url;
  }
}

/** Evento genérico: dataLayer + fbq (se existir). Nunca quebra a navegação. */
export function trackEvent(eventName: string, extra: Payload = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  const payload: Payload = {
    event: eventName,
    event_name: eventName,
    page_variant: PAGE_VARIANT,
    ...extra,
  };
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
    if (typeof w.fbq === "function") {
      w.fbq("trackCustom", eventName, payload);
    }
  } catch {
    /* rastreamento nunca deve interromper o clique */
  }
}

/**
 * Dispara o InitiateCheckout PADRÃO do Meta Pixel (fbq('track', ...)) no
 * momento em que o usuário clica para ir ao checkout.
 *
 * Por que isso existe: a página só tem a Utmify, e o IC "oficial" depende do
 * lado do checkout (Zuptos → Utmify). Quando esse sinal falha, a Meta recebe
 * pouquíssimos ICs (ex.: 3 IC para 8 compras — impossível). Disparar o IC aqui,
 * no clique, garante à Meta um sinal de "início de checkout" para TODO mundo que
 * clica em comprar — o que a otimização de campanha precisa.
 *
 * Só dispara se o `fbq` existir (a Utmify injeta o fbevents.js). `eventID`
 * permite deduplicação caso a CAPI também envie IC. Nunca interrompe o clique.
 */
export function trackInitiateCheckout(value: number, extra: Payload = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnyWindow;
  try {
    if (typeof w.fbq === "function") {
      const eventID = `ic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      w.fbq(
        "track",
        "InitiateCheckout",
        {
          value,
          currency: "BRL",
          content_name: PRODUCT_NAME,
          ...extra,
        },
        { eventID },
      );
    }
  } catch {
    /* rastreamento nunca deve interromper o clique */
  }
}

/** Evento de clique em CTA — lê os data-* do elemento e monta o payload. */
export function trackCtaClick(el: Element | null) {
  const location = el?.getAttribute("data-cta-location") || "cta";
  const trackId = el?.getAttribute("data-track-id") || location;
  const ctaText = (el?.textContent || "").trim().replace(/\s+/g, " ");
  trackEvent("cta_click", {
    cta_location: location,
    track_id: trackId,
    cta_text: ctaText,
    product_name: PRODUCT_NAME,
    product_price: PRODUCT_PRICE,
    ...getUtms(),
  });
}
