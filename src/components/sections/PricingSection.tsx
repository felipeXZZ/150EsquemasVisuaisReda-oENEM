import Image from "next/image";
import {
  Check,
  ChevronsDown,
  Clock,
  Gift,
  Infinity as InfinityIcon,
  ShieldCheck,
  Star,
  X,
  Zap,
} from "lucide-react";
import { plans, bonuses, CHECKOUT_URL } from "@/content";
import { BasicCtaWithUpsell } from "@/components/UpsellPopup";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { TodayDate } from "@/components/TodayDate";
import { PAGE_VARIANT } from "@/lib/track";

/** Ícones da faixa de garantias abaixo dos dois planos (ver content.ts). */
const assuranceIcons = {
  infinity: InfinityIcon,
  shield: ShieldCheck,
  zap: Zap,
};

/**
 * 10. PLANOS — Básico (R$10,00) e Completo (R$27,90).
 *
 * O Básico vem primeiro de propósito: ele estabelece a âncora barata e o
 * empurrão ("há uma opção muito mais completa logo abaixo") entrega o olhar
 * ao Completo, que recebe todo o peso visual — card escuro, borda dourada,
 * selo de mais escolhido e o bloco dos 5 bônus logo abaixo do botão.
 *
 * O id="planos" é o destino de TODOS os CTAs da página.
 */
export function PricingSection() {
  return (
    <section className="bg-cream px-5 py-14 text-ink sm:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="purple">{plans.eyebrow}</Eyebrow>
          <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
            <Highlight text={plans.title} tone="purple" />
          </h2>
        </div>

        <div
          id="planos"
          className="mx-auto mt-10 grid max-w-4xl scroll-mt-16 items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-7"
        >
          {/* ---------------- Plano Básico ---------------- */}
          <div className="flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_14px_38px_-20px_rgba(26,35,56,0.4)] sm:p-7">
            <h3 className="text-xl font-extrabold text-ink">{plans.basic.name}</h3>
            <p className="mt-1 text-[14px] text-ink-soft">{plans.basic.tagline}</p>

            <div className="mt-6">
              <p className="old-price text-sm font-bold">{plans.basic.priceFrom}</p>
              <p className="font-display text-4xl leading-none text-ink">
                {plans.basic.price}
              </p>
            </div>

            {/* Não vai direto ao checkout: abre o popup que oferece o Plano
                Completo com os 5 bônus por R$17,90. Recusar (ou fechar) leva
                ao Básico normalmente — daqui NÃO sai a segunda oferta de
                R$12,90, que é só do popup automático. */}
            <BasicCtaWithUpsell label={plans.basic.cta} />

            <ul className="mt-6 flex-1 space-y-2.5">
              {plans.basic.features.map((f) => (
                <li
                  key={f.text}
                  className="flex items-start gap-2.5 text-[14px] font-medium text-ink"
                >
                  {f.included ? (
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-green-ink"
                      aria-hidden
                    />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                  )}
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Empurrão para o Completo — no desktop os cards ficam lado a lado,
                então o "logo abaixo" só faz sentido no empilhamento do mobile.
                Fica VERMELHO de propósito: é o único aviso de atenção da
                página e, em azul, se dissolveria no resto da paleta. */}
            <div className="mt-7 text-center lg:hidden">
              <p className="text-balance text-[14px] font-extrabold uppercase leading-snug text-danger">
                {plans.basic.nudge}
              </p>
              <ChevronsDown
                aria-hidden
                className="mx-auto mt-1 size-7 animate-bounce text-danger"
                strokeWidth={3}
              />
            </div>
          </div>

          {/* ---------------- Plano Completo (destaque) ---------------- */}
          {/* Peso visual do Completo sem nenhum brilho dourado: borda dourada,
              sombra funda e, no desktop (onde os cards ficam lado a lado), uma
              elevação em relação ao Básico. */}
          <div className="relative flex h-full flex-col rounded-3xl border-2 border-gold bg-plum p-6 pt-10 text-white shadow-[0_30px_70px_-20px_rgba(11,30,91,0.85)] sm:p-8 sm:pt-11 lg:-mt-4">
            <span className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-5 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-ink shadow-lg">
              <Star className="size-3.5 fill-ink" aria-hidden />
              {plans.premium.badge}
            </span>

            {/* Faixa de prazo, logo abaixo do selo "Mais escolhido" e antes do
                nome do plano: abre o card dizendo que a condição tem data.
                VERMELHO (`danger-vivid`) e não dourado — dentro de um card
                azul já cheio de detalhe dourado, mais um bloco dourado viraria
                enfeite; o vermelho lê como aviso. A data é a do dia da visita
                (ver TodayDate). Some se o texto ficar vazio. */}
            {plans.premium.todayBanner && (
              <p className="mb-5 flex items-center justify-center gap-2.5 rounded-xl bg-danger-vivid px-4 py-3 text-center text-[11px] font-extrabold uppercase leading-snug tracking-wide text-white shadow-[0_10px_24px_-12px_rgba(224,27,36,0.9)] sm:text-xs">
                <Clock className="size-5 shrink-0" aria-hidden />
                <span>
                  {plans.premium.todayBanner}{" "}
                  <TodayDate className="tabular-nums" />
                </span>
              </p>
            )}

            <h3 className="text-2xl font-extrabold text-white">
              {plans.premium.name}
            </h3>
            <p className="mt-1 text-[14px] leading-snug text-ink-invert">
              {plans.premium.tagline}
            </p>

            <Image
              src={plans.premium.image.src}
              alt={plans.premium.image.alt}
              width={plans.premium.image.width}
              height={plans.premium.image.height}
              loading="lazy"
              decoding="async"
              quality={65}
              sizes="(min-width: 1024px) 340px, 300px"
              className="mx-auto mt-4 h-auto w-full max-w-[320px] object-contain"
            />

            <div className="mt-6">
              <p className="old-price-dark text-sm font-bold">
                {plans.premium.priceFrom}
              </p>
              {/* "POR APENAS" entre o preço riscado e o preço real — a mesma
                  escrita do popup de upsell, para os dois lugares da página
                  que anunciam o Completo falarem igual. */}
              <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-ink-invert">
                {plans.premium.priceConnector}
              </p>
              <p className="mt-0.5 font-display text-5xl leading-none text-gold">
                {plans.premium.price}
              </p>
              {/* No lugar do "Pagamento único": o espaço logo abaixo do preço
                  é onde os dois valores são comparados, então ele carrega o
                  motivo da diferença em vez de repetir a forma de pagamento
                  (que já aparece na faixa de garantias e no CTA final). */}
              <p className="mx-auto mt-4 flex w-fit max-w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-center text-[11px] font-extrabold uppercase leading-snug tracking-wide text-ink shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)]">
                <Zap className="size-3.5 shrink-0 fill-ink text-ink" aria-hidden />
                {plans.premium.priceBadge}
              </p>
            </div>

            {/* Faixa de prazo, colada no botão: é a última coisa lida antes
                do clique. VERMELHO (`danger-vivid`) e não dourado — dentro de
                um card azul cheio de detalhe dourado, mais um bloco dourado
                viraria enfeite; o vermelho lê como aviso. A data é a do dia da
                visita (ver TodayDate). Some se o texto ficar vazio. */}
            <a
              href={CHECKOUT_URL}
              data-cta-location="plan-premium"
              data-track-id="premium-checkout"
              data-page-variant={PAGE_VARIANT}
              className="mt-6 flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-gradient-to-b from-cta to-cta-dark px-6 py-4 text-center font-cta text-[0.95rem] uppercase leading-tight tracking-wide text-white shadow-[0_14px_32px_-10px_rgba(34,180,85,0.8)] ring-1 ring-inset ring-white/20 transition hover:-translate-y-0.5 hover:brightness-110 sm:text-[1.05rem]"
            >
              {plans.premium.cta}
            </a>

            {/* Bônus logo depois do botão — é o argumento que justifica a
                diferença de preço em relação ao Básico. */}
            <div className="mt-6 rounded-2xl border border-gold/40 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-[14px] font-extrabold text-gold">
                <span aria-hidden>🎁</span>
                {plans.premium.bonusTitle}
              </p>
              <ul className="mt-3 space-y-2.5">
                {bonuses.items.map((b) => (
                  <li
                    key={b.title}
                    className="flex items-start gap-2 text-[13px] font-bold leading-snug text-white"
                  >
                    <Gift className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                    <span>{b.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-5 flex-1 space-y-2.5">
              {plans.premium.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-invert"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* O que vale para os DOIS planos — fora dos cards, para não virar
            item de comparação entre eles. */}
        {/* Largura casada com a dos cards (`max-w-4xl`) e três colunas iguais
            no desktop. Era `w-fit` + coluna centralizada: a caixa nascia da
            largura do item mais longo, ficava mais estreita que os cards e
            desalinhada deles, e os dois itens curtos sobravam de espaço nas
            laterais — daí o card parecer desproporcional. No mobile o
            `justify-center` centraliza a COLUNA inteira dentro da caixa: o
            bloco fica no meio e os três ícones continuam alinhados entre si
            (centralizar item por item deixaria a lista serrilhada). */}
        <ul className="mx-auto mt-8 grid w-full max-w-4xl justify-center gap-3.5 rounded-3xl bg-white px-6 py-5 shadow-[0_14px_38px_-22px_rgba(26,35,56,0.3)] ring-1 ring-black/5 sm:grid-cols-3 sm:gap-6 sm:px-8 sm:py-6">
          {plans.assurances.map((a) => {
            const Icon = assuranceIcons[a.icon];
            return (
              <li
                key={a.text}
                className="flex items-center gap-2 text-[14px] font-extrabold text-green-ink sm:justify-center sm:text-[15px]"
              >
                <Icon className="size-[18px] shrink-0" aria-hidden />
                <span>{a.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
