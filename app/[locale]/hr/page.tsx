import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { apartmentTypes } from "@/config/property";
import { Button } from "@/components/Button/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { HrPlanner } from "@/components/HrPlanner/HrPlanner";
import { PrintButton } from "@/components/PrintButton/PrintButton";
import styles from "./hr.module.css";

const KEYS = ["i1", "i2", "i3", "i4", "i5", "i6"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/hr">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HR" });
  return { title: t("title"), description: t("lead"), alternates: localeAlternates("/hr", locale as Locale) };
}

export default async function HrPage({ params }: PageProps<"/[locale]/hr">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HR");
  const a = await getTranslations("Apartments");
  const c = await getTranslations("Cta");
  const cr = await getTranslations("Crumb");
  const p = await getTranslations("Print");

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs label={cr("label")} locale={locale} items={[{ label: cr("home"), href: "/" }, { label: t("eyebrow") }]} />
      <header className={styles.head}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.lead}>{t("lead")}</p>
        <div className={`${styles.actions} no-print`}>
          <PrintButton label={t("print")} />
          <Button href={whatsappUrl(c("message"))} variant="ghost">{t("cta")}</Button>
          <a href={`/pdf/hr-${locale}.pdf`} download className={styles.pdf}>{t("pdf")}</a>
        </div>
      </header>

      <HrPlanner />

      <ol className={styles.list}>
        {KEYS.map((k, i) => (
          <li key={k} className={styles.item}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <h2 className={styles.itemTitle}>{t(`items.${k}.title`)}</h2>
            <p className={styles.itemText}>{t(`items.${k}.text`)}</p>
          </li>
        ))}
      </ol>

      <h2 className={styles.tTitle}>{t("typesTitle")}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{a("cols.type")}</th>
            <th>{a("cols.area")}</th>
            <th>{a("cols.guests")}</th>
            <th>{a("cols.beds")}</th>
          </tr>
        </thead>
        <tbody>
          {apartmentTypes.map((x) => (
            <tr key={x.id}>
              <td>{a("rooms", { count: x.rooms })}</td>
              <td>{x.area} m²</td>
              <td>{x.guests}</td>
              <td>{x.beds}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>{p("draft")}</p>
      <p className="no-print"><Link href="/" className={styles.back}>← {t("back")}</Link></p>
    </div>
  );
}
