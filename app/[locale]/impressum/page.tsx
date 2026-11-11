import { setRequestLocale } from "next-intl/server";
import { developer, siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export default async function ImpressumPage({ params }: PageProps<"/[locale]/impressum">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Impressum"
      notice="Dies ist eine Demo-Website (Konzeptprojekt). Es gibt kein reales Angebot, keine Buchung und keinen Vertragsschluss. Alle Inhalte dienen ausschließlich der Demonstration."
    >
      <h2>Betreiber der Demo</h2>
      <p>
        {developer.name}
        <br />
        TODO: Name, Anschrift und Kontaktdaten des Betreibers gemäß § 5 DDG ergänzen
      </p>
      <h2>Zweck der Seite</h2>
      <p>
        „{siteConfig.name}“ ist ein Entwurf, der Design und Funktionen einer Website für möblierte
        Apartments zeigt. Es steht kein Unternehmen, keine Unterkunft und kein Kunde dahinter.
      </p>
      <h2>Platzhalterinhalte</h2>
      <p>
        Ortsangaben (zum Beispiel „{siteConfig.city}“), Entfernungen, Flächen, Grundrisse, Preise, Bewertungen,
        Fotos und Texte sind fiktive Platzhalter. Kontaktwege wie WhatsApp, E-Mail und Telefon sind nicht aktiv.
        Verlinkungen zu Google Maps und Bewertungen führen auf eine Demo-Fehlerseite.
      </p>
      <h2>Haftung für Inhalte</h2>
      <p>
        Die Inhalte wurden nicht als verbindliche Information erstellt. Für die Richtigkeit, Vollständigkeit
        und Aktualität übernehmen wir keine Gewähr; Ansprüche daraus sind ausgeschlossen.
      </p>
      <p><em>Platzhalter für die Demo, kein Rechtstext. Needs legal review.</em></p>
    </LegalPage>
  );
}
