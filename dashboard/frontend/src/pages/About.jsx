import LegalPageLayout from '../components/LegalPageLayout.jsx';
import teamPhoto from '../assets/hackathon_team.jpeg';

export default function About() {
  return (
    <LegalPageLayout title="Über dieses Projekt">
      <h2>Entstanden beim TechRiders Summit Hackathon 2026</h2>
      <p>
        CPP ist im Rahmen des{' '}
        <a href="https://tech-riders.de/hackathon/" target="_blank" rel="noopener noreferrer">
          TechRiders Summit 2026
        </a>{' '}
        entstanden, der am 17. und 18. Juni 2026 auf dem Euronova Campus in Hürth bei Köln
        stattfand. Im Rahmen des Vibe-Coding-Hackathons gab es am 16. Juni ein Kickoff an der
        Rheinischen Hochschule Köln — dort lernten sich die Teams kennen und erhielten den
        gemeinsamen Use Case, an dem ab dem 17. Juni in Teams gearbeitet wurde.
      </p>

      <figure className="about-team-figure">
        <img src={teamPhoto} alt="Unser Team beim TechRiders Summit Hackathon 2026" />
        <figcaption>Unser Team beim Hackathon-Kickoff — von der Idee bis zum Pitch in zwei Tagen.</figcaption>
      </figure>

      <h2>Der Use Case</h2>
      <p>
        Unsere Aufgabe: eine Plattform zu entwerfen, die mehrere unabhängig entwickelte Module
        (Kommunikation, Dateimanagement, Projektplanung, Userverwaltung, Authentifizierung) unter
        einer gemeinsamen Oberfläche und einem zentralen Login zusammenführt — inklusive Live-Status-
        Monitoring und der Möglichkeit, neue Module direkt über ein Admin-Dashboard anzubinden.
      </p>

      <h2>Der Pitch</h2>
      <p>
        Höhepunkt des Hackathons war die Abschlusspräsentation auf der TechRiders-Bühne: Jedes Team
        hatte 15 Minuten, um seine Lösung samt Entwicklungsprozess vor Publikum zu pitchen.
      </p>

      <h2>Status</h2>
      <p>
        Diese Plattform ist ein Hackathon-Prototyp. Inhalte wie Impressum und Datenschutzerklärung
        sind bewusst als Platzhalter gekennzeichnet, da das Projekt nicht im produktiven Betrieb der
        Rheinischen Hochschule Köln läuft.
      </p>

      <div className="legal-note">
        Mehr Infos zum Hackathon-Format unter{' '}
        <a href="https://tech-riders.de/hackathon/" target="_blank" rel="noopener noreferrer">
          tech-riders.de/hackathon
        </a>
        .
      </div>
    </LegalPageLayout>
  );
}
