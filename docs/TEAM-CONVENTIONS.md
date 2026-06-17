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

## 4. Auth (JWT)

Gemeinsames JWT-Format wird im 11-Uhr-Meeting mit Gruppe 5 fixiert. Gruppe 5 liefert Issuer/Validierung. **Platzhalter — wird nach dem Meeting hier ergänzt.**

## 5. Containerisierung

Jedes Team liefert in seinem Repo:

- ein `Dockerfile`
- einen docker-compose-Service-Snippet mit Traefik-Labels nach folgendem Schema:

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.<team>.rule=PathPrefix(`/<route>`)
  - traefik.http.services.<team>.loadbalancer.server.port=<port>
```

## 6. Port- und Routing-Konvention

| Team | Modul | Port | Route |
|---|---|---|---|
| 1 | Kommunikation | 8001 | `/chat` |
| 2 | Dateimanagement | 8002 | `/files` |
| 4 | Projektplanung | 8004 | `/planning` |
| 5 | Userverwaltung | 8005 | `/users` |

Diese Werte werden im 9-Uhr-Meeting final bestätigt.

## 7. Frontend-Styling

Alle Frontend-Module binden das gemeinsame Stylesheet ein: [`styles/Stylesheet.css`](../styles/Stylesheet.css) aus diesem Repo.

- CSS-Variablen für Farben, Spacing, Typografie und Border-Radius nutzen (siehe `:root` im Stylesheet)
- Dark-Mode-Unterstützung über `[data-theme="dark"]` auf einem Vorfahren-Element
- Bestehende Utility-Klassen verwenden (`.btn`, `.input-field`, `.feedback-success`/`.feedback-error`, Spacing-Utilities wie `.mt-2`, `.pb-1` etc.) statt eigene Duplikate zu bauen

## 8. Modul-Registrierung beim Gateway

Sobald ein Service lauffähig ist, trägt das Team einen Eintrag in `modules.json` (im Orchestrator-Repo) ein oder meldet ihn an Team 3:

```json
{
  "name": "<Modulname>",
  "team": <Teamnummer>,
  "route": "/<route>",
  "healthCheck": "http://<service-name>:<port>/health",
  "docsUrl": "http://<service-name>:<port>/openapi.json"
}
```

Neues Modul hinzufügen = neuer Eintrag in dieser Datei. Kein Code-Change am Admin-Dashboard nötig.
