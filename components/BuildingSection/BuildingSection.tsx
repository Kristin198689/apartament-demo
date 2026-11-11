"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./BuildingSection.module.css";

const FLOORS = ["f3", "f2", "f1", "f0"] as const; // сверху вниз
const FH = 78; // высота этажа
const X0 = 60;
const W = 400;

/*
 * Разрез дома по этажам. Клик по этажу показывает, что на нём.
 * Окна «зажигаются» вечером по местному времени посетителя (с 17 до 7).
 */
export function BuildingSection() {
  const t = useTranslations("Building");
  const [active, setActive] = useState<(typeof FLOORS)[number]>("f1");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const hour = now?.getHours() ?? 12;
  const lit = hour >= 17 || hour < 7;
  const time = now ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` : "";

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{t("title")}</h3>
      <div className={styles.stage}>
        <svg className={styles.svg} viewBox="0 0 520 360" role="img" aria-label={t("title")} focusable="false">
          <path className={styles.line} d="M20 330 H500" />
          <path className={styles.line} d={`M${X0} 330 V${330 - FH * 4} H${X0 + W} V330 M${X0 - 10} ${330 - FH * 4} H${X0 + W + 10}`} />
          {FLOORS.map((k, i) => {
            const y = 330 - FH * (4 - i);
            const isGround = k === "f0";
            return (
              <g key={k} className={styles.floor} data-on={active === k}>
                <rect x={X0} y={y} width={W} height={FH} className={styles.hl} />
                <path className={styles.line} d={`M${X0} ${y + FH} H${X0 + W}`} />
                {isGround ? (
                  <>
                    <rect x={X0 + 170} y={y + 22} width="60" height={FH - 22} className={styles.line} />
                    <path className={styles.line} d={`M${X0 + 200} ${y + 22} V${y + FH}`} />
                    {[0, 1].map((n) => <rect key={n} x={X0 + 30 + n * 250} y={y + 40} width="90" height="26" className={styles.car} rx="4" />)}
                  </>
                ) : (
                  [0, 1, 2, 3].map((n) => (
                    <rect key={n} x={X0 + 40 + n * 90} y={y + 18} width="50" height="40" className={styles.win} data-lit={lit} />
                  ))
                )}
                <rect x={X0} y={y} width={W} height={FH} className={styles.hit} tabIndex={0} role="button" aria-pressed={active === k} aria-label={t(`floors.${k}.name`)} onClick={() => setActive(k)} onFocus={() => setActive(k)} onMouseEnter={() => setActive(k)} />
              </g>
            );
          })}
        </svg>
        <aside className={styles.panel} aria-live="polite">
          <h4 className={styles.name}>{t(`floors.${active}.name`)}</h4>
          <p className={styles.text}>{t(`floors.${active}.text`)}</p>
          <p className={styles.time}>{now ? `${t("now", { time })} · ${lit ? t("lit") : t("day")}` : t("hint")}</p>
        </aside>
      </div>
      <p className={styles.note}>{t("note")}</p>
    </div>
  );
}
