"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/Button/Button";
import { CopyButton } from "@/components/CopyButton/CopyButton";
import styles from "./HrPlanner.module.css";

/* Подбор состава апартаментов под команду: крупные типы для основной части, остаток — подходящим по размеру. */
function plan(people: number) {
  const big = apartmentTypes[apartmentTypes.length - 1];
  const cap = Number(big.guests);
  const full = Math.floor(people / cap);
  const rest = people - full * cap;
  const mix: { type: (typeof apartmentTypes)[number]; count: number }[] = [];
  if (full > 0) mix.push({ type: big, count: full });
  if (rest > 0) mix.push({ type: apartmentTypes.find((x) => Number(x.guests) >= rest) ?? big, count: 1 });
  return mix;
}

export function HrPlanner() {
  const t = useTranslations("HrPlanner");
  const a = useTranslations("Apartments");
  const c = useTranslations("Calc");
  const [people, setPeople] = useState(6);
  const [weeks, setWeeks] = useState(8);

  const mix = useMemo(() => plan(people), [people]);
  const nights = weeks * 7;
  const apartments = mix.reduce((n, m) => n + m.count, 0);
  const beds = mix.reduce((n, m) => n + m.count * Number(m.type.beds), 0);
  const area = mix.reduce((n, m) => n + m.count * Number(m.type.area), 0);
  const mixText = mix.map((m) => t("mix", { count: m.count, rooms: a("rooms", { count: m.type.rooms }) })).join(" + ");
  const message = t("message", { people, weeks, nights, mix: mixText });
  const fill = (v: number, min: number, max: number) => `${((v - min) / (max - min)) * 100}%`;

  return (
    <section className={`${styles.wrap} no-print`} aria-label={t("title")}>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.controls}>
        <label className={styles.control}>
          <span className={styles.row}><span>{t("people")}</span><output>{people}</output></span>
          <input type="range" min={1} max={40} value={people} onChange={(e) => setPeople(Number(e.target.value))} style={{ "--fill": fill(people, 1, 40) } as React.CSSProperties} />
        </label>
        <label className={styles.control}>
          <span className={styles.row}><span>{t("weeks")}</span><output>{weeks}</output></span>
          <input type="range" min={1} max={52} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} style={{ "--fill": fill(weeks, 1, 52) } as React.CSSProperties} />
        </label>
      </div>
      <dl className={styles.result} aria-live="polite">
        <div><dt>{t("apartments")}</dt><dd>{apartments}<span>{mixText}</span></dd></div>
        <div><dt>{t("beds")}</dt><dd>{beds}</dd></div>
        <div><dt>{t("area")}</dt><dd>{area} <span>m²</span></dd></div>
        <div><dt>{t("weeks")}</dt><dd className={styles.small}>{t("nights", { count: nights })}<span>{t("personNights", { count: nights * people })}</span></dd></div>
      </dl>
      <p className={styles.note}>{t("price")}</p>
      <div className={styles.actions}>
        <Button href={whatsappUrl(message)} size="sm">{c("cta")}</Button>
        <CopyButton text={message} label={c("copy")} doneLabel={c("copied")} />
      </div>
    </section>
  );
}
