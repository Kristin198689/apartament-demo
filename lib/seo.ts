import type { Metadata } from "next";
import { isTodo, siteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";

/** canonical + hreflang для страницы. path — без локали, напр. "/blog". */
export function localeAlternates(path: string, locale: Locale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

/** Безопасная сериализация JSON-LD для вставки в <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Базовый адрес сайта: реальный домен, если задан, иначе локальный. */
export function siteUrl(): string {
  return isTodo(siteConfig.domain) ? "http://localhost:3000" : siteConfig.domain;
}
