import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./BackdropGlyphs.module.css";

type Kind = "1-4" | "10" | "pin" | "q";

const s = (i: number) => ({ "--i": i }) as CSSProperties;

const ONE = "M60 0 H130 V360 H60 V95 L0 125 V55 Z";
const DASH = "M0 160 H150 V210 H0 Z";
const FOUR = "M150 0 L0 250 V320 H150 V360 H230 V320 H260 V250 H230 V0 Z M150 90 V250 H55 Z";
const ZERO = "M0 120 A120 120 0 0 1 240 120 V240 A120 120 0 0 1 0 240 Z M70 120 A50 50 0 0 1 170 120 V240 A50 50 0 0 1 70 240 Z";
// метка на карте: капля с кружком внутри
const PIN = "M120 0 A120 120 0 0 1 240 120 C240 200 160 260 120 360 C80 260 0 200 0 120 A120 120 0 0 1 120 0 Z M165 120 A45 45 0 1 0 75 120 A45 45 0 1 0 165 120 Z";

// вопросительный знак: дуга, изгиб, ножка и точка (блочный, как наши «4» и «7»)
const QMARK = "M10 120 A110 110 0 0 1 230 120 V150 L170 205 V250 H100 V190 L160 130 V120 A40 40 0 0 0 80 120 H10 Z M100 290 H170 V360 H100 Z";

const SETS: Record<Kind, { box: string; items: { d: string; x: number }[] }> = {
  "1-4": { box: "-10 -10 620 380", items: [{ d: ONE, x: 0 }, { d: DASH, x: 160 }, { d: FOUR, x: 340 }] },
  "10": { box: "-10 -10 420 380", items: [{ d: ONE, x: 0 }, { d: ZERO, x: 160 }] },
  q: { box: "-10 -10 260 380", items: [{ d: QMARK, x: 0 }] },
  pin: { box: "-10 -10 260 380", items: [{ d: PIN, x: 0 }] },
};

/*
 * Огромные цифры или знак, вычерченные тонкими линиями, как «24/7» и «404», но фоном:
 * бледно, справа, за содержимым секции. Начинают рисоваться при появлении в окне.
 * Родитель — position: relative.
 */
export function BackdropGlyphs({ glyphs, place = "top" }: { glyphs: Kind; place?: "top" | "center" | "left" }) {
  const set = SETS[glyphs];
  return (
    <Reveal className={`${styles.back} ${place === "center" ? styles.center : place === "left" ? styles.left : ""}`}>
      <svg className={styles.svg} viewBox={set.box} aria-hidden="true" focusable="false">
        {set.items.map((it, i) => (
          <g key={i} transform={`translate(${it.x} 0)`}>
            <path pathLength={1} className={styles.outline} style={s(i)} d={it.d} fillRule="evenodd" />
          </g>
        ))}
      </svg>
    </Reveal>
  );
}
