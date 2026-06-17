import LegalPageLayout from '../components/LegalPageLayout.jsx';

export default function Datenschutz() {
  return (
    <LegalPageLayout title="Datenschutzerklärung">
      <h2>Verantwortlicher</h2>
      <p>
        Rheinische Hochschule Köln<br />
        Vogelsanger Straße 295, 50825 Köln<br />
        E-Mail: info@rh-koeln.de
      </p>

      <h2>Erhobene Daten</h2>
      <ul>
        <li>Server-Logs (IP-Adresse, Zeitpunkt, aufgerufene Seite) zur Sicherstellung des Betriebs</li>
        <li>Funktionale Cookies (z. B. Theme-Einstellung) und ggf. Statistik-Cookies, abhängig von deiner Auswahl im Cookie-Banner</li>
        <li>Bei Login: Konto- und Authentifizierungsdaten über das Auth-Modul</li>
      </ul>

      <h2>Zweck der Verarbeitung</h2>
      <p>
        Die Daten werden ausschließlich zur Bereitstellung und Absicherung der Plattform sowie zur
        Verbesserung der Nutzererfahrung verarbeitet.
      </p>

      <h2>Rechtsgrundlage</h2>
      <p>
        Art. 6 Abs. 1 lit. b und f DSGVO (Vertragserfüllung bzw. berechtigtes Interesse am sicheren
        Betrieb), bei Cookies Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
      </p>

      <h2>Speicherdauer</h2>
      <p>
        Server-Logs werden nach 30 Tagen automatisch gelöscht. Cookie-Einstellungen bleiben bis zum
        Widerruf oder Löschen der Browserdaten gespeichert.
      </p>

      <h2>Cookies</h2>
      <p>
        Notwendige Cookies sind für den Betrieb der Plattform erforderlich und können nicht
        deaktiviert werden. Funktionale und Statistik-Cookies werden nur mit deiner Einwilligung
        gesetzt. Du kannst deine Auswahl jederzeit über den Cookie-Banner ändern. Aktuell nutzt die
        Plattform kein externes Tracking — die Kategorien sind vorbereitet, aber funktional ohne
        Auswirkung.
      </p>

      <h2>Deine Rechte</h2>
      <ul>
        <li>Auskunft über die zu deiner Person gespeicherten Daten</li>
        <li>Berichtigung unrichtiger Daten</li>
        <li>Löschung deiner Daten, soweit keine gesetzliche Pflicht entgegensteht</li>
        <li>Widerspruch gegen die Verarbeitung auf Basis berechtigten Interesses</li>
      </ul>
      <p>Anfragen richtest du an die oben genannte Kontakt-E-Mail.</p>

      <div className="legal-note">
        Hinweis: Diese Datenschutzerklärung enthält generische Platzhalterangaben für ein
        Hackathon-Projekt und ersetzt keine rechtsverbindliche Datenschutzprüfung.
      </div>
    </LegalPageLayout>
  );
}
