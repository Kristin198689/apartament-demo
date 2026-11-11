import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { developer, siteConfig } from "@/config/site";
import { Rule } from "@/components/Rule/Rule";
import { BackToTop } from "@/components/BackToTop/BackToTop";
import { Wordmark } from "@/components/Wordmark/Wordmark";
import { CookieSettingsLink } from "@/components/CookieConsent/CookieConsent";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const c = useTranslations("Consent");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Rule />
      <div className="container">
        <Wordmark text={siteConfig.name} />

        <div className={styles.linksRow}>
          <ul className={styles.links}>
            <li><Link href="/impressum">{t("impressum")}</Link></li>
            <li><Link href="/datenschutz">{t("privacy")}</Link></li>
            <li><CookieSettingsLink label={c("settings")} /></li>
          </ul>
          <BackToTop label={t("top")} />
        </div>

        <div className={styles.legal}>
          <p>© {year} {siteConfig.name}. {t("rights")}</p>
          <div className={styles.second}>
            <Rule />
            <p>
              {t("developedBy")}{" "}
              <a href={developer.url} target="_blank" rel="noopener noreferrer">{developer.name}</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
