import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content";

/** robots.txt — permite tudo e aponta o sitemap (SEO técnico). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
