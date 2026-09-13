"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Check, Timer, X } from "lucide-react";
import {
  upsell,
  upsellAuto,
  upsellDownsell,
  bonuses,
  BASIC_CHECKOUT_URL,
  DOWNSELL_CHECKOUT_URL,
  AUTO_UPSELL_CHECKOUT_URL,
} from "@/content";
import { Highlight } from "@/components/Highlight";
import { PAGE_VARIANT, trackEvent } from "@/lib/track";

/**
 * Popup de UPSELL — oferece o Plano Completo (com os 5 bônus) com desconto.
 *
 * A 1ª etapa é a mesma para todo mundo; o que muda é se existe uma 2ª.
 *
 *   1ª etapa → R$ 17,00 (`DOWNSELL_CHECKOUT_URL`)
 *   fechou (X / Esc / clique fora)
 *   2ª etapa → R$ 12,90 (`AUTO_UPSELL_CHECKOUT_URL`) — só no caminho automático
 *   fechou de novo → acabou
 *
 * Os dois caminhos que abrem a 1ª etapa:
 *  - `BasicCtaWithUpsell` — a pessoa clicou no plano Básico. UMA etapa só:
 *    fechar aqui encerra, sem o R$ 12,90. Quem clicou já estava comprando —
 *    uma segunda tela de desconto na frente de quem ia pagar só atrasa a
 *    compra (e ensina a fechar popup para o preço cair);
 *  - `AutoUpsellPopup`    — ninguém pediu: demorou no site ou foi sair. AQUI
 *    o funil vai até o fim, porque a pessoa não estava indo comprar nada.
 * O caminho muda o CONTEXTO (a frase de abertura e o texto da recusa) e a
 * existência da 2ª etapa; a oferta em si depende da ETAPA, nunca de quem abriu.
 *
 * O preço menor da 2ª etapa é a última tentativa com quem estava indo embora
 * — por isso ele não aparece antes: quem compraria por 17,00 não precisa
 * descobrir que havia um desconto maior esperando.
 *
 * As duas etapas escrevem quanto a pessoa economiza em relação ao plano
 * cheio (`upsell.priceFrom`).
 *
 * Recusar é um link de verdade, e não um "fechar disfarçado": quem quer só os
 * projetos precisa conseguir comprar sem obstáculo. Por isso a recusa NÃO cai
 * na 2ª etapa — ela é uma escolha, e não um fechar.
 *
 * Os data-* são lidos pelo Tracking central (cta_click, checkout_redirect e
 * InitiateCheckout com o valor certo de cada passo). Como os dois passos
 * valem valores diferentes, cada um tem seu `data-cta-location`
 * (`upsell-accept` = 17,00 e `upsell-auto-accept` = 12,90) — os dois
 * PRECISAM existir no mapa de valores do Tracking.tsx, senão o passo sem
 * mapa vai para o Meta valendo R$10,00.
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
  /** Frase de abertura — muda conforme a etapa e quem abriu o popup. */
  lead: string;
  /** Texto do link de recusa — idem. */
  decline: string;
  /** Sufixo dos data-track-id, para separar os caminhos no relatório. */
  origem: string;
  /** A oferta em si — depende só da ETAPA do funil. */
  oferta: Oferta;
  /**
   * Chamado quando o cronômetro zera. Precisa FECHAR o popup de vez (e não
   * avançar de etapa): é o que faz o prazo ser real. Sem ele, o contador nem
   * é renderizado — melhor nenhum relógio do que um relógio que não cumpre.
   * Memoizado, como o `onClose`.
   */
  onExpire?: () => void;
};

/**
 * TUDO o que muda entre as duas etapas — texto, preço e destino do "sim".
 * Ficam juntos aqui de propósito: assim não existe como o texto de um preço
 * apontar para o checkout de outro, nem como a 2ª etapa herdar por descuido
 * a cara da 1ª (o que faria a queda de preço passar despercebida).
 */
type Oferta = {
  /** Faixa vermelha do topo — é o primeiro sinal de que a tela mudou. */
  eyebrow: string;
  /** Aceita a sintaxe {{destaque}} do `Highlight`. */
  title: string;
  /** Antecede o riscado ("Você viu por"). Vazio quando ele já se explica. */
  priceFromLabel: string;
  /** O valor riscado. Muda entre as etapas — ver `upsellDownsell`. */
  priceFrom: string;
  priceNow: string;
  /** Vazio quando a oferta for redonda — aí os centavos nem renderizam. */
  priceNowCents: string;
  /** Quanto se ganha em relação ao plano cheio. Sem o campo, a linha nem renderiza. */
  savings?: string;
  /**
   * Quando presente, os 5 bônus viram ESTA linha em vez da lista inteira.
   * Encurta a tela onde o preço precisa ser a primeira coisa lida.
   */
  bonusLine?: string;
  /**
   * Quando presente, a oferta tem prazo DE VERDADE: o cronômetro aparece e,
   * ao zerar, o popup fecha. Sem isto, nenhum contador é renderizado.
   */
  expiraMs?: number;
  countdownNote?: string;
  cta: string;
  href: string;
  /** Define o valor do InitiateCheckout no Tracking.tsx. */
  ctaLocation: string;
  /** Sufixo do data-track-id do "sim" — carrega o preço em centavos. */
  trackId: string;
};

/** 1ª etapa — a oferta que todo mundo vê primeiro. */
const OFERTA_PRIMEIRA: Oferta = {
  eyebrow: upsell.eyebrow,
  title: upsell.title,
  priceFromLabel: "",
  priceFrom: upsell.priceFrom,
  priceNow: upsell.priceNow,
  priceNowCents: upsell.priceNowCents,
  savings: upsell.savings,
  cta: upsell.cta,
  href: DOWNSELL_CHECKOUT_URL,
  ctaLocation: "upsell-accept",
  trackId: "upsell-premium-1700",
};

/**
 * 2ª etapa — só para quem FECHOU a primeira. Muda a faixa, o título, o
 * riscado e o volume de texto: é a mesma janela, e sem essas trocas a pessoa
 * fecha de novo achando que é a tela que ela já dispensou.
 */
const OFERTA_DOWNSELL: Oferta = {
  eyebrow: upsellDownsell.eyebrow,
  title: upsellDownsell.title,
  priceFromLabel: upsellDownsell.priceFromLabel,
  priceFrom: upsellDownsell.priceFrom,
  priceNow: upsellDownsell.priceNow,
  priceNowCents: upsellDownsell.priceNowCents,
  savings: upsellDownsell.savings,
  bonusLine: upsellDownsell.bonusLine,
  expiraMs: upsellDownsell.expiraMs,
  countdownNote: upsellDownsell.countdownNote,
  cta: upsellDownsell.cta,
  href: AUTO_UPSELL_CHECKOUT_URL,
  ctaLocation: "upsell-auto-accept",
  trackId: "upsell-premium-1290",
};

/**
 * Cola o "R$" no número com espaço INQUEBRÁVEL.
 *
 * Sem isto, uma frase que não coube na linha quebra bem no meio do valor —
 * "R$" no fim de uma linha e "25,90" no começo da outra. O preço é o
 * argumento da tela: ele não pode ser a parte que se parte.
 *
 * Não substitui frase curta: texto que estoura a caixa continua quebrando,
 * só que entre palavras. Ver os avisos de tamanho em `upsellDownsell`.
 */
// O \u00A0 vai escrito como ESCAPE, e nunca como um NBSP digitado direto: no
// código-fonte ele é invisível, e quem mexer aqui depois o apagaria sem ver.
const valorInteiro = (texto: string) => texto.replace(/R\$\s+/g, "R$\u00A0");

/**
 * Cronômetro da oferta com prazo. Conta a partir do momento em que ENTRA na
 * tela (é aí que ele monta), e não do carregamento da página.
 *
 * Ao zerar chama `onFim` — e quem passa esse callback fecha o popup. É o que
 * mantém a frase honesta: a oferta acaba de verdade quando o tempo acaba, em
 * vez de o número travar em 00:00 e continuar comprável (contador de mentira
 * é justamente o que o `Countdown` da barra de urgência se recusa a fazer).
 */
function ContadorOferta({ ms, onFim }: { ms: number; onFim: () => void }) {
  const [restante, setRestante] = useState(ms);

  useEffect(() => {
    // O fim é um instante fixo, e não uma soma de intervalos: aba em segundo
    // plano estrangula o setInterval, e contar "menos 1" a cada disparo faria
    // o relógio atrasar junto.
    const fim = Date.now() + ms;
    const tick = () => {
      const falta = fim - Date.now();
      if (falta <= 0) {
        clearInterval(id);
        setRestante(0);
        onFim();
        return;
      }
      setRestante(falta);
    };
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [ms, onFim]);

  const total = Math.ceil(restante / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  return (
    <span className="tabular-nums" aria-hidden>
      {mm}:{ss}
    </span>
  );
}

function UpsellDialog({
  open,
  onClose,
  openerRef,
  lead,
  decline,
  origem,
  oferta,
  onExpire,
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
    // A TROCA DE ETAPA de propósito não entra aqui: o diálogo continua aberto
    // e só o conteúdo muda — refazer o efeito devolveria o foco ao botão do
    // Básico bem na hora em que a segunda oferta aparece.
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
        aria-label={oferta.title.replace(/[{}]/g, "")}
        onClick={(e) => e.stopPropagation()}
        /* Moldura VERMELHA + faixa vermelha no topo: é o único lugar da
           página com essa cor em volta de tudo. O vermelho aqui não é
           decoração — é o mesmo sinal da barra de urgência, dizendo que a
           oferta acaba quando o popup fechar. `overflow-hidden` faz a
           faixa encostar na borda arredondada. */
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border-[3px] border-danger-vivid bg-white text-center shadow-2xl"
      >
        <div className="relative flex items-center justify-center bg-danger-vivid px-11 py-2.5">
          <p className="text-[11.5px] font-extrabold uppercase leading-tight tracking-wide text-white sm:text-[13px]">
            {oferta.eyebrow}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={upsell.closeLabel}
            className="absolute right-2.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/50"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* `[&_span]:whitespace-nowrap`: o trecho destacado é o NOME da
              oferta — se ele quebra no meio, o leitor perde o nome. A quebra
              passa a cair só entre as palavras normais. */}
          <h3 className="font-display text-balance text-[1.35rem] uppercase leading-tight text-ink [&_span]:whitespace-nowrap sm:text-[1.6rem]">
            <Highlight text={oferta.title} tone="green" />
          </h3>

          <p className="mt-2 text-[13px] leading-snug text-ink-soft">{valorInteiro(lead)}</p>

          {/* Cronômetro — só existe na etapa que tem prazo de verdade. Fica
              ACIMA do preço porque é ele que explica a queda: sem o prazo à
              vista, o desconto novo lê como "o preço era mentira antes". */}
          {oferta.expiraMs && onExpire ? (
            <div className="mt-3 flex flex-col items-center gap-1">
              <p className="inline-flex items-center gap-2 rounded-full bg-danger-vivid px-4 py-1.5 font-display text-[1.35rem] leading-none text-white shadow-[0_6px_16px_-6px_rgba(198,43,36,0.8)]">
                <Timer className="size-[18px] animate-pulse" aria-hidden />
                <ContadorOferta ms={oferta.expiraMs} onFim={onExpire} />
              </p>
              {oferta.countdownNote ? (
                <p className="text-balance text-[11px] font-bold uppercase tracking-wide text-danger-vivid">
                  {valorInteiro(oferta.countdownNote)}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Bloco do preço. A borda TRACEJADA verde separa a conta do
              resto do popup: quem só bate o olho lê "de X por Y" sem
              precisar do texto em volta. */}
          <div className="mt-4 rounded-2xl border-2 border-dashed border-cta bg-green-soft px-4 py-4">
            <p className="text-[15px] font-bold">
              {oferta.priceFromLabel ? (
                <span className="mr-1.5 font-extrabold uppercase tracking-wide text-ink-soft">
                  {oferta.priceFromLabel}
                </span>
              ) : null}
              <span className="old-price">{valorInteiro(oferta.priceFrom)}</span>
            </p>
            <p className="font-display mt-0.5 leading-none text-cta-dark">
              <span className="text-[2.7rem] sm:text-5xl">
                {oferta.priceNow}
              </span>
              {/* Só sai quando a oferta tem centavos. */}
              {oferta.priceNowCents ? (
                <span className="text-2xl">{oferta.priceNowCents}</span>
              ) : null}
            </p>
            {/* A economia — nem a hero nem os planos dizem quanto se ganha ao
                trocar de plano. */}
            {oferta.savings ? (
              <p className="mt-2 text-balance text-[13px] font-extrabold text-green-ink">
                {valorInteiro(oferta.savings)}
              </p>
            ) : null}
            <p className="mt-2 text-[11px] text-ink-soft">
              {upsell.paymentNote}
            </p>
          </div>

          {/* Bônus. Na 1ª etapa eles são o argumento e saem por extenso (a
              lista vem de `bonuses.items`, nunca duplicada). Na 2ª, viram uma
              linha só: quem chegou aqui já leu os cinco, e repetir a lista
              empurraria o preço novo para fora da primeira olhada. */}
          {oferta.bonusLine ? (
            <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-soft px-3 py-2.5 text-[13px] font-extrabold leading-snug text-green-ink">
              <span
                aria-hidden
                className="flex size-[18px] shrink-0 items-center justify-center rounded-md bg-cta text-white"
              >
                <Check className="size-3" strokeWidth={3.5} />
              </span>
              {valorInteiro(oferta.bonusLine)}
            </p>
          ) : (
            <>
              <p className="mt-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-ink-soft">
                {upsell.bonusTitle}
              </p>
              <ul className="mt-2 space-y-2 text-left">
                {bonuses.items.map((b) => (
                  <li
                    key={b.title}
                    className="flex items-start gap-2.5 text-[13px] font-bold leading-snug text-ink"
                  >
                    <span
                      aria-hidden
                      className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-md bg-cta text-white"
                    >
                      <Check className="size-3" strokeWidth={3.5} />
                    </span>
                    <span>{b.title}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Aceitar — Plano Completo pelo preço desta etapa.
              `whitespace-nowrap` + corpo em `clamp`: o nome do plano e o
              preço são UMA frase — quebrada, o preço cai sozinho na linha de
              baixo e o botão perde a oferta de vista. Em vez de quebrar, a
              letra encolhe com a largura da tela (piso 0.68rem, teto 1.1rem). */}
          <a
            ref={acceptRef}
            href={oferta.href}
            data-cta-location={oferta.ctaLocation}
            data-track-id={`${oferta.trackId}-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-5 flex min-h-[56px] w-full items-center justify-center whitespace-nowrap rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-2.5 py-4 text-center font-cta text-[clamp(0.68rem,3.45vw,1.1rem)] uppercase leading-tight tracking-normal text-white shadow-[0_12px_28px_-8px_rgba(34,180,85,0.65)] ring-1 ring-inset ring-white/25 transition hover:-translate-y-0.5 hover:brightness-110 sm:px-5"
          >
            {valorInteiro(oferta.cta)}
          </a>

          {/* Recusar — segue com o Básico de R$ 10,00. Continua sendo um
              link de verdade e agora tem corpo de botão: quem quer só os
              projetos não precisa caçar um texto pequeno. É menor e sem
              volume (nada de gradiente/sombra) para o verde seguir sendo
              o caminho óbvio. Vai DIRETO ao checkout: quem clica aqui não
              cai na 2ª etapa, porque isto é uma decisão e não um fechar. */}
          <a
            href={BASIC_CHECKOUT_URL}
            data-cta-location="upsell-decline"
            data-track-id={`basic-checkout-1000-${origem}`}
            data-page-variant={PAGE_VARIANT}
            className="mt-3 flex min-h-[46px] w-full items-center justify-center text-balance rounded-xl bg-danger-vivid px-4 py-2.5 text-center text-[12px] font-bold leading-snug text-white transition hover:brightness-110"
          >
            {valorInteiro(decline)}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Em que ponto do funil a pessoa está. `null` = nenhum popup na tela. */
type Etapa = null | "oferta" | "downsell";

/**
 * O funil. Com `comDownsell`, fechar a 1ª etapa NÃO fecha o popup: troca a
 * oferta pela mais barata, e só o segundo fechar encerra. Sem ele, o popup
 * tem uma etapa só e o primeiro fechar acaba com tudo.
 *
 * `comDownsell` é constante em cada chamada (`true` no automático, `false` no
 * clique do Básico) — é por isso que ele pode entrar nas dependências do
 * `fechar` sem desestabilizar o callback.
 *
 * O `fechar` usa a forma funcional do setState porque é memoizado uma vez só
 * — lendo `etapa` de fora, o callback congelaria na primeira etapa e o
 * segundo fechar nunca sairia do lugar. Ele PRECISA ser memoizado: o efeito
 * do diálogo depende dele, e um `onClose` novo a cada render refaria o efeito
 * (roubando o foco de volta para o botão que abriu).
 */
function useFunilUpsell(origem: string, comDownsell: boolean) {
  const [etapa, setEtapa] = useState<Etapa>(null);

  const abrir = useCallback(() => setEtapa("oferta"), []);

  const fechar = useCallback(() => {
    setEtapa((atual) => {
      if (!comDownsell) return null;
      if (atual !== "oferta") return null;
      trackEvent("upsell_downsell_open", { origem });
      return "downsell";
    });
  }, [origem, comDownsell]);

  /**
   * Encerra o funil sem passar pela 2ª etapa — é o fim do prazo da oferta,
   * não um "fechar". Separado do `fechar` de propósito: se o cronômetro
   * usasse aquele, zerar na 1ª etapa ABRIRIA a segunda em vez de acabar.
   */
  const encerrar = useCallback(() => {
    trackEvent("upsell_downsell_expired", { origem });
    setEtapa(null);
  }, [origem]);

  return { etapa, abrir, fechar, encerrar };
}

/**
 * O diálogo já ligado ao funil: escolhe a oferta e os textos da etapa atual.
 * `lead`/`decline` são os da 1ª etapa — mudam conforme quem abriu; os da 2ª
 * são sempre os de `upsellDownsell`, porque lá o contexto é o mesmo para
 * todo mundo (já fechou a oferta uma vez).
 */
function FunilUpsellDialog({
  etapa,
  fechar,
  encerrar,
  openerRef,
  lead,
  decline,
  origem,
}: {
  etapa: Etapa;
  fechar: () => void;
  encerrar: () => void;
  openerRef?: RefObject<HTMLElement | null>;
  lead: string;
  decline: string;
  origem: string;
}) {
  const noDownsell = etapa === "downsell";

  return (
    <UpsellDialog
      open={etapa !== null}
      onClose={fechar}
      onExpire={encerrar}
      openerRef={openerRef}
      lead={noDownsell ? upsellDownsell.lead : lead}
      decline={noDownsell ? upsellDownsell.decline : decline}
      // O sufixo separa, no relatório, quem comprou o básico na 1ª tentativa
      // de quem só comprou depois de ver o funil inteiro.
      origem={noDownsell ? `${origem}-downsell` : origem}
      oferta={noDownsell ? OFERTA_DOWNSELL : OFERTA_PRIMEIRA}
    />
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
 * a oferta de R$ 17,00 pelo Plano Completo.
 *
 * Uma ETAPA só (`comDownsell` = false): fechar aqui encerra. O R$ 12,90 é
 * exclusivo do popup automático — ver o cabeçalho do arquivo.
 */
export function BasicCtaWithUpsell({ label }: { label: string }) {
  const { etapa, abrir, fechar, encerrar } = useFunilUpsell("plano", false);
  // Guarda quem abriu o popup para devolver o foco ao fechar.
  const openerRef = useRef<HTMLButtonElement>(null);

  const abrirNoClique = useCallback(() => {
    // Quem já viu a oferta aqui não precisa vê-la de novo daqui a pouco pelo
    // relógio do popup automático: é a MESMA primeira etapa.
    marcarVisto();
    abrir();
  }, [abrir]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={abrirNoClique}
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

      <FunilUpsellDialog
        etapa={etapa}
        fechar={fechar}
        encerrar={encerrar}
        openerRef={openerRef}
        lead={upsell.lead}
        decline={upsell.decline}
        origem="plano"
      />
    </>
  );
}

/**
 * Abre o funil — começando pela oferta de R$ 17,00 e caindo no R$ 12,90 se a
 * pessoa fechar — sem ninguém pedir, por dois gatilhos:
 *
 *  1. TEMPO — `upsellAuto.delayMs` desde que a página abriu. É o gatilho que
 *     vale no celular, onde não existe ponteiro para vigiar — e é de lá que
 *     vem a maior parte do tráfego de anúncio;
 *  2. SAÍDA — no desktop, quando o ponteiro deixa a janela POR CIMA, onde
 *     ficam a aba, a barra de endereço e o X. Sair pelos lados ou por baixo
 *     não conta: ali não há para onde ir.
 *
 * Fechar essa primeira oferta não dispensa quem visita: cai no R$ 12,90. Este
 * é o ÚNICO caminho que chega lá — quem abriu a oferta clicando no Básico
 * estava indo comprar, e para esse a primeira recusa encerra.
 *
 * Vale UMA vez por sessão: reaparecer a cada rolagem transformaria a oferta
 * em incômodo. Também não sequestra o botão "voltar" para simular saída no
 * celular — quebrar o "voltar" custa mais do que esse popup ganha.
 *
 * Não renderiza nada até um dos gatilhos disparar.
 */
export function AutoUpsellPopup() {
  const { etapa, abrir, fechar, encerrar } = useFunilUpsell("auto", true);

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
      abrir();
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
    // `abrir` é memoizado sem dependências: nunca muda, então os gatilhos são
    // armados UMA vez só. Se um dia ele deixar de ser estável, o relógio do
    // popup reinicia a cada render — e o popup nunca aparece.
  }, [abrir]);

  return (
    <FunilUpsellDialog
      etapa={etapa}
      fechar={fechar}
      encerrar={encerrar}
      lead={upsellAuto.lead}
      decline={upsellAuto.decline}
      origem="auto"
    />
  );
}
