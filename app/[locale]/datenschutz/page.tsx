import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export default async function DatenschutzPage({ params }: PageProps<"/[locale]/datenschutz">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>TODO: Name, Anschrift, Kontakt (siehe Impressum).</p>
      <h2>2. Hosting</h2>
      <p>TODO: Hosting-Anbieter und Serverstandort eintragen.</p>
      <h2>3. Kontaktaufnahme über WhatsApp</h2>
      <p>
        Das Kontaktformular speichert keine Daten auf unserem Server. Nach dem Absenden
        öffnet sich WhatsApp mit einer vorbereiteten Nachricht; die Übermittlung erfolgt
        erst, wenn Sie die Nachricht in WhatsApp selbst senden. TODO: Rechtsgrundlage
        (Art. 6 Abs. 1 lit. b/f DSGVO) und Hinweise zu WhatsApp prüfen.
      </p>
      <h2>4. Cookies</h2>
      <p>TODO: Aktuell werden keine Tracking-Cookies eingesetzt. Bei Änderung Einwilligung ergänzen.</p>
      <h2>5. Schriftarten</h2>
      <p>
        Die verwendeten Schriftarten (Jost, Inter Tight; Lizenz: SIL Open Font License) werden beim Build
        heruntergeladen und von unserem eigenen Server ausgeliefert. Beim Aufruf der Seite findet keine
        Verbindung zu Servern von Google statt. TODO: bei Livegang gegenprüfen.
      </p>
      <h2>6. Ihre Rechte</h2>
      <p>Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit und Beschwerde bei einer Aufsichtsbehörde.</p>
      <p><em>Needs legal review — Platzhalter, kein Rechtstext.</em></p>
    </LegalPage>
  );
}
