"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content";
import { Section, SectionHead } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Highlight } from "@/components/Highlight";
import { CTAButton } from "@/components/CTAButton";
import { TestimonialCard } from "@/components/TestimonialCard";

/**
 * 9. PROVA SOCIAL.
 *
 * Depoimentos em cartão (aspa, estrelas, nome e selo de compra verificada),
 * num carrossel horizontal com scroll-snap + indicadores (bolinhas). Avança
 * sozinho quando o usuário não interage; ao arrastar/tocar, pausa e retoma
 * após alguns segundos de inatividade. Prova social crua, antes da oferta.
 *
 * Era um carrossel de PRINTS de conversa: as imagens eram da oferta anterior
 * (festas) e não valem para esta. Cartão de texto entrega a mesma prova sem
 * depender de arte nova — e volta a ser print assim que houver print real.
 *
 * DESEMPENHO (a seção fica no meio da página, num aparelho barato):
 * - o autoplay só roda com a seção NA TELA (IntersectionObserver). Fora dela o
 *   intervalo nem é criado — nada de scroll/paint em segundo plano;
 * - o `onScroll` é agrupado por requestAnimationFrame e a largura do card fica
 *   em cache (recalculada no resize), então rolar não força layout a cada
 *   evento — era daí que vinha o engasgo no arrasto;
 * - com `prefers-reduced-motion`, o carrossel não anda sozinho: vira rolagem
 *   manual.
 *
 * ⚠️ REGRA DA SEÇÃO: o depoimento publicado aqui é afirmado como verdade — ele
 * diz que existe um estudante real por trás da frase.
 *
 * ➜ Para publicar sem prova social: remova <TestimonialsSection/> do page.tsx.
 */
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  /** Largura do card + gap, em cache: ler offsetWidth a cada scroll trava. */
  const stepRef = useRef(0);
  const [active, setActive] = useState(0);

  const stepSize = () => {
    if (stepRef.current) return stepRef.current;
    const slide = trackRef.current?.firstElementChild as HTMLElement | null;
    stepRef.current = slide ? slide.offsetWidth + 16 /* gap-4 */ : 0;
    return stepRef.current;
  };

  // O cache da largura só é invalidado quando a viewport muda de tamanho.
  useEffect(() => {
    const invalidate = () => {
      stepRef.current = 0;
    };
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("orientationchange", invalidate);
    return () => {
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("orientationchange", invalidate);
    };
  }, []);

  const onScroll = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = trackRef.current;
      const step = stepSize();
      if (!el || !step) return;
      const i = Math.round(el.scrollLeft / step);
      setActive((prev) => (prev === i ? prev : i));
    });
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    const step = stepSize();
    if (!el || !step) return;
    el.scrollTo({ left: i * step, behavior: "smooth" });
  };

  // Pausa o autoplay quando o usuário interage; retoma após 6s parado.
  const pause = () => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, 6000);
  };

  // Autoplay: a cada 2,8s avança um card (loop). Só existe enquanto a seção
  // está visível e o visitante aceita animação.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = testimonials.items.length;
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        const track = trackRef.current;
        const step = stepSize();
        if (!track || !step || pausedRef.current) return;
        const current = Math.round(track.scrollLeft / step);
        track.scrollTo({ left: ((current + 1) % count) * step, behavior: "smooth" });
      }, 2800);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop();
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Section bg="white">
      <div ref={sectionRef}>
        <SectionHead>
          <Eyebrow tone="purple">{testimonials.eyebrow}</Eyebrow>
          <h2 className="font-display text-balance mt-3 text-[1.75rem] leading-tight text-ink sm:text-4xl">
            <Highlight text={testimonials.title} tone="purple" />
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {testimonials.subtitle}
          </p>
        </SectionHead>

        {/* Carrossel de depoimentos (swipe no celular). py generoso para a
            sombra dos cards não ser cortada pelo overflow do scroll. */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={pause}
          onTouchStart={pause}
          onWheel={pause}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1rem,calc((100%-360px)/2))] py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.items.map((item) => (
            <div
              key={item.name}
              className="w-[85vw] max-w-[360px] shrink-0 snap-center"
            >
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>

        {/* Indicadores (bolinhas). O botão tem área de toque de ~44px para
            acessibilidade, mantendo o ponto visual pequeno (10px). */}
        <div className="mt-1 flex items-center justify-center">
          {testimonials.items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                pause();
                goTo(i);
              }}
              aria-label={`Ir para a avaliação ${i + 1}`}
              className="flex min-h-11 min-w-11 items-center justify-center p-2"
            >
              <span
                className={`block size-2.5 rounded-full transition-colors ${
                  i === active ? "bg-purple-ink" : "bg-plum/20"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <CTAButton
            size="lg"
            href="#planos"
            location="testimonials"
            trackId="testimonials-plans"
          >
            {testimonials.cta}
          </CTAButton>
        </div>
      </div>
    </Section>
  );
}
