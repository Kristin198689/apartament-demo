"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Drawn247 } from "@/components/Drawn247/Drawn247";
import styles from "./NoWaitArt.module.css";

const TICKS = "M180.0 30.0 L180.0 56.0 M218.8 35.1 L215.7 46.7 M255.0 50.1 L249.0 60.5 M286.1 73.9 L277.6 82.4 M309.9 105.0 L299.5 111.0 M324.9 141.2 L313.3 144.3 M330.0 180.0 L304.0 180.0 M324.9 218.8 L313.3 215.7 M309.9 255.0 L299.5 249.0 M286.1 286.1 L277.6 277.6 M255.0 309.9 L249.0 299.5 M218.8 324.9 L215.7 313.3 M180.0 330.0 L180.0 304.0 M141.2 324.9 L144.3 313.3 M105.0 309.9 L111.0 299.5 M73.9 286.1 L82.4 277.6 M50.1 255.0 L60.5 249.0 M35.1 218.8 L46.7 215.7 M30.0 180.0 L56.0 180.0 M35.1 141.2 L46.7 144.3 M50.1 105.0 L60.5 111.0 M73.9 73.9 L82.4 82.4 M105.0 50.1 L111.0 60.5 M141.2 35.1 L144.3 46.7";
const TIMES = [3.2, 14.7, 22.3, 7.9, 18.5]; // примеры времени приезда (часы)
const hhmm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/*
 * Графика к «Без ожидания»: уменьшенное «24/7», вычерченный 24-часовой циферблат
 * с ходом стрелки и линейка суток, по которой «приезжают» в разное время.
 */
export function NoWaitArt() {
  const t = useTranslations("NoWait");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % TIMES.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  const h = TIMES[i];

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Drawn247 size="md" />

        <svg className={styles.dial} viewBox="0 0 360 360" role="img" aria-label={t("dial")} focusable="false">
          <circle cx="180" cy="180" r="158" pathLength={1} className={`${styles.draw} ${styles.ring}`} style={{ "--i": 0 } as React.CSSProperties} />
          <circle cx="180" cy="180" r="150" pathLength={1} className={`${styles.draw} ${styles.ring2}`} style={{ "--i": 1 } as React.CSSProperties} />
          <path pathLength={1} className={`${styles.draw} ${styles.ticks}`} style={{ "--i": 2 } as React.CSSProperties} d={TICKS} />
          <g className={styles.nums}>
            <text x="180" y="108" textAnchor="middle">24</text>
            <text x="252" y="186" textAnchor="middle">6</text>
            <text x="180" y="264" textAnchor="middle">12</text>
            <text x="108" y="186" textAnchor="middle">18</text>
          </g>
          <g className={styles.hand}>
            <path pathLength={1} className={`${styles.draw} ${styles.handLine}`} style={{ "--i": 4 } as React.CSSProperties} d="M180 180 V52" />
            <circle cx="180" cy="52" r="7" className={styles.handDot} />
          </g>
          <circle cx="180" cy="180" r="5" className={styles.pivot} />
        </svg>
      </div>

      <div className={styles.ruler}>
        <svg viewBox="0 0 1000 70" className={styles.rulerSvg} aria-hidden="true" focusable="false" preserveAspectRatio="none">
          <path pathLength={1} className={`${styles.draw} ${styles.base}`} style={{ "--i": 3 } as React.CSSProperties} d="M0 34 H1000" />
          <path
            pathLength={1}
            className={`${styles.draw} ${styles.rulerTicks}`}
            style={{ "--i": 4 } as React.CSSProperties}
            d={Array.from({ length: 25 }, (_, k) => `M${(k * 1000) / 24} 34 V${k % 6 === 0 ? 56 : 46}`).join(" ")}
          />
        </svg>
        <div className={styles.labels} aria-hidden="true">
          {["00", "06", "12", "18", "24"].map((x) => <span key={x}>{x}</span>)}
        </div>
        <div className={styles.marker} style={{ left: `${(h / 24) * 100}%` }}>
          <span className={styles.markerLabel} style={{ transform: `translateX(${h < 5 ? "-12%" : h > 19 ? "-88%" : "-50%"})` }}>{t("arrival")} {hhmm(h)}</span>
          <span className={styles.markerDot} />
        </div>
        <p className={styles.band}>{t("checkin")}</p>
      </div>
    </div>
  );
}
