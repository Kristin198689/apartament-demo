import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

/*
 * Картинки для превью ссылок (Telegram, WhatsApp, Facebook, LinkedIn, iMessage, X, Slack…).
 * Файлы лежат в /public/social и генерируются скриптом scripts/brand/make_assets.py.
 */
const OG_LOCALE: Record<Locale, string> = { en: "en_US", de: "de_DE", ru: "ru_RU" };

export function ogLocale(locale: Locale): string {
  return OG_LOCALE[locale];
}

export function ogImages(locale: Locale, alt?: string) {
  return [
    {
      url: `/social/og-${locale}.png`,
      width: 1200,
      height: 630,
      alt: alt ?? siteConfig.name,
    },
  ];
}
