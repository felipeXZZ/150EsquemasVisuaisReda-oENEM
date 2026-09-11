import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { guarantee } from "@/content";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";

/**
 * 11. GARANTIA — reversão de risco antes do FAQ.
 *
 * O texto fala em "período informado na oferta" e o selo mostra o prazo: os
 * dois PRECISAM bater com a política real do checkout (content.ts avisa).
 */
export function GuaranteeSection() {
  return (
    <Section bg="white">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        {guarantee.sealSrc ? (
          <Image
            src={guarantee.sealSrc}
            alt={guarantee.sealAlt}
            width={300}
            height={300}
            loading="lazy"
            quality={75}
            sizes="128px"
            className="h-auto w-28 object-contain sm:w-32"
          />
        ) : (
          <span className="flex size-24 items-center justify-center rounded-full bg-white text-green-ink shadow-sm">
            <ShieldCheck className="size-12" aria-hidden />
          </span>
        )}

        <Eyebrow tone="green">{guarantee.eyebrow}</Eyebrow>
        <h2 className="font-display text-balance text-[1.6rem] leading-tight text-ink sm:text-3xl">
          {guarantee.title}
        </h2>
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {guarantee.text}
        </p>
        <span className="rounded-full bg-green-ink px-5 py-2 text-[13px] font-extrabold uppercase tracking-wide text-white">
          {guarantee.badge}
        </span>
      </div>
    </Section>
  );
}
