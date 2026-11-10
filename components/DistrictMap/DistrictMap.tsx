import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { distances } from "@/config/property";
import styles from "./DistrictMap.module.css";

const CX = 300;
const CY = 290;
const rOf = (min: number) => 40 + min * 4.9;
const ANGLE: Record<string, number> = {
  supermarket: 200, station: 325, oldTown: 70, highway: 130, industrial: 250, nextTown: 10, bigCity: 165, airport: 290,
};
const RINGS = [10, 20, 35, 45];

const s = (i: number) => ({ "--i": i }) as CSSProperties;

/*
 * Схема района линиями вместо карты: объект в центре, кольца времени в пути,
 * «улицы» до объектов, шоссе и река. Демо-значения. Рисуется при появлении в окне.
 */
export function DistrictMap() {
  const t = useTranslations("Location");

  const pts = distances.map((d) => {
    const a = (ANGLE[d.id] ?? 0) * (Math.PI / 180);
    const r = rOf(d.minutes);
    return { d, x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  });

  return (
    <figure className={styles.fig}>
      <svg className={styles.svg} viewBox="0 0 600 580" role="img" aria-label={t("map.caption")} focusable="false">
        {/* сетка квартала */}
        <g className={styles.grid}>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`v${i}`} pathLength={1} className={styles.draw} style={s(0)} d={`M${60 + i * 60} 20 V560`} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`h${i}`} pathLength={1} className={styles.draw} style={s(0)} d={`M20 ${60 + i * 60} H580`} />
          ))}
        </g>

        {/* шоссе и река */}
        <path pathLength={1} className={`${styles.draw} ${styles.road}`} style={s(1)} d="M0 190 C150 215 270 150 600 118" />
        <path pathLength={1} className={`${styles.draw} ${styles.road}`} style={s(1)} d="M0 198 C150 223 270 158 600 126" />
        <path pathLength={1} className={`${styles.draw} ${styles.river}`} style={s(2)} d="M0 470 C120 440 200 510 330 480 S520 450 600 490" />

        {/* кольца времени */}
        {RINGS.map((m, i) => (
          <g key={m}>
            <circle cx={CX} cy={CY} r={rOf(m)} pathLength={1} className={`${styles.draw} ${styles.ring}`} style={s(2 + i)} />
            <text x={CX + rOf(m) * 0.707 + 4} y={CY - rOf(m) * 0.707 - 4} className={styles.ringText}>
              {t("map.min", { minutes: m })}
            </text>
          </g>
        ))}

        {/* улицы до объектов (ломаные под прямым углом) */}
        {pts.map(({ d, x, y }, i) => (
          <path key={`r-${d.id}`} pathLength={1} className={`${styles.draw} ${styles.route}`} style={s(5 + i)} d={`M${CX} ${CY} H${x.toFixed(1)} V${y.toFixed(1)}`} />
        ))}

        {/* точки и подписи */}
        {pts.map(({ d, x, y }, i) => {
          const right = x >= CX;
          const tx = x + (right ? 14 : -14);
          return (
            <g key={`p-${d.id}`} className={styles.point} style={s(7 + i)}>
              {d.mode === "walk" ? (
                <circle cx={x} cy={y} r="6.5" className={styles.mark} />
              ) : (
                <rect x={x - 6.5} y={y - 6.5} width="13" height="13" className={styles.mark} />
              )}
              <text x={tx} y={y - 2} textAnchor={right ? "start" : "end"} className={styles.label}>{t(`places.${d.labelKey}`)}</text>
              <text x={tx} y={y + 12} textAnchor={right ? "start" : "end"} className={styles.time}>{t("map.min", { minutes: d.minutes })}</text>
            </g>
          );
        })}

        {/* объект */}
        <g className={styles.point} style={s(6)}>
          <circle cx={CX} cy={CY} r="16" className={styles.home} />
          <circle cx={CX} cy={CY} r="4.5" className={styles.homeDot} />
          <text x={CX} y={CY + 36} textAnchor="middle" className={styles.homeText}>{t("map.property")}</text>
        </g>
      </svg>
      <figcaption className={styles.caption}>{t("map.caption")}</figcaption>
    </figure>
  );
}
