import { useTranslations } from "next-intl";
import { CountUp } from "@/components/CountUp/CountUp";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

const KEYS = ["s1", "s2", "s3"] as const;

export function Steps() {
  const t = useTranslations("Steps");
  return (
    <section className={`${styles.section} ${styles.compact} tone-gray`} aria-labelledby="steps-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="07" text={t("eyebrow")} />
          <h2 id="steps-title" className={`${styles.title} ${styles.titleSm}`}>{t("title")}</h2>
        </Reveal>
        <ol className={styles.steps}>
          {KEYS.map((k, i) => (
            <Reveal as="li" key={k} className={`${styles.step} ${styles.ruled}`} delay={i * 80}>
              <span className={styles.stepNum}><CountUp value={i + 1} pad={2} /></span>
              <h3 className={styles.rowTitle}>{t(`items.${k}.title`)}</h3>
              <p className={styles.rowText}>{t(`items.${k}.text`)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
