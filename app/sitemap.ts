import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { posts } from "@/content/blog/posts";
import { siteUrl } from "@/lib/seo";

const PAGES = ["", "/blog", "/hr", "/impressum", "/datenschutz", ...posts.map((p) => `/blog/${p.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PAGES.flatMap((path) =>
    routing.locales.map((l) => ({
      url: `${base}/${l}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("/blog") || path === "/hr" ? 0.7 : 0.3,
      alternates: { languages: Object.fromEntries(routing.locales.map((x) => [x, `${base}/${x}${path}`])) },
    })),
  );
}
