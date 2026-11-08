import { Inter_Tight, Jost } from "next/font/google";

/*
 * ЕДИНСТВЕННОЕ место, где выбираются шрифты.
 * fontSans    — основной текст и интерфейс: Jost (тонкий, лёгкий).
 * fontDisplay — только заголовки: Inter Tight (плотный, editorial).
 * Чтобы сменить шрифт: замените на другой Google Font — больше нигде ничего не трогаем.
 * Подмножества latin-ext (DE/PL) и cyrillic (RU) обязательны.
 */
export const fontSans = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans-loaded",
  display: "swap",
});

export const fontDisplay = Inter_Tight({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-display-loaded",
  display: "swap",
});
