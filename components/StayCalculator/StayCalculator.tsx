"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { isTodo } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/Button/Button";
import styles from "./StayCalculator.module.css";

/*
 * Подбор по сроку и числу гостей: подсказывает подходящий тип и готовит сообщение в WhatsApp.
 * Цены (если заданы в config/property.ts) считаются «от»; пока TODO — «цена по запросу».
 */
export function StayCalculator() {
  const t = useTranslations("Calc");
  const a = useTranslations("Apartments");
  const [nights, setNights] = useState(7);
  const [guests, setGuests] = useState(2);

  const fit = apartmentTypes.find((x) => Number(x.guests) >= guests) ?? apartmentTypes[apartmentTypes.length - 1];
  const hasPrice = !isTodo(fit.priceFrom);
  const rooms = a("rooms", { count: fit.rooms });
  const text = t("message", { nights, guests, rooms });

  const fill = (v: number, min: number, max: number) => `${((v - min) / (max - min)) * 100}%`;

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{t("title")}</h3>

      <div className={styles.controls}>
        <label className={styles.control}>
          <span className={styles.row}>
            <span>{t("nights")}</span>
            <output className={styles.value}>{nights}</output>
          </span>
          <input
            type="range"
            min={1}
            max={90}
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
            style={{ "--fill": fill(nights, 1, 90) } as React.CSSProperties}
          />
        </label>
        <label className={styles.control}>
          <span className={styles.row}>
            <span>{t("guests")}</span>
            <output className={styles.value}>{guests}</output>
          </span>
          <input
            type="range"
            min={1}
            max={8}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            style={{ "--fill": fill(guests, 1, 8) } as React.CSSProperties}
          />
        </label>
      </div>

      <div className={styles.result} aria-live="polite">
        <p className={styles.fitLabel}>{t("fit")}</p>
        <p className={styles.fit}>{rooms} <span>· {fit.area} m²</span></p>
        <p className={styles.price}>
          {hasPrice ? t("from", { price: fit.priceFrom }) : t("price")}
        </p>
        {nights >= 30 ? <p className={styles.note}>{t("long")}</p> : null}
        <div className={styles.cta}>
          <Button href={whatsappUrl(text)} size="sm">{t("cta")}</Button>
        </div>
      </div>
    </div>
  );
}
