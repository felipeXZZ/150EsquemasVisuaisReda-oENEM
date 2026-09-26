"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Gift, X } from "lucide-react";
import {
  upsell,
  upsellAuto,
  bonuses,
  BASIC_CHECKOUT_URL,
  DOWNSELL_CHECKOUT_URL,
} from "@/content";
import { PAGE_VARIANT, trackEvent } from "@/lib/track";

/**
 * Popup de UPSELL — oferece o Plano Completo (com os 5 bônus) por R$ 15,90,
 * mostrando os bônus que faltam no Básico. UMA etapa só: fechar encerra.
 *
 * Os dois caminhos que abrem o popup:
 *  - `BasicCtaWithUpsell` — a pessoa clicou no plano Básico;
 *  - `AutoUpsellPopup`    — ninguém pediu: demorou no site ou foi sair.
 * O caminho muda só o texto da recusa; a oferta é a mesma.
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
  /** Texto da recusa — muda conforme quem abriu o popup. */
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

/* Os 5 bônus por extenso: é o que fica de fora que precisa justificar a
   troca de plano. */
const FALTA_NO_BASICO = bonuses.items.map((b) => b.title);
const NOTA_BONUS = `${upsell.upgradeNote} ${bonuses.totalValue})`;

function UpsellDialog({
  open,
  onClose,
  openerRef,
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

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={upsell.eyebrow}
        onClick={(e) => e.stopPropagation()}
        /* Cartão branco com topo AZUL: o azul é a cor da marca, e o vermelho
           fica guardado para o que a pessoa PERDE (a lista abaixo). */
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl bg-white text-center shadow-2xl"
      >
        {/* Topo: ícone + a frase. `px-11` guarda o lugar do X. */}
        <div className="relative bg-gradient-to-b from-purple-ink to-plum px-11 pb-4 pt-4">
          <span
            aria-hidden
            className="mx-auto flex size-10 items-center justify-center rounded-xl bg-white/15 text-white"
          >
            <Gift className="size-5" />
          </span>
          <p className="mt-2 text-balance text-[15px] font-extrabold leading-snug text-white sm:text-[17px]">
            {upsell.eyebrow}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={upsell.closeLabel}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* O que fica de fora. É o argumento da tela: a pessoa lê o que
              PERDE antes de ler o preço de levar tudo. */}
          <h3 className="text-[15px] font-extrabold uppercase tracking-wide text-ink sm:text-base">
            {upsell.missingLead}{" "}
            <span className="text-danger-vivid">{upsell.missingEmphasis}</span>
          </h3>
          <ul className="mt-3 space-y-2 rounded-2xl border border-danger/15 bg-danger/[0.05] px-4 py-3.5 text-left">
            {FALTA_NO_BASICO.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[13px] font-bold leading-snug text-danger"
              >
                <X className="mt-px size-4 shrink-0" strokeWidth={3} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Quanto custa a mais levar tudo — a diferença, e não o preço
              cheio: "+ R$ 5,90" pesa menos que "R$ 15,90". */}
          <div className="mt-4 rounded-2xl border border-cta/30 bg-green-soft px-4 py-3.5">
            <p className="text-[13px] font-bold leading-snug text-green-ink">
              {valorInteiro(upsell.upgradeLine)}
            </p>
            <p className="font-display mt-1 text-[1.6rem] uppercase leading-none text-green-ink sm:text-[1.8rem]">
              {upsell.upgradeName}
            </p>
            <p className="mt-1.5 text-[12px] font-semibold leading-snug text-ink-soft">
              {valorInteiro(NOTA_BONUS)}
            </p>
          </div>

          {/* Aceitar — pode quebrar em duas linhas; o que não pode é o valor
              se partir (`valorInteiro` cola o "R$" no número). */}
          <a
            ref={acceptRef}
            href={DOWNSELL_CHECKOUT_URL}
            data-cta-location="upsell-accept"
            data-track-id={`upsell-premium-1590-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-5 flex min-h-[56px] w-full items-center justify-center text-balance rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-4 py-3.5 text-center text-[15px] font-extrabold leading-tight text-white shadow-[0_12px_28px_-8px_rgba(34,180,85,0.65)] ring-1 ring-inset ring-white/25 transition hover:-translate-y-0.5 hover:brightness-110 sm:px-5"
          >
            {valorInteiro(upsell.cta)}
          </a>

          {/* Recusar — link de verdade, direto ao checkout do Básico. Branco e
              de contorno para o verde seguir sendo o caminho óbvio. */}
          <a
            href={BASIC_CHECKOUT_URL}
            data-cta-location="upsell-decline"
            data-track-id={`basic-checkout-1000-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-3 flex min-h-[46px] w-full items-center justify-center text-balance rounded-xl border border-border bg-white px-4 py-2.5 text-center text-[13px] font-bold leading-snug text-ink-soft transition hover:bg-cream"
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
      decline={upsellAuto.decline}
      origem="auto"
    />
  );
}
