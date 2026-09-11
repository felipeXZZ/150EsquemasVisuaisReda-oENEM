import React from "react";
import Image from "next/image";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { testimonials } from "@/content";

type Item = (typeof testimonials.items)[number];

/** `{{trecho}}` vira negrito — o olho pega a frase-chave antes de ler a aspa inteira. */
function QuoteText({ text }: { text: string }) {
  const parts = text.split(/(\{\{.*?\}\})/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("{{") && part.endsWith("}}") ? (
          <strong key={i} className="font-extrabold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

/**
 * Cartão de avaliação: estrelas, aspa com trechos em negrito, e rodapé com
 * foto, nome e selo de compra verificada.
 */
export function TestimonialCard({ item }: { item: Item }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_12px_32px_-18px_rgba(26,35,56,0.4)] ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex gap-0.5"
          role="img"
          aria-label={`Nota ${item.stars} de 5`}
        >
          {Array.from({ length: item.stars }).map((_, i) => (
            <Star key={i} className="size-5 fill-gold text-gold" aria-hidden />
          ))}
        </div>
        <Quote className="size-7 shrink-0 fill-ink/10 text-ink/10" aria-hidden />
      </div>

      <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-soft sm:text-base">
        &ldquo;
        <QuoteText text={item.quote} />
        &rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {/* Foto real quando houver; senão, um círculo com a inicial do nome.
            Reaproveitar a foto de outra pessoa aqui seria afirmar que ela é a
            autora do depoimento — a inicial diz a mesma coisa sem mentir. */}
        {item.avatar ? (
          <Image
            src={item.avatar}
            alt=""
            width={96}
            height={96}
            sizes="48px"
            loading="lazy"
            quality={70}
            className="size-12 shrink-0 rounded-full object-cover ring-1 ring-black/5"
          />
        ) : (
          <span
            aria-hidden
            className="font-display flex size-12 shrink-0 items-center justify-center rounded-full bg-lilac text-lg text-purple-ink ring-1 ring-black/5"
          >
            {item.name.trim().charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold leading-tight text-ink">
            {item.name}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">
            {item.role}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-green-ink">
            <BadgeCheck className="size-4 shrink-0" aria-hidden />
            {testimonials.verifiedLabel}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
