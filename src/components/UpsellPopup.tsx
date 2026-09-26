"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Check, Flame, Gift, Sparkles, X } from "lucide-react";
import {
  upsell,
  upsellAuto,
  BASIC_CHECKOUT_URL,
  DOWNSELL_CHECKOUT_URL,
} from "@/content";
import { PAGE_VARIANT, trackEvent } from "@/lib/track";

/**
 * Popup de UPSELL — oferece o Plano Completo (com os 5 bônus) por R$ 15,90,
 * comparando lado a lado com o Básico. UMA etapa só: fechar encerra.
 *
 * Os dois caminhos que abrem o popup:
 *  - `BasicCtaWithUpsell` — a pessoa clicou no plano Básico;
 *  - `AutoUpsellPopup`    — ninguém pediu: demorou no site ou foi sair.
 * O caminho muda só o título e o texto da recusa; a oferta é a mesma.
 *
 * Recusar é um link de verdade, e não um "fechar disfarçado": quem quer só os
 * esquemas precisa conseguir comprar sem obstáculo.
 *
 * Os data-* são lidos pelo Tracking central (cta_click, checkout_redirect e
 * InitiateCheckout). `upsell-accept` PRECISA existir no mapa de valores do
 * Tracking.tsx, senão o aceite vai para o Meta valendo R$10,00.
 */

/**
 * Quantos diálogos de upsell estão abertos agora. O popup automático lê isto
 * para não subir por cima do que a pessoa abriu no clique.
 */
let dialogsAbertos = 0;

type DialogProps = {
  open: boolean;
  /** Precisa ser memoizado (useCallback) — ver o efeito lá embaixo. */
  onClose: () => void;
  /**
   * Ref do elemento que recebe o foco de volta ao fechar (quando houve um).
   * É a REF, e não o elemento: ler `.current` no render é proibido, e aqui
   * ele só é lido dentro do efeito, na hora certa.
   */
  openerRef?: RefObject<HTMLElement | null>;
  /** Título do topo — muda conforme quem abriu o popup. */
  title: string;
  /** Texto da recusa — idem. */
  decline: string;
  /** Sufixo dos data-track-id, para separar os caminhos no relatório. */
  origem: string;
};

/**
 * Cola o "R$" no número com espaço INQUEBRÁVEL: sem isto, uma frase que não
 * coube na linha quebra bem no meio do valor.
 */
// O   vai escrito como ESCAPE, e nunca como um NBSP digitado direto: no
// código-fonte ele é invisível, e quem mexer aqui depois o apagaria sem ver.
const valorInteiro = (texto: string) => texto.replace(/R\$\s+/g, "R$ ");

type Feature = { text: string; included: boolean };

function ListaPlano({ features, destaque }: { features: Feature[]; destaque: boolean }) {
  return (
    <ul className="mt-2.5 space-y-1.5">
      {features.map((f) => (
        <li
          key={f.text}
          className={`flex items-start gap-1.5 text-[12px] leading-snug ${
            !f.included
              ? "text-danger"
              : destaque
                ? "font-bold text-ink"
                : "text-ink-soft"
          }`}
        >
          {f.included ? (
            <Check
              className="mt-px size-3.5 shrink-0 text-green-ink"
              strokeWidth={3}
              aria-hidden
            />
          ) : (
            <X className="mt-px size-3.5 shrink-0" strokeWidth={3} aria-hidden />
          )}
          <span>{f.text}</span>
        </li>
      ))}
    </ul>
  );
}

function UpsellDialog({
  open,
  onClose,
  openerRef,
  title,
  decline,
  origem,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    // Guardado agora: no cleanup, a ref já pode apontar para outra coisa.
    const paraFocar = openerRef?.current;
    dialogsAbertos += 1;
    document.body.style.overflow = "hidden";
    acceptRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Prende o Tab dentro do popup enquanto ele estiver aberto.
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      dialogsAbertos -= 1;
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      paraFocar?.focus();
    };
    // `onClose` vem memoizado dos dois chamadores: sem isso, cada render do
    // pai refaria este efeito e o cleanup roubaria o foco de volta ao botão.
  }, [open, onClose, openerRef]);

  if (!open) return null;

  const [leadAntes, leadDepois] = upsell.lead.split("{{diff}}");
  const { basico, completo } = upsell;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl bg-white text-center shadow-2xl"
      >
        {/* Topo no azul das seções escuras do site. */}
        <div className="relative bg-gradient-to-b from-purple-ink to-plum px-6 pb-5 pt-6 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label={upsell.closeLabel}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-ink shadow-md transition hover:scale-105"
          >
            <X className="size-5" strokeWidth={2.5} aria-hidden />
          </button>

          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ring-1 ring-inset ring-white/25">
            <Flame className="size-3.5 text-gold" aria-hidden />
            {upsell.badge}
            <Gift className="size-3.5 text-gold" aria-hidden />
          </p>

          <h3 className="font-display mx-auto mt-3 max-w-[18ch] text-balance text-[1.6rem] leading-tight sm:text-[1.75rem]">
            {title}
          </h3>
          <p className="mx-auto mt-1.5 max-w-[30ch] text-balance text-[13px] font-semibold leading-snug text-ink-invert">
            {upsell.subtitle}
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-balance text-[15px] leading-snug text-ink">
            {leadAntes}
            <strong className="whitespace-nowrap font-extrabold text-purple-ink">
              {valorInteiro(upsell.upgradeDiff)}
            </strong>
            {leadDepois}
          </p>

          {/* Comparação lado a lado: o Básico apagado, o Completo em destaque. */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-border bg-sand p-3">
              <span className="inline-block rounded-md bg-border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
                {basico.label}
              </span>
              <p className="font-display mt-2 whitespace-nowrap text-[1.35rem] leading-none text-ink-soft">
                {valorInteiro(basico.price)}
              </p>
              <ListaPlano features={basico.features} destaque={false} />
            </div>

            <div className="rounded-2xl border-2 border-purple bg-lilac p-3 shadow-[0_10px_24px_-12px_rgba(29,78,216,0.55)]">
              <span className="inline-block rounded-md bg-purple-ink px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                {completo.label}
              </span>
              <p className="old-price mt-1.5 text-[11px] font-bold leading-none">
                {valorInteiro(completo.priceFrom)}
              </p>
              <p className="font-display mt-0.5 whitespace-nowrap text-[1.35rem] leading-none text-purple-ink">
                {valorInteiro(completo.price)}
              </p>
              <ListaPlano features={completo.features} destaque />
            </div>
          </div>

          {/* Aceitar — `whitespace-nowrap` + corpo em `clamp`: o preço não
              pode cair sozinho na linha de baixo; a letra encolhe. */}
          <a
            ref={acceptRef}
            href={DOWNSELL_CHECKOUT_URL}
            data-cta-location="upsell-accept"
            data-track-id={`upsell-premium-1590-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-5 flex min-h-[58px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-3 py-4 text-center font-cta text-[clamp(0.72rem,3.6vw,1.05rem)] uppercase leading-tight text-white shadow-[0_12px_28px_-8px_rgba(34,180,85,0.65)] ring-1 ring-inset ring-white/25 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            <Sparkles className="size-5 shrink-0 text-gold" aria-hidden />
            {valorInteiro(upsell.cta)}
          </a>

          {/* Recusar — link de verdade, direto ao checkout do Básico. Discreto
              para o verde seguir sendo o caminho óbvio. */}
          <a
            href={BASIC_CHECKOUT_URL}
            data-cta-location="upsell-decline"
            data-track-id={`basic-checkout-1000-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-3 flex min-h-[46px] w-full items-center justify-center text-balance rounded-xl bg-sand px-4 py-2.5 text-center text-[12px] font-bold uppercase leading-snug tracking-wide text-ink-soft transition hover:bg-border"
          >
            {valorInteiro(decline)}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Marca de "já apareceu" — dura a sessão da aba, não o navegador todo. */
const CHAVE_VISTO = "upsell_auto_visto";

function jaViu() {
  try {
    return sessionStorage.getItem(CHAVE_VISTO) === "1";
  } catch {
    // Aba anônima / storage bloqueado: sem memória, mas o popup ainda vale
    // uma vez por carregamento — os dois gatilhos são de disparo único.
    return false;
  }
}

function marcarVisto() {
  try {
    sessionStorage.setItem(CHAVE_VISTO, "1");
  } catch {
    /* ver acima — não poder lembrar não é motivo para não mostrar */
  }
}

/**
 * Botão do plano Básico que, em vez de ir direto ao checkout de R$10,00, abre
 * a oferta de R$ 15,90 pelo Plano Completo.
 */
export function BasicCtaWithUpsell({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  // Guarda quem abriu o popup para devolver o foco ao fechar.
  const openerRef = useRef<HTMLButtonElement>(null);

  const abrir = useCallback(() => {
    // Quem já viu a oferta aqui não precisa vê-la de novo daqui a pouco pelo
    // relógio do popup automático: é a MESMA oferta.
    marcarVisto();
    setOpen(true);
  }, []);
  const fechar = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={abrir}
        data-cta-location="plan-basic"
        data-track-id="basic-open-upsell"
        data-page-variant={PAGE_VARIANT}
        /* Preenchido (não é mais só contorno). Fica CHAPADO de propósito —
           sem gradiente, sem brilho e sem a animação de shine — para o botão
           do Completo continuar sendo o mais pesado dos dois. */
        className="mt-6 flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-cta px-6 py-3.5 text-center font-cta text-[0.95rem] uppercase leading-tight tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(34,180,85,0.55)] transition hover:-translate-y-0.5 hover:brightness-110 sm:text-[1rem]"
      >
        {label}
      </button>

      <UpsellDialog
        open={open}
        onClose={fechar}
        openerRef={openerRef}
        title={upsell.title}
        decline={upsell.decline}
        origem="plano"
      />
    </>
  );
}

/**
 * Abre a oferta de R$ 15,90 sem ninguém pedir, por dois gatilhos:
 *
 *  1. TEMPO — `upsellAuto.delayMs` desde que a página abriu. É o gatilho que
 *     vale no celular, onde não existe ponteiro para vigiar — e é de lá que
 *     vem a maior parte do tráfego de anúncio;
 *  2. SAÍDA — no desktop, quando o ponteiro deixa a janela POR CIMA, onde
 *     ficam a aba, a barra de endereço e o X.
 *
 * Vale UMA vez por sessão: reaparecer a cada rolagem transformaria a oferta
 * em incômodo. Não renderiza nada até um dos gatilhos disparar.
 */
export function AutoUpsellPopup() {
  const [open, setOpen] = useState(false);
  const fechar = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (jaViu()) return;

    let disparado = false;

    const onMouseOut = (e: MouseEvent) => {
      // relatedTarget preenchido = o ponteiro só trocou de elemento dentro da
      // página. Nulo E clientY <= 0 = saiu de verdade, pelo topo da janela.
      if (e.relatedTarget) return;
      if (e.clientY > 0) return;
      dispararGatilho("saida");
    };

    const limpar = () => {
      clearTimeout(tempo);
      clearTimeout(armar);
      document.removeEventListener("mouseout", onMouseOut);
    };

    function dispararGatilho(gatilho: string) {
      if (disparado) return;
      // O popup do plano Básico já está na tela: a oferta está sendo vista,
      // não faz sentido empilhar uma segunda cópia dela por cima.
      if (dialogsAbertos > 0) return;
      disparado = true;
      limpar();
      marcarVisto();
      trackEvent("upsell_auto_open", { trigger: gatilho });
      setOpen(true);
    }

    const tempo = setTimeout(
      () => dispararGatilho("tempo"),
      upsellAuto.delayMs,
    );
    // A vigia da saída só entra depois da carência (ver `upsellAuto`).
    const armar = setTimeout(
      () => document.addEventListener("mouseout", onMouseOut),
      upsellAuto.exitArmMs,
    );

    return limpar;
  }, []);

  return (
    <UpsellDialog
      open={open}
      onClose={fechar}
      title={upsellAuto.title}
      decline={upsellAuto.decline}
      origem="auto"
    />
  );
}
