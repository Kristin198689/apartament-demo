import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { FloorPlan } from "@/components/FloorPlan/FloorPlan";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import { planDemo } from "@/config/property";
import styles from "./Home.module.css";

export function PlanSection() {
  const t = useTranslations("PlanSection");
  const p = useTranslations("Plan");
  const a = useTranslations("Apartments");

  return (
    <section className={`${styles.section} tone-gray`} aria-labelledby="plan-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="03" text={t("eyebrow")} />
          <h2 id="plan-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <figure className={styles.planBox}>
          <FloorPlan
            demo={{
              typeValue: a("rooms", { count: planDemo.rooms }),
              area: planDemo.area,
              width: planDemo.width,
              depth: planDemo.depth,
              living: planDemo.living,
              bedroom: planDemo.bedroom,
              bath: planDemo.bath,
            }}
            labels={{
              living: p("living"), bedroom: p("bedroom"), bath: p("bath"),
              balcony: p("balcony"), entrance: p("entrance"),
              type: p("type"), area: p("area"), caption: p("caption"),
            }}
          />
          <figcaption className={styles.planNote}>{p("note")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
