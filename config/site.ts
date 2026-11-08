/*
 * Все данные о бизнесе — здесь. Реальные значения подставим позже.
 * Пока везде TODO: ничего не выдумываем.
 */
export const siteConfig = {
  name: "Apartament Demo",
  city: "Wertheim", // TODO: подтвердить у заказчика
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

export const developer = {
  name: "Volodina Web Studio",
  url: "https://volodina-web-studio-amber.vercel.app", // из GitHub-репозитория студии; заменить на финальный домен
} as const;

export const isTodo = (value: string) => value === "TODO";

/*
 * Внешние ссылки. Пока TODO — используются безопасные запасные адреса
 * (поиск на Google Картах по городу, главная Booking.com). Подставить реальные.
 */
export const links = {
  googleMaps: "TODO", // ссылка «Поделиться» с карточки Google Maps
  googleReviews: "TODO", // ссылка на отзывы Google
} as const;

export function mapsUrl(): string {
  return isTodo(links.googleMaps)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.city)}`
    : links.googleMaps;
}
export function googleReviewsUrl(): string {
  return isTodo(links.googleReviews) ? mapsUrl() : links.googleReviews;
}

/*
 * Медиа. Видео для блока под hero: положить файл в /public/video/ и указать путь,
 * напр. "/video/town.mp4". Рекомендация: 1920×820 или 1280×548, без звука, 6–12 сек
 * в цикле, до ~3 МБ (H.264 mp4), плюс постер-кадр.
 */
export const media = {
  townVideo: "TODO",
  townPoster: "TODO",
} as const;
