import { defineRouting } from "next-intl/routing";

/*
 * Языки сайта. Чтобы включить польский:
 * 1) добавьте "pl" в locales, 2) создайте messages/pl.json (копия en.json).
 */
export const routing = defineRouting({
  locales: ["en", "de", "ru"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
