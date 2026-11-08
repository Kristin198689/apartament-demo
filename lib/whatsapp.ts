import { isTodo, siteConfig } from "@/config/site";

/** Пока номер = TODO, ведём на форму контакта. */
export function whatsappUrl(text: string): string {
  if (isTodo(siteConfig.whatsappNumber)) return "#contact";
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
