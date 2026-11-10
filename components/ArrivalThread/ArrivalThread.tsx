import { useTranslations } from "next-intl";
import styles from "./ArrivalThread.module.css";

const KEYS = ["t1", "t2", "t3", "t4"] as const;

/* Нить пути гостя: линия «прочерчивается» от запроса до двери, на каждой точке вспыхивает узел. */
export function ArrivalThread() {
  const t = useTranslations("Steps.thread");
  return (
    <ol className={styles.thread}>
      {KEYS.map((k, i) => (
        <li key={k} className={styles.node} style={{ "--i": i } as React.CSSProperties}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.name}>{t(k)}</span>
        </li>
      ))}
    </ol>
  );
}
