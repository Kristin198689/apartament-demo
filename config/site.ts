/*
 * Все данные о бизнесе — здесь. Реальные значения подставим позже.
 * Пока везде TODO: ничего не выдумываем.
 */
export const siteConfig = {
  name: "Apartament Demo",
  domain: "TODO", // напр. https://example.com
  whatsappNumber: "TODO", // международный формат без "+", напр. 491701234567
  email: "TODO",
  phone: "TODO",
  address: {
    street: "TODO",
    zip: "TODO",
    city: "TODO",
    country: "TODO",
  },
} as const;

export const isTodo = (value: string) => value === "TODO";
