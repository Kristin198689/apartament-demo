import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal/Reveal";
import { images } from "@/config/images";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { LineIcon } from "@/components/LineIcon/LineIcon";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

const KEYS = ["checkin", "parking", "kitchen", "wifi", "beds", "balcony"] as const;

export function Amenities() {
  const t = useTranslations("Amenities");
  const f = useTranslations("Frames");
  return (
    <section className={`${styles.section} tone-gray`} aria-labelledby="amen-title">
      <Rule />
      <div className="container">
        <Reveal className={styles.head}>
          <SectionLabel n="01" text={t("eyebrow")} />
          <h2 id="amen-title" className={styles.title}>{t("title")}</h2>
        </Reveal>
        <div className={styles.editorial}>
          <div className={styles.mediaCol}>
            <PhotoFrame ratio="4 / 5" ratioMobile="4 / 3" label={f("entrance")} src={images.entrance.src} position={images.entrance.position} />
          </div>
        <ul className={styles.rows}>
          {KEYS.map((k, i) => (
            <Reveal as="li" key={k} className={`${styles.row} ${styles.ruled}`} delay={i * 50}>
              <LineIcon name={k} />
              <h3 className={styles.rowTitle}>{t(`items.${k}.title`)}</h3>
              <p className={styles.rowText}>{t(`items.${k}.text`)}</p>
            </Reveal>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
