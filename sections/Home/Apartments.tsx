import { useTranslations } from "next-intl";
import { apartmentTypes } from "@/config/property";
import { Reveal } from "@/components/Reveal/Reveal";
import { Val } from "@/components/Placeholder/Placeholder";
import { images } from "@/config/images";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { BackdropGlyphs } from "@/components/BackdropGlyphs/BackdropGlyphs";
import { StayCalculator } from "@/components/StayCalculator/StayCalculator";
import { Rule } from "@/components/Rule/Rule";
import { SectionLabel } from "@/components/SectionLabel/SectionLabel";
import styles from "./Home.module.css";

export function Apartments() {
  const t = useTranslations("Apartments");
  const f = useTranslations("Frames");

  return (
    <section id="apartments" className={`${styles.section}`} aria-labelledby="apt-title">
      <Rule />
      <BackdropGlyphs glyphs="1-4" />
      <div className={`container ${styles.onTop}`}>
        <Reveal className={styles.head}>
          <SectionLabel n="02" text={t("eyebrow")} />
          <h2 id="apt-title" className={styles.title}>{t("title")}</h2>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>

        <Reveal>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">{t("cols.type")}</th>
                    <th scope="col">{t("cols.area")}</th>
                    <th scope="col">{t("cols.guests")}</th>
                    <th scope="col">{t("cols.beds")}</th>
                    <th scope="col">{t("cols.price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {apartmentTypes.map((a) => (
                    <tr key={a.id}>
                      <td>{t("rooms", { count: a.rooms })}</td>
                      <td data-label={t("cols.area")}><Val v={a.area} /> {a.area !== "TODO" && "m²"}</td>
                      <td data-label={t("cols.guests")}><Val v={a.guests} /></td>
                      <td data-label={t("cols.beds")}><Val v={a.beds} /></td>
                      <td data-label={t("cols.price")}><Val v={a.priceFrom} /> {a.priceFrom !== "TODO" && "€"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>{t("pricing")}</p>
          </Reveal>

        <Reveal>
          <StayCalculator />
        </Reveal>

        <div className={styles.gallery}>
          <PhotoFrame ratio="4 / 3" label={f("kitchen")} src={images.kitchen.src} position={images.kitchen.position} sizes="(min-width: 48rem) 30vw, 100vw" />
          <PhotoFrame ratio="4 / 3" label={f("bedroom")} src={images.bedroom.src} position={images.bedroom.position} sizes="(min-width: 48rem) 30vw, 100vw" />
          <PhotoFrame ratio="4 / 3" label={f("bath")} src={images.bath.src} position={images.bath.position} sizes="(min-width: 48rem) 30vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
