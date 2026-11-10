import { useTranslations } from "next-intl";
import { PlanCompare } from "@/components/PlanCompare/PlanCompare";
import { InteractivePlan } from "@/components/InteractivePlan/InteractivePlan";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

export function PlanSection() {
  const t = useTranslations("PlanSection");
  const p = useTranslations("Plan");

  return (
    <section className={`${styles.section} tone-gray`} aria-labelledby="plan-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="03" text={t("eyebrow")} />
          <h2 id="plan-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <Reveal>
          <InteractivePlan />
          <p className={styles.planNote}>{p("note")}</p>
        </Reveal>
        <Reveal>
          <PlanCompare />
        </Reveal>
      </div>
    </section>
  );
}
