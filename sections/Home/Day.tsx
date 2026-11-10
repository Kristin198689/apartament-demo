import { useTranslations } from "next-intl";
import { DayTimeline } from "@/components/DayTimeline/DayTimeline";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

export function Day() {
  const t = useTranslations("Day");
  return (
    <section className={`${styles.section} tone-gray`} aria-labelledby="day-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="05" text={t("eyebrow")} />
          <h2 id="day-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <Reveal>
          <DayTimeline />
        </Reveal>
      </div>
    </section>
  );
}
