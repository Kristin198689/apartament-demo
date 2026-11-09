import { useTranslations } from "next-intl";
import { mapsUrl, siteConfig } from "@/config/site";
import { CountUp } from "@/components/CountUp/CountUp";
import { Button } from "@/components/Button/Button";
import { distances } from "@/config/property";
import { images } from "@/config/images";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

export function Location() {
  const t = useTranslations("Location");
  const f = useTranslations("Frames");
  return (
    <section id="location" className={`${styles.section}`} aria-labelledby="loc-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="05" text={t("eyebrow")} />
          <h2 id="loc-title" className={styles.title}>{t("title", { city: siteConfig.city })}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>
        <div className={styles.locGrid}>
        <div>
        <ul className={styles.dist}>
          {distances.map((d, i) => (
            <Reveal as="li" key={d.id} className={styles.ruled} delay={i * 60}>
              <span>{d.labelKey ? t(`places.${d.labelKey}`) : d.name}</span>
              <span className={styles.bar} style={{ "--pct": Math.min(d.minutes / 60, 1) } as React.CSSProperties} aria-hidden="true" />
              <strong>{t.rich(`mode.${d.mode}`, { minutes: d.minutes, m: () => <CountUp value={d.minutes} /> })}</strong>
            </Reveal>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button href={mapsUrl()} variant="ghost">{t("mapsCta")}</Button>
        </div>
        </div>
        <div className={styles.locMedia}>
          <PhotoFrame ratio="2 / 1" ratioMobile="4 / 3" label={f("exterior")} src={images.exterior.src} position="50% 66%" sizes="(min-width: 80rem) 1184px, 100vw" />
        </div>
        </div>
      </div>
    </section>
  );
}
