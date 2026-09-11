import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Inlina o CSS no <head> (vira <style> em vez de <link>): elimina o request
    // render-blocking de CSS. Ideal aqui — página única, Tailwind (CSS atômico
    // pequeno) e tráfego de anúncio (visitante novo) em conexões lentas.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 passou a aceitar SÓ as qualidades listadas aqui (padrão [75]) e a
    // coagir o resto para a mais próxima — sem esta lista, os `quality` menores
    // dos componentes eram silenciosamente ignorados e tudo saía em 75.
    qualities: [50, 65, 75],
    minimumCacheTTL: 31536000, // 1 ano
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*.:ext(png|jpg|jpeg|webp|avif|gif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
