import type { CSSProperties } from "react";
import styles from "./Drawn247.module.css";

const s = (i: number) => ({ "--i": i }) as CSSProperties;

/*
 * Огромное «24/7», вычерченное тонкими линиями, как цифры «404». Начинает рисоваться,
 * когда блок появляется в окне (родитель Reveal выставляет data-visible="true").
 * Это зрительный якорь для обещания «заселение без ожидания, круглосуточно».
 */
export function Drawn247({ label = "24/7" }: { label?: string }) {
  const two = "M0 120 A110 110 0 0 1 220 120 V175 L82 290 H240 V360 H0 V290 L140 185 V120 A35 35 0 0 0 70 120 Z";
  const four = "M150 0 L0 250 V320 H150 V360 H230 V320 H260 V250 H230 V0 Z M150 90 V250 H55 Z";
  const slash = "M130 0 H210 L80 360 H0 Z";
  const seven = "M0 0 H240 V70 L105 360 H15 L150 75 H0 Z";
  const dim = (w: number) => `M0 410 H${w} M0 402 V418 M${w} 402 V418`;
  const bubble = (cx: number) => `M${cx - 12} -26 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M${cx} -14 V-2`;

  return (
    <svg className={styles.svg} viewBox="0 -44 1000 480" role="img" aria-label={label} focusable="false">
      <path pathLength={1} className={styles.thin} style={s(0)} d="M0 360 H1000" />

      <g transform="translate(0 0)">
        <path pathLength={1} className={styles.outline} style={s(1)} d={two} fillRule="evenodd" />
        <path pathLength={1} className={styles.thin} style={s(5)} d={`${bubble(120)} ${dim(240)}`} />
      </g>
      <g transform="translate(255 0)">
        <path pathLength={1} className={styles.outline} style={s(2)} d={four} fillRule="evenodd" />
        <path pathLength={1} className={styles.thin} style={s(6)} d={`${bubble(130)} ${dim(260)}`} />
      </g>
      <g transform="translate(530 0)">
        <path pathLength={1} className={styles.outline} style={s(3)} d={slash} fillRule="evenodd" />
        <path pathLength={1} className={styles.thin} style={s(7)} d={dim(210)} />
      </g>
      <g transform="translate(760 0)">
        <path pathLength={1} className={styles.outline} style={s(4)} d={seven} fillRule="evenodd" />
        <path pathLength={1} className={styles.thin} style={s(8)} d={`${bubble(120)} ${dim(240)}`} />
      </g>
    </svg>
  );
}
