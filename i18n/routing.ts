import { defineRouting } from "next-intl/routing";

/*
 * Языки сайта. Чтобы включить польский:
 * 1) добавьте "pl" в locales, 2) создайте messages/pl.json (копия en.json).
 */
export const routing = defineRouting({
  locales: ["en", "de", "ru"],
  defaultLocale: "de",
  localeDetection: false, // корень сайта всегда открывает немецкую версию, независимо от языка браузера
});

export type Locale = (typeof routing.locales)[number];
