import { UrgencyBar } from "@/components/sections/UrgencyBar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ShowcaseCarousel } from "@/components/sections/ShowcaseCarousel";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { BonusSection } from "@/components/sections/BonusSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { AutoUpsellPopup } from "@/components/UpsellPopup";
import { PurchaseNotifications } from "@/components/PurchaseNotifications";

/**
 * "+150 Esquemas Visuais para Redação Nota 1000 no ENEM" — landing de venda.
 *
 * A ordem das seções é a jornada mental de quem visita, e não uma lista de
 * blocos: quero tirar nota alta na redação → achei que precisava de curso caro
 * → dá pra aprender do meu jeito → existe material de verdade, e é bastante →
 * não preciso criar estrutura nenhuma → vou saber o que escrever em cada
 * parágrafo → ainda ganho materiais extras → custa menos que uma aula
 * particular → não tenho risco → posso comprar agora.
 *
 * Todo o texto vive em src/content.ts.
 */
export default function Home() {
  return (
    <>
      <UrgencyBar />
      <main>
        {/* 2 · "Sua redação pode ser mais simples do que parece" */}
        <HeroSection />
        {/* 3 · Existem 150 esquemas para escolher, e são páginas de verdade */}
        <ShowcaseCarousel />
        {/* 7 · Isso é para mim? */}
        <AudienceSection />
        {/* 8 · Ainda recebo materiais extras */}
        <BonusSection />
        {/* 9 · Prova social (⚠️ depoimentos precisam ser reais) */}
        <TestimonialsSection />
        {/* 10 · Custa muito menos que uma aula particular de redação */}
        <PricingSection />
        {/* 11 · Sem risco */}
        <GuaranteeSection />
        {/* 12 · Dúvidas */}
        <FAQSection />
        {/* 13 · Posso comprar agora */}
        <FinalCTA />
        {/* 14 · Rodapé */}
        <Footer />
      </main>
      {/* Sobe sozinho o popup de R$15,90 depois de um tempo na página ou
          quando o ponteiro vai sair pelo topo. Fica FORA do <main> porque
          não é conteúdo da página: é uma camada por cima dela. */}
      <AutoUpsellPopup />
      {/* Balãozinho de "fulana acabou de comprar" no canto inferior esquerdo,
          a partir de 5s de página. Também é camada, não conteúdo — e fica
          ABAIXO do popup acima no empilhamento. ⚠️ Afirma vendas: ver o aviso
          em purchaseNotifications, no content.ts. */}
      <PurchaseNotifications />
      {/* Seções desligadas a pedido — os componentes continuam em
          components/sections/ e voltam com um import + a linha aqui:
            <StickyMobileCTA />   barra fixa de CTA no celular
            <ProjectGallery />    galeria ilustrada "veja alguns dos esquemas"
            <VideoSection />      vídeo demonstrativo (ainda sem vídeo real)
            <ProjectInside />     "cada esquema mostra o que escrever de verdade"
            <ThreeSteps />        os 3 passos "simples assim"
            <PinterestComparison /> "apostila explica a teoria; o esquema mostra
                                    o que escrever" (saiu no lugar da seção
                                    "ideal para")
          ProjectGallery, VideoSection e ProjectInside saíram porque a
          vitrine em carrossel logo abaixo da hero já mostra as pranchas
          REAIS — as ilustrações vetoriais e o espaço reservado do vídeo
          repetiam o argumento com material mais fraco.
          ⚠️ ProjectGallery e ProjectInside ainda desenham FESTA (<ThemeArt/>):
          religar sem trocar a ilustração coloca balões numa página de redação. */}
    </>
  );
}
