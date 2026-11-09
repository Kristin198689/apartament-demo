/*
 * Демо-фото (чёрно-белые иллюстрации, НЕ от клиента). Файлы лежат в /public/images.
 * Когда появятся настоящие фото — заменить файлы с теми же именами или поменять пути здесь.
 * position — точка кадрирования (object-position) при обрезке под рамку.
 */
export type Photo = { src: string; position?: string };

export const images = {
  hero: { src: "/images/castle-wertheim.webp", position: "56% 45%" },
  panorama: { src: "/images/castle-wertheim.webp", position: "50% 40%" },
  entrance: { src: "/images/corridor-doors.webp", position: "50% 50%" },
  exterior: { src: "/images/building-exterior.webp", position: "50% 55%" },
  kitchen: { src: "/images/kitchen.webp", position: "55% 50%" },
  bedroom: { src: "/images/bedroom-two-beds.webp", position: "50% 55%" },
  bath: { src: "/images/bathroom.webp", position: "50% 50%" },
  living: { src: "/images/living-dining.webp", position: "50% 55%" },
} as const satisfies Record<string, Photo>;
