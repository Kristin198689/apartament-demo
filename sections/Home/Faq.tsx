import { useTranslations } from "next-intl";
import { BackdropGlyphs } from "@/components/BackdropGlyphs/BackdropGlyphs";
import { FaqSearch } from "@/components/FaqSearch/FaqSearch";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

export function Faq() {
  const t = useTranslations("Faq");
  return (
    <section id="faq" className={`${styles.section} tone-gray`} aria-labelledby="faq-title">
      <Rule />
      <BackdropGlyphs glyphs="q" place="left" />
      <div className={`container ${styles.onTop}`}>
        <Reveal className={styles.head}>
          <SectionLabel n="10" text={t("eyebrow")} />
          <h2 id="faq-title" className={styles.title}>{t("title")}</h2>
        </Reveal>
        <FaqSearch />
      </div>
    </section>
  );
}
