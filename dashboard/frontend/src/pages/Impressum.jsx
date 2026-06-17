import LegalPageLayout from '../components/LegalPageLayout.jsx';

export default function Impressum() {
  return (
    <LegalPageLayout title="Impressum">
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        Rheinische Hochschule Köln<br />
        Vogelsanger Straße 295<br />
        50825 Köln<br />
        Deutschland
      </p>

      <h2>Vertreten durch</h2>
      <p>Platzhalter-Name, Platzhalter-Funktion</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: +49 221 20302-0<br />
        Telefax: +49 221 20302-6100<br />
        E-Mail: info@rh-koeln.de
      </p>

      <h2>Projektkontext</h2>
      <p>
        Diese Plattform ("CPP — Collaboration &amp; Planning Platform") ist im Rahmen des{' '}
        <a href="https://tech-riders.de/hackathon/" target="_blank" rel="noopener noreferrer">
          TechRiders Summit Hackathons 2026
        </a>{' '}
        an der Rheinischen Hochschule Köln entstanden. Mehr dazu auf der{' '}
        <a href="/about">Über-uns-Seite</a>.
      </p>

      <h2>Haftungsausschluss</h2>
      <p>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
        externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber
        verantwortlich.
      </p>

      <div className="legal-note">
        Hinweis: Dieses Impressum enthält Platzhalterangaben für ein Hackathon-Projekt und ersetzt
        keine rechtsgültige Anbieterkennzeichnung.
      </div>
    </LegalPageLayout>
  );
}
