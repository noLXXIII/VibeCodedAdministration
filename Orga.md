# Orga.md — Admin & Orga (Team 3)

Team 3 (Mike, Joshua, Noah) ist die Klebstoff-Schicht zwischen den 5 Hackathon-Teams, die gemeinsam die **Collaboration & Planning Platform (CPP)** bauen. Wir bauen kein eigenes Feature-Modul, sondern Modulmanagement, Schnittstellen-Contracts und das Gateway/Deployment, das alles zusammenhält.

## Teamübersicht

| Gruppe | Mitglieder | Zuständigkeit |
|---|---|---|
| 1 | David, Julian, Stephanie | Kommunikation (PM, Chat, Forum, Human-AI-Human, Wiki) |
| 2 | René, Fabian, Mika, Andres | Dateimanagement (+Versionierung), Userverwaltung (Abstimmung mit Gruppe 5) |
| **3 (wir)** | Mike, Joshua, Noah | **Admin & Orga** (Modulmanagement, Schnittstellen) |
| 4 | Aljan, Noorseiit, Robin | Projektplanung & Tracking (Kanban, Kalender, Zuständigkeiten, Terminexport, Tickets?) |
| 5 | Malte, Alexander, Samuel | Userverwaltung (Rechte, Accountverwaltung, Gruppenverwaltung) |

## Architekturentscheidung

**Microservices über REST/JSON.** Jedes Team baut sein Modul als eigenständigen Service mit eigener API. Tech-Stack ist pro Team frei wählbar (Python/Node/whatever sich am besten vibe-coden lässt) — verbindlich ist nur der **API-Contract**.

Unser Team baut das **API-Gateway/Reverse-Proxy**, das alle Module zusammenbindet und nach außen unter einer Domain erreichbar macht.

Empfehlung: **Traefik** als Gateway. Begründung: Service-Discovery läuft über Docker-Labels statt manueller Config-Dateien — bei 5 unabhängig vibe-codenden Teams in 8h ist das entscheidend, weil neue Services ohne Gateway-Redeploy automatisch erkannt werden.

## Repo-Struktur

**1 Repo pro Team + dieses Repo als Orchestrator.**

| Repo | Inhalt | Health-Check | Port-Konvention |
|---|---|---|---|
| `VibeCodedAdministration` (dieses Repo) | docker-compose, Traefik-Config, API-Contracts, Deploy-Skripte | – | Gateway: 80/443 |
| Team-1-Repo (Kommunikation) | Chat/Forum/Wiki-Service | `GET /health` | 8001 |
| Team-2-Repo (Dateimanagement) | File-Storage/Versionierung-Service | `GET /health` | 8002 |
| Team-4-Repo (Projektplanung) | Kanban/Kalender-Service | `GET /health` | 8004 |
| Team-5-Repo (Userverwaltung) | Auth/Account-Service | `GET /health` | 8005 |

Das Orchestrator-Repo bindet die Team-Repos entweder als **Git Submodules** oder lädt sie als Build-Kontext in `docker-compose.yml` ein (pro Team ein Service-Eintrag). Jedes Team pusht eigenständig in sein Repo; wir aktualisieren nur die Submodule-Referenz/Compose-Konfiguration.

## API-Contract-Konvention

Jedes Modul MUSS bereitstellen:

1. `GET /health` → `200 OK` (Voraussetzung für Monitoring/Self-Healing)
2. `GET /openapi.json` (oder mindestens eine kurze `API.md` im eigenen Repo mit Endpunkten, Request/Response-Beispielen)
3. JSON über REST als Datenformat
4. Auth via gemeinsamem **JWT** — Token-Format wird im 11-Uhr-Meeting mit allen Teams fixiert (Verantwortung: Gruppe 5 liefert Issuer/Validierung, wir dokumentieren den Vertrag hier sobald final)

## User-Management-Schnittstelle

Gruppe 5 liefert Auth/Accounts/Rechte, Gruppe 2 stimmt sich dort für Dateirechte ab. Wir definieren und dokumentieren das gemeinsame JWT/Session-Format als verbindlichen Vertrag zwischen allen Modulen, sobald es im 11-Uhr-Meeting steht.

## Deployment-Plan

- Server: Ubuntu 24.04, `hackathon.rh-koeln.de` (Backend-Port 8443), Zugangsdaten morgen früh
- `docker-compose.yml` im Orchestrator-Repo: ein Service pro Team + Traefik-Gateway
- Routing über Traefik-Labels, z. B. `hackathon.rh-koeln.de/chat`, `/files`, `/planning`, `/users`
- Bis Zugangsdaten vorliegen: Compose-File mit Platzhaltern vorbereiten, lokal gegen alle Module testen

## Zeitplan morgen (17.06., 9:00–18:00 Uhr, reines Vibe-Coding)

| Zeit | Aktivität |
|---|---|
| 9:00–9:30 | Sync aller Teams: API-Contracts final fixieren |
| 9:30–13:00 | Paralleles Vibe-Coding pro Team |
| 13:00 | Zwischen-Sync: erste Integration gegen Gateway testen |
| 13:00–17:00 | Weiter-Coding + Bugfixing an Schnittstellen |
| 17:00–18:00 | Gemeinsamer Integrationstest & Deploy auf den Hackathon-Server |

## Meeting-Agenda-Vorschlag (heute)

Die genaue Agenda der beiden Meetings war uns nicht im Detail bekannt — Vorschlag zur Strukturierung:

- **11:00 Uhr** — Jedes Team bringt seine geplanten Endpunkte & Datenmodelle mit. Wir konsolidieren daraus ein gemeinsames API-Contract-Dokument (Ergänzung dieser Datei oder separates `API-Contracts.md`).
- **13:00 Uhr** — Jedes Team zeigt aktuellen Planungsstand/Demo. Wir prüfen Konsistenz gegen den fixierten Contract und klären offene Abhängigkeiten (insbesondere Gruppe 2 ↔ Gruppe 5 Userverwaltung).

## Vibe-Coding-Hinweise

- Empfohlenes Tool: **Roo Code** (VS-Code-Plugin) + ChatAI-API (Qwen Coder) oder Claude/Gemini im Browser
- Diese Datei dient morgen als Prompt-Grundlage, z. B.: *"Generiere ein docker-compose.yml mit Traefik-Gateway gemäß folgendem Schnittstellen-Contract: ..."*
- Health-Check- und OpenAPI-Konvention oben sollte in jeden Modul-Prompt der anderen Teams übernommen werden, damit das Gateway alle Services automatisch einbinden kann

## Hinweis: Stylesheet

Gemeinsames Stylesheet für die Frontend-Module liegt unter [`styles/Stylesheet.css`](styles/Stylesheet.css).

## Team-Konventionen & Admin-Dashboard

Die verbindliche Checkliste für alle Modul-Teams (Health-Check, API-Doku, Containerisierung, Routing, Styling, Modul-Registrierung) steht in [`docs/TEAM-CONVENTIONS.md`](docs/TEAM-CONVENTIONS.md).

Das Admin-Dashboard (`dashboard/`) zeigt den Live-Status aller Module anhand der Registry in [`modules.json`](modules.json) — neue Module hinzufügen heißt: neuer Eintrag in `modules.json`, kein Code-Change am Dashboard.
