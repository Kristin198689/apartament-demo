import { useTranslations } from "next-intl";
import { ElevationDrawing } from "@/components/ElevationDrawing/ElevationDrawing";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import { planDemo } from "@/config/property";
import styles from "./Home.module.css";

/* Серединный чертёж: фасад дома. Отличается от плана квартиры в hero и в секции планировки. */
export function Hook() {
  const t = useTranslations("Hook");
  return (
    <section className={`${styles.section} tone-gray`} aria-labelledby="hook-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="06" text={t("eyebrow")} />
          <h2 id="hook-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <ElevationDrawing label={t("caption")} width={planDemo.facadeWidth} />
      </div>
    </section>
  );
}
