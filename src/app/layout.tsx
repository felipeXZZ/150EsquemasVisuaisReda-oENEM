import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Tracking } from "@/components/Tracking";
import { SITE_URL, BRAND_NAME } from "@/content";
import "./globals.css";

// Fonte única do site — Poppins (corpo + títulos). A lista de pesos é enxuta
// de propósito: cada peso vira um woff2 com preload no <head>, disputando
// banda com a primeira dobra num tráfego de anúncio em conexão lenta.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

const TITLE = "+150 Esquemas Visuais para Redação Nota 1000 no ENEM";
const DESCRIPTION =
  "Pare de travar na folha em branco: 150 esquemas visuais para estruturar, argumentar e revisar sua redação do ENEM. Competências, repertório, conectivos e proposta de intervenção, sem apostila longa e sem decoreba.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${TITLE} | Estruture, argumente e revise`,
  description: DESCRIPTION,
  applicationName: TITLE,
  keywords: [
    "redação ENEM",
    "redação nota 1000",
    "como fazer redação do ENEM",
    "competências da redação do ENEM",
    "proposta de intervenção",
    "repertório sociocultural",
    "conectivos para redação",
    "estrutura da redação dissertativa argumentativa",
  ],
  alternates: { canonical: "/" },
  // Evita que o iOS transforme os preços em links de telefone.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: BRAND_NAME,
    // ⚠️ REVISAR: falta a imagem de compartilhamento (1200x630) da nova
    // oferta. Coloque o arquivo em /public e declare `images` aqui — sem ela
    // o link compartilhado no WhatsApp/Instagram aparece sem miniatura.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  // maximumScale NÃO é limitado de propósito: o usuário precisa poder dar
  // zoom (requisito de acessibilidade).
};

/**
 * Dados estruturados (Product) — rich results no Google.
 * Sem `aggregateRating`: não existe avaliação real coletada, e declarar uma
 * nota inventada aqui seria dado falso publicado em markup estruturado.
 */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: TITLE,
  description: DESCRIPTION,
  brand: { "@type": "Brand", name: BRAND_NAME },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "10.00",
    highPrice: "25.90",
    offerCount: 2,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Resource hints das CDNs de terceiros. Utmify carrega JS via
            <script src> (sem CORS): preconnect SEM crossorigin, senão a
            conexão não é reaproveitada. */}
        <link rel="preconnect" href="https://cdn.utmify.com.br" />
        <link rel="dns-prefetch" href="https://cdn.utmify.com.br" />
        <link rel="preconnect" href="https://api6.ipify.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api6.ipify.org" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <ScrollToTop />
        <Tracking />
        {children}

        {/* Utmify — captura de UTMs */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          strategy="afterInteractive"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
        />

        {/* Utmify — Pixel de conversão */}
        <Script id="utmify-pixel" strategy="lazyOnload">
          {`
            window.pixelId = "6aa4c8286a08a80979bf4d40";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>
      </body>
    </html>
  );
}
