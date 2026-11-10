import { notFound } from "next/navigation";

/*
 * Любой неизвестный адрес внутри языка (например /de/uk) попадает сюда
 * и показывает страницу 404 с шапкой и подвалом сайта.
 */
export default function CatchAll() {
  notFound();
}
