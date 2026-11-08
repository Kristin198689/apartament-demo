/*
 * Данные об объекте. Всё, что "TODO" — ждём от заказчика.
 * Типы (1–4 комнаты) и расстояния взяты с текущего сайта заказчика —
 * ПОДТВЕРДИТЬ перед публикацией.
 */
export type ApartmentType = {
  id: string;
  rooms: 1 | 2 | 3 | 4;
  area: string; // м², напр. "42"
  guests: string; // макс. человек
  beds: string;
  priceFrom: string; // € / ночь
};

export const apartmentTypes: readonly ApartmentType[] = [
  { id: "r1", rooms: 1, area: "TODO", guests: "TODO", beds: "TODO", priceFrom: "TODO" },
  { id: "r2", rooms: 2, area: "TODO", guests: "TODO", beds: "TODO", priceFrom: "TODO" },
  { id: "r3", rooms: 3, area: "TODO", guests: "TODO", beds: "TODO", priceFrom: "TODO" },
  { id: "r4", rooms: 4, area: "TODO", guests: "TODO", beds: "TODO", priceFrom: "TODO" },
];

export type Distance = {
  id: string;
  /** Если задан labelKey — подпись переводится, иначе name — имя собственное. */
  labelKey?: "station" | "oldTown";
  name?: string;
  minutes: number;
  mode: "walk" | "car";
};

export const distances: readonly Distance[] = [
  { id: "station", labelKey: "station", minutes: 10, mode: "walk" },
  { id: "oldTown", labelKey: "oldTown", minutes: 5, mode: "car" },
  { id: "kuelsheim", name: "Külsheim", minutes: 15, mode: "car" },
  { id: "marktheidenfeld", name: "Marktheidenfeld", minutes: 20, mode: "car" },
  { id: "tbb", name: "Tauberbischofsheim", minutes: 30, mode: "car" },
  { id: "miltenberg", name: "Miltenberg", minutes: 30, mode: "car" },
  { id: "wuerzburg", name: "Würzburg", minutes: 35, mode: "car" },
  { id: "frankfurt", name: "Frankfurt", minutes: 60, mode: "car" },
];
