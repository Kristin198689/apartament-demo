import { useTranslations } from "next-intl";
import { googleReviewsUrl } from "@/config/site";
import { Button } from "@/components/Button/Button";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

/* Отзывы на сайте не показываем: только переход на Google. */
export function Reviews() {
  const t = useTranslations("Reviews");
  return (
    <section className={styles.section} aria-labelledby="rev-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="08" text={t("eyebrow")} />
          <h2 id="rev-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <div className={`${styles.actions} ${styles.actionsFlush}`}>
          <Button href={googleReviewsUrl()}>{t("googleCta")}</Button>
        </div>
      </div>
    </section>
  );
}
