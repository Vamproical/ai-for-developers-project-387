## Project

Full-stack **Booking Calendar** — TypeSpec API definition is the single source of truth (`main.tsp`). Emits OpenAPI 3.1 to `tsp-output/schema/openapi.v1.yaml`; the Spring Boot backend and the React frontend are built against that contract.

## Commands

### TypeSpec (repo root)

```
npx tsp compile main.tsp          # compile, emit OpenAPI
npx tsp validate main.tsp         # validate without emitting
```

### Backend (`backend/`)

```
./mvnw test                       # run unit + integration tests
./mvnw spring-boot:run            # run the API (defaults to profile without seed)
```

### Frontend (`frontend/`)

```
npm run dev                       # Vite dev server (port 5173)
npm run test:run                  # vitest run
npm run build                     # tsc -b && vite build
npm run lint                      # oxlint
```

### E2E (repo root, Playwright)

```
npm run test:e2e                  # run e2e suite
npm run test:e2e:ui               # interactive UI mode
npm run typecheck:e2e             # tsc --noEmit -p tsconfig.e2e.json
```

E2E `webServer` config compiles TypeSpec, starts the backend with the `e2e` Spring profile (port 8080) and the frontend dev server (port 5173). Override with `BASE_URL` / `VITE_API_BASE_URL` env vars.

## Architecture

- `main.tsp` — all types, routes, and interfaces (Public + Admin APIs, v1). Single source of truth for the contract.
- `tspconfig.yaml` — emits `@typespec/openapi3`, OpenAPI 3.1
- `tsp-output/schema/` — generated artifacts (do not edit)
- `backend/` — Spring Boot 3.5 (Java 21), H2, QueryDSL, MapStruct. `openapi-generator-maven-plugin` generates `*Api` interfaces + DTOs from `tsp-output/schema/openapi.v1.yaml`; hand-written `@RestController`s implement them (see `pom.xml`)
- `frontend/` — Vite + React 19 + Mantine + TanStack Query + react-hook-form/zod; Vitest unit tests, oxlint
- `e2e/` — Playwright suite with Page Object model (`pages/`), fixtures (`fixtures/`), spec files (`specs/`, `smoke/`)
- CI: `.github/workflows/ci.yml` (commitlint + backend tests + frontend tests), `release-please.yml`, and `hexlet-check.yml` (Hexlet platform checks — do not modify)

## Conventions

- `main.tsp` is the single source of truth — never hand-edit generated artifacts (`tsp-output/`, backend `target/generated-sources/`)
- Two API surfaces: **Public** (guest-facing: list event-types, list slots, create booking) and **Admin** (owner-facing: CRUD event-types, slots, schedules, bookings)
- Backend: entities use the `*Entity` suffix, split into `repository` / `service` / `mapper` (MapStruct) layers, controllers only delegate
- Frontend: features live in `frontend/src/features/*` (each with `components/`, `hooks/`, `pages/`), shared code in `frontend/src/shared/*`; imports use `@/` aliases
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) — enforced by `husky` + `commitlint` locally and CI workflow
- See `CONTRIBUTING.md` for full commit message format and rules

## Agent skills

### Issue tracker

GitHub Issues on `Vamproical/ai-for-developers-project-387`, using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
