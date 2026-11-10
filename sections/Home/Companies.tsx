import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/whatsapp";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/Button/Button";
import { images } from "@/config/images";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

const KEYS = ["invoice", "groups", "longstay"] as const;

export function Companies() {
  const t = useTranslations("Companies");
  const c = useTranslations("Cta");
  const f = useTranslations("Frames");
  return (
    <section id="companies" className={`${styles.section} tone-ink`} aria-labelledby="co-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="04" text={t("eyebrow")} />
          <h2 id="co-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <div className={`${styles.editorial} ${styles.editorialRev}`}>
        <div>
        <ul className={styles.rows}>
          {KEYS.map((k, i) => (
            <Reveal as="li" key={k} className={`${styles.row} ${styles.ruled}`} delay={i * 50}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.rowTitle}>{t(`items.${k}.title`)}</h3>
              <p className={styles.rowText}>{t(`items.${k}.text`)}</p>
            </Reveal>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button href={whatsappUrl(c("message"))}>{t("cta")}</Button>
          <Link href="/hr" className={styles.hrLink}>{t("hr")} →</Link>
        </div>
        </div>
        <div className={styles.mediaCol}>
          <PhotoFrame ratio="4 / 5" ratioMobile="4 / 3" label={f("team")} src={images.living.src} position={images.living.position} />
        </div>
        </div>
      </div>
    </section>
  );
}
