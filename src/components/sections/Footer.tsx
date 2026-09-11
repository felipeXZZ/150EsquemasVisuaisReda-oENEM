import { BRAND_NAME, BRAND_YEAR, footer } from "@/content";

/**
 * 14. RODAPÉ — fecho curto, no mesmo formato da outra página da marca:
 * fundo claro, duas linhas centralizadas e nada de menu.
 *
 * Fundo CREME (e não azul escuro): logo acima está o CTA final sobre azul —
 * um rodapé escuro grudado nele faria a dobra inteira virar um bloco só e o
 * botão perderia o recorte.
 */
export function Footer() {
  return (
    <footer className="bg-cream px-5 py-10 text-center text-ink-soft">
      <p className="text-[13px] leading-relaxed">
        © {BRAND_YEAR} {BRAND_NAME}. {footer.rights}
      </p>
      <p className="mx-auto mt-4 max-w-md text-[12px] leading-relaxed text-ink-soft/75">
        {footer.disclaimer}
      </p>
    </footer>
  );
}
