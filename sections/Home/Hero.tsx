import { useTranslations } from "next-intl";
import { isTodo, media, siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/Button/Button";
import { HeroBlueprint } from "@/components/HeroBlueprint/HeroBlueprint";
import { LineIcon } from "@/components/LineIcon/LineIcon";
import { PhotoFrame } from "@/components/PhotoFrame/PhotoFrame";
import { Reveal } from "@/components/Reveal/Reveal";
import { Rule } from "@/components/Rule/Rule";
import styles from "./Home.module.css";

/*
 * Композиция как у референса: слева текст, справа медиа-блок (не на весь экран).
 * Телефон: ярлык → видео → заголовок → описание → кнопки → факты.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const c = useTranslations("Cta");
  const f = useTranslations("Frames");
  const city = siteConfig.city;

  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <HeroBlueprint />
      <div className={`container ${styles.heroGrid}`}>
        <p className={styles.heroLabel}>{t("eyebrow", { city })}</p>

        <div className={styles.heroMedia}>
          <PhotoFrame
            ratio="5 / 6"
            ratioMobile="16 / 7"
            label={f("video")}
            video={isTodo(media.townVideo) ? undefined : media.townVideo}
            poster={isTodo(media.townPoster) ? undefined : media.townPoster}
          />
        </div>

        <div className={styles.heroCopy}>
          <Reveal>
            <h1 id="hero-title" className={styles.heroTitle}>{t("title", { city })}</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className={styles.heroLead}>{t("lead")}</p>
          </Reveal>
          <Reveal delay={200}>
            <div className={styles.actions}>
              <Button href={whatsappUrl(c("message"))} size="sm">{c("whatsapp")}</Button>
              <Button href="#apartments" variant="ghost" size="sm">{t("secondary")}</Button>
            </div>
          </Reveal>
        </div>

        <div className={styles.factsWrap} data-hero-facts>
          <Rule />
          <ul className={styles.facts}>
            {(["checkin", "parking", "kitchen", "wifi"] as const).map((k) => (
              <li key={k}>
                <LineIcon name={k} size="sm" />
                <span>{t(`facts.${k}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
