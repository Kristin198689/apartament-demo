import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { images } from "@/config/images";
import { LineIcon } from "@/components/LineIcon/LineIcon";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import home from "./Home.module.css";
import styles from "./Amenities.module.css";

const KEYS = ["checkin", "parking", "kitchen", "wifi", "beds", "balcony"] as const;

/* «Лист спецификации»: сетка плиток с крупными тонкими иконками; описание проявляется при наведении */
export function Amenities() {
  const t = useTranslations("Amenities");
  const f = useTranslations("Frames");
  return (
    <section className={`${home.section} tone-gray`} aria-labelledby="amen-title">
      <Rule />
      <div className="container">
        <Reveal className={home.head}>
          <SectionLabel n="01" text={t("eyebrow")} />
          <h2 id="amen-title" className={home.title}>{t("title")}</h2>
        </Reveal>

        <div className={styles.bento}>
          <div className={styles.photo}>
            <PhotoFrame ratio="4 / 5" ratioMobile="4 / 3" label={f("entrance")} src={images.entrance.src} position={images.entrance.position} />
          </div>

          <ul className={styles.tiles}>
            {KEYS.map((k, i) => (
              <Reveal as="li" key={k} className={styles.tile} delay={i * 70}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.icon}><LineIcon name={k} size="lg" /></span>
                <div className={styles.body}>
                  <h3 className={styles.name}>{t(`items.${k}.title`)}</h3>
                  <div className={styles.more}>
                    <p>{t(`items.${k}.text`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
