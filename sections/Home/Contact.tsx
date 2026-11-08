import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal/Reveal";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

export function Contact() {
  const t = useTranslations("Contact");
  return (
    <section id="contact" className={`${styles.section} ${styles.compact} tone-ink`} aria-labelledby="contact-title">
      <Rule />
      <div className={`container ${styles.contact}`}>
        <Reveal className={styles.head}>
          <SectionLabel n="10" text={t("eyebrow")} />
          <h2 id="contact-title" className={`${styles.title} ${styles.titleSm}`}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
