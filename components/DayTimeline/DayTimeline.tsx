import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { LineIcon, type IconName } from "@/components/LineIcon/LineIcon";
import styles from "./DayTimeline.module.css";

const STOPS: { key: string; icon: IconName }[] = [
  { key: "s1", icon: "checkin" },
  { key: "s2", icon: "kitchen" },
  { key: "s3", icon: "wifi" },
  { key: "s4", icon: "beds" },
  { key: "s5", icon: "parking" },
];

/* Горизонтальная линия времени: от приезда до выезда. Линия прочерчивается, точки появляются по очереди. */
export function DayTimeline() {
  const t = useTranslations("Day");
  return (
    <ol className={styles.line}>
      {STOPS.map((s, i) => (
        <li key={s.key} className={styles.stop} style={{ "--i": i } as CSSProperties}>
          <span className={styles.icon}><LineIcon name={s.icon} size="sm" /></span>
          <span className={styles.node} aria-hidden="true" />
          <h3 className={styles.title}>{t(`stops.${s.key}.t`)}</h3>
          <p className={styles.text}>{t(`stops.${s.key}.d`)}</p>
        </li>
      ))}
    </ol>
  );
}
