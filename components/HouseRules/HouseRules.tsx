import { useTranslations } from "next-intl";
import styles from "./HouseRules.module.css";

const KEYS = ["r1", "r2", "r3", "r4"] as const;
const ICON: Record<(typeof KEYS)[number], string> = {
  r1: "M30 8 A16 16 0 1 0 40 30 A12 12 0 0 1 30 8 Z", // луна
  r2: "M10 38 L26 10 M26 10 L38 38 M14 30 H34", // метёлка/уборка
  r3: "M16 24 a8 8 0 1 1 16 0 a8 8 0 1 1 -16 0 M24 32 V42 M24 36 H30 M24 40 H28", // код/ключ
  r4: "M10 40 V8 H30 V40 M10 40 H38 M26 24 h2", // дверь
};

export function HouseRules() {
  const t = useTranslations("Rules");
  return (
    <section className={styles.wrap} aria-label={t("title")}>
      <h3 className={styles.title}>{t("title")}</h3>
      <ul className={styles.grid}>
        {KEYS.map((k) => (
          <li key={k} className={styles.item}>
            <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d={ICON[k]} pathLength={1} className={styles.draw} /></svg>
            <h4 className={styles.t}>{t(`${k}.t`)}</h4>
            <p className={styles.d}>{t(`${k}.d`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
