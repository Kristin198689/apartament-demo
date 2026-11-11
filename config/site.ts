/*
 * Все данные о бизнесе — здесь. Реальные значения подставим позже.
 * Пока везде TODO: ничего не выдумываем. Город — нейтральное демо-название.
 */
export const siteConfig = {
  name: "Apartament Demo",
  city: "Musterstadt", // нейтральное демо-название; заменить на город заказчика
  domain: "https://apartament-demo.vercel.app", // демо-деплой; заменить на домен заказчика
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
  url: "https://volodina-webstudio.de",
} as const;

export const isTodo = (value: string) => value === "TODO";

/*
 * Внешние ссылки. Пока TODO — кнопки ведут на демо-страницу 404 (внутренний адрес /404).
 * Когда будут реальные адреса, впишите их сюда — кнопки заработают сами.
 */
export const links = {
  googleMaps: "TODO", // ссылка «Поделиться» с карточки на карте
  googleReviews: "TODO", // ссылка на страницу отзывов
} as const;

export const mapsUrl = () => (isTodo(links.googleMaps) ? "/404" : links.googleMaps);
export const reviewsUrl = () => (isTodo(links.googleReviews) ? "/404" : links.googleReviews);

/*
 * Медиа. Видео для блока под hero: положить файл в /public/video/ и указать путь,
 * напр. "/video/town.mp4". Рекомендация: 1920×820 или 1280×548, без звука, 6–12 сек
 * в цикле, до ~3 МБ (H.264 mp4), плюс постер-кадр.
 */
export const media = {
  townVideo: "TODO",
  townPoster: "TODO",
} as const;
