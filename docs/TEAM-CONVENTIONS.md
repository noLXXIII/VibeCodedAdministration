# Team-Konventionen — verbindlich für alle Module der CPP

Diese Checkliste ist die verbindliche Schnittstellen-Vereinbarung zwischen Team 3 (Admin & Orga/Gateway) und den Modul-Teams. Sie konsolidiert die Entscheidungen aus `Orga.md` zu einer eigenständigen Checkliste für das 9-Uhr-Sync-Meeting.

## 1. Health-Check

Jedes Modul MUSS bereitstellen:

```
GET /health → 200 OK
Body: {"status": "ok"}
```

Voraussetzung für Monitoring im Admin-Dashboard und Self-Healing über Traefik.

## 2. API-Dokumentation

Mindestens eines von beidem:

- `GET /openapi.json` (OpenAPI/Swagger-Spec), oder
- `API.md` im eigenen Repo mit Endpunkten und Request/Response-Beispielen

## 3. Datenformat

REST über JSON. Kein GraphQL, kein XML.

## 4. Auth (JWT via Authentik)

Team 3 betreibt eine zentrale **Authentik**-Instanz unter `/auth` (siehe Port-/Routing-Tabelle). Authentik ist der Identity-Provider und stellt die JWTs/Tokens aus, die alle Module zur Validierung von Requests nutzen.

Details zu Token-Format, Issuer-URL und Validierungs-Endpunkt werden im 11-Uhr-Meeting mit Gruppe 5 fixiert (Gruppe 5 ist für die Anbindung von Userverwaltung/Rechten an Authentik verantwortlich). **Platzhalter — wird nach dem Meeting hier ergänzt.**

## 5. Containerisierung

Das Frontend wird **zentral** in diesem Repo verwaltet und deployed — Team-Repos enthalten **kein** Frontend.

Jedes Team liefert in seinem Repo ausschließlich das **Backend**:

- ein `Dockerfile` für den Backend-Service (ein Repo darf mehrere Backend-Services enthalten, siehe Abschnitt 5a)
- eine eigene `docker-compose.yml` im Repo-Root mit Traefik-Labels nach folgendem Schema je Service:

```yaml
services:
  <service-name>:
    build: .
    networks:
      - cpp-edge
    labels:
      - traefik.enable=true
      - traefik.http.routers.<team>.rule=PathPrefix(`/api/<route>`)
      - traefik.http.services.<team>.loadbalancer.server.port=<port>

networks:
  cpp-edge:
    external: true
```

Das Gateway startet diese `docker-compose.yml` automatisch (siehe Abschnitt 10) — das Repo muss **lauffähig per `docker compose up -d` ohne weitere manuelle Schritte** sein.

### Traefik-Pfad-Konvention für Backends

Backend-Routen folgen dem Schema `/api/<route>`, wobei `<route>` dem Frontend-Pfad des Moduls entspricht:

| Frontend-Pfad | Backend-Traefik-Pfad |
|---|---|
| `/planning` | `/api/planning` |
| `/chat` | `/api/chat` |
| `/files` | `/api/files` |
| `/users` | `/api/users` |

Das Frontend spricht das Backend also immer unter `/api/<route>` an — nie direkt über den Port.

### 5a. Mehrere Services in einem Repo

Ein Team-Repo kann mehrere eigenständige Microapps enthalten (z. B. ein Backend + ein separates Worker/Bot-Service). In diesem Fall:

- Jeder Service bekommt einen eigenen Eintrag in der `docker-compose.yml` des Repos, mit eigenem Traefik-Router/eigener Route
- Jeder Service wird **einzeln** in `modules.json` registriert (Abschnitt 8) und referenziert per `repoId` dasselbe Repo
- Das Repo wird trotzdem nur **einmal** geklont/aktualisiert — das Gateway dedupliziert nach `repoId`, nicht nach Modul

## 5b. Gemeinsames Docker-Netzwerk

Damit Traefik (läuft im Orchestrator-Repo-Compose-Projekt) Container aus separat gestarteten Team-Repos erreichen kann, müssen alle Services im externen Netzwerk `cpp-edge` hängen (siehe Beispiel oben). Das Netzwerk wird einmalig vom Gateway angelegt (`docker network create cpp-edge`) und muss in jeder Team-`docker-compose.yml` als `external: true` referenziert werden.

## 6. Port- und Routing-Konvention

| Team | Modul | Port | Frontend-Route | Backend-Traefik-Route |
|---|---|---|---|---|
| 3 | Auth (Authentik) | 9000 | `/auth` | `/api/auth` |
| 1 | Kommunikation | 8001 | `/chat` | `/api/chat` |
| 2 | Dateimanagement | 8002 | `/files` | `/api/files` |
| 4 | Projektplanung | 8004 | `/planning` | `/api/planning` |
| 5 | Userverwaltung | 8005 | `/users` | `/api/users` |

Diese Werte werden im 9-Uhr-Meeting final bestätigt.

## 7. Frontend-Styling

Alle Frontend-Module binden das gemeinsame Stylesheet ein: [`styles/Stylesheet.css`](../styles/Stylesheet.css) aus diesem Repo.

- CSS-Variablen für Farben, Spacing, Typografie und Border-Radius nutzen (siehe `:root` im Stylesheet)
- Dark-Mode-Unterstützung über `[data-theme="dark"]` auf einem Vorfahren-Element
- Bestehende Utility-Klassen verwenden (`.btn`, `.input-field`, `.feedback-success`/`.feedback-error`, Spacing-Utilities wie `.mt-2`, `.pb-1` etc.) statt eigene Duplikate zu bauen

## 8. Modul-Registrierung beim Gateway

`modules.json` hat zwei Listen: `repos` (ein Eintrag pro Git-Repository) und `modules` (ein Eintrag pro Service/Route). Mehrere Module können dasselbe `repoId` referenzieren, wenn sie aus demselben Repo stammen (Abschnitt 5a).

Repo-Eintrag:

```json
{
  "id": "<repo-id>",
  "repoUrl": "https://github.com/<org>/<repo>.git",
  "branch": "main"
}
```

Modul-Eintrag:

```json
{
  "name": "<Modulname>",
  "team": <Teamnummer>,
  "route": "/<route>",
  "repoId": "<repo-id>",
  "healthCheck": "http://<service-name>:<port>/health",
  "docsUrl": "http://<service-name>:<port>/openapi.json",
  "adminUrl": "http://<service-name>:<port>/admin"
}
```

`adminUrl` und `repoId` sind optional (kein `repoId` = manuell verwalteter Service, z. B. Platzhalter oder Drittsystem). Neues Modul hinzufügen = neuer Eintrag in dieser Datei, per Admin-Dashboard-Formular unter `/admin` oder direkt im Repo. Kein Code-Change am Admin-Dashboard nötig.

## 9. Admin-Bereich pro Modul (optional)

Falls ein Modul eine eigene Verwaltungsoberfläche braucht (z. B. Userverwaltung von Gruppe 5, Forum-Moderation von Gruppe 1), gilt:

- Der Admin-Bereich läuft als Teil des Moduls selbst, **nicht** als separater Service — eigener Pfad innerhalb der bestehenden Route, z. B. `/users/admin`, `/chat/admin`
- Der Pfad wird im eigenen `Dockerfile`/Service genauso über Traefik geroutet wie die normale Route (kein zusätzliches Label-Schema nötig)
- Das Modul trägt seine Admin-URL als `adminUrl` in seinem `modules.json`-Eintrag ein (siehe Abschnitt 8)
- Das zentrale Admin-Dashboard (`/admin`, Team 3) bindet diese `adminUrl`s als Links/Karten ein — es duppliziert keine Modul-spezifische Verwaltungslogik, sondern verlinkt nur dorthin
- Zugriffsschutz auf den eigenen Admin-Bereich liegt in der Verantwortung des jeweiligen Moduls (z. B. Rollen-Check über das gemeinsame JWT, siehe Abschnitt 4)

## 10. Automatisches Deployment

Sobald ein Repo-Eintrag mit `repoId`/`repoUrl` in `modules.json` existiert, übernimmt das Gateway das Deployment vollautomatisch:

1. Alle 60 Sekunden prüft das Gateway per `git ls-remote` den neuesten Commit-Hash des konfigurierten `branch`
2. Bei einer Änderung gegenüber dem zuletzt deployten Stand: `git clone`/`git pull` in einen Arbeitsordner unter `repos/<repo-id>/`
3. Das Gateway führt dort `docker compose pull && docker compose up -d --build` aus (eigenes Compose-Projekt pro Repo, Netzwerk `cpp-edge`, siehe Abschnitt 5b)
4. Der Health-Check (Abschnitt 1) entscheidet, ob das neue Deployment als "up" angezeigt wird

Voraussetzung: Das Repo muss eine lauffähige `docker-compose.yml` im Root haben (Abschnitt 5) — das Gateway führt keine Build-Schritte aus, die nicht in dieser Datei stehen.
