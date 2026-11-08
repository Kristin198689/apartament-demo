import { Inter_Tight } from "next/font/google";

/*
 * ЕДИНСТВЕННОЕ место, где выбирается шрифт.
 * Чтобы сменить шрифт на всём сайте: замените Inter_Tight на другой
 * Google Font (напр. Manrope, Instrument_Sans) — больше нигде ничего не трогаем.
 * Подмножества latin-ext (DE/PL) и cyrillic (RU) обязательны.
 */
export const fontSans = Inter_Tight({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans-loaded",
  display: "swap",
});
