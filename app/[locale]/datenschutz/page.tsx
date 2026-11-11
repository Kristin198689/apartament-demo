import { setRequestLocale } from "next-intl/server";
import { developer, siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export default async function DatenschutzPage({ params }: PageProps<"/[locale]/datenschutz">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Datenschutzerklärung"
      notice="Dies ist eine Demo-Website. Es werden keine Formulardaten gesendet oder gespeichert, und es funktioniert nichts außer der Darstellung. Alles dient nur der Demonstration."
    >
      <h2>1. Kurzfassung</h2>
      <p>
        {siteConfig.name} ist ein Konzeptprojekt von {developer.name}. Die Seite erhebt keine
        personenbezogenen Daten für eigene Zwecke, setzt keine Tracking-Cookies, nutzt keine Analyse- oder
        Werbedienste und sendet keine Eingaben an einen Server.
      </p>
      <h2>2. Verantwortlicher</h2>
      <p>{developer.name}. TODO: Anschrift und Kontakt, siehe Impressum.</p>
      <h2>3. Hosting</h2>
      <p>
        Die Seite wird bei Vercel gehostet. Beim Aufruf verarbeitet der Hosting-Anbieter technisch notwendige
        Verbindungsdaten (zum Beispiel IP-Adresse, Zeitpunkt, aufgerufene Seite) in Server-Logs, um die Seite
        auszuliefern und sicher zu betreiben (Art. 6 Abs. 1 lit. f DSGVO). TODO: Hinweis zu
        Drittlandübermittlung und Auftragsverarbeitung prüfen.
      </p>
      <h2>4. Formulare und Kontakt</h2>
      <p>
        Das Kontaktformular und die Rechner (Aufenthaltsdauer, Team-Planung) funktionieren nur im Browser.
        In dieser Demo wird nichts übermittelt, weil keine WhatsApp-Nummer hinterlegt ist. Eingaben
        verlassen Ihr Gerät nicht.
      </p>
      <h2>5. Lokaler Speicher</h2>
      <p>
        Im lokalen Speicher Ihres Browsers liegen nur Einstellungen, zum Beispiel Darstellung (Blueprint-Modus),
        Fadenkreuz, Bleistift-Modus, Cookie-Auswahl sowie zuletzt gewählte Reisedaten und Rechnerwerte. Diese
        Angaben verlassen Ihr Gerät nicht und lassen sich in den Browser-Einstellungen löschen.
      </p>
      <h2>6. Schriftarten und externe Inhalte</h2>
      <p>
        Die Schriftarten (Jost, Inter Tight; SIL Open Font License) werden vom eigenen Server ausgeliefert, es
        gibt keine Verbindung zu Google Fonts. Karten werden nicht eingebunden; Links zu Google führen in
        dieser Demo auf eine Fehlerseite.
      </p>
      <h2>7. Ihre Rechte</h2>
      <p>
        Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit sowie Beschwerde bei
        einer Aufsichtsbehörde (Art. 15 bis 21, 77 DSGVO).
      </p>
      <p><em>Platzhalter für die Demo, kein Rechtstext. Needs legal review.</em></p>
    </LegalPage>
  );
}
