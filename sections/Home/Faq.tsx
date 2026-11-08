import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

const KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export function Faq() {
  const t = useTranslations("Faq");
  return (
    <section id="faq" className={`${styles.section} tone-gray`} aria-labelledby="faq-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="09" text={t("eyebrow")} />
          <h2 id="faq-title" className={styles.title}>{t("title")}</h2>
        </Reveal>
        <div className={styles.faq}>
          {KEYS.map((k, i) => (
            <Reveal as="details" key={k} className={styles.ruled} delay={i * 60}>
              <summary>{t(`items.${k}.q`)}</summary>
              <p>{t(`items.${k}.a`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
