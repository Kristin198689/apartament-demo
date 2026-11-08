import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export default async function ImpressumPage({ params }: PageProps<"/[locale]/impressum">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const a = siteConfig.address;

  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {siteConfig.name}<br />
        TODO: Name / Firma, Rechtsform<br />
        {a.street}, {a.zip} {a.city}
      </p>
      <h2>Kontakt</h2>
      <p>Telefon: {siteConfig.phone}<br />E-Mail: {siteConfig.email}</p>
      <h2>Umsatzsteuer-ID</h2>
      <p>TODO: USt-IdNr. gemäß § 27a UStG</p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>TODO: Name und Anschrift</p>
      <p><em>Needs legal review — Platzhalter, kein Rechtstext.</em></p>
    </LegalPage>
  );
}
