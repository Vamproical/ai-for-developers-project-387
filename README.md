# Booking Calendar

A full-stack booking calendar: a React SPA (Vite + Mantine) backed by a Spring Boot API (Java 21). The API contract is defined once in TypeSpec (`main.tsp`) and drives both backend and frontend code generation.

### Hexlet tests and linter status:
[![Actions Status](https://github.com/Vamproical/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Vamproical/ai-for-developers-project-387/actions)

## Live demo

- Public site: <https://booking-calendar-frontend-16nv.onrender.com>
- Admin panel: <https://booking-calendar-frontend-16nv.onrender.com/admin>

> Note: the free Render tier sleeps when idle — the first load after a period of inactivity can take ~30 seconds to wake up.

## How to build and run

### Quickstart (Docker Compose)

```bash
docker compose up --build
```

Serves the app at <http://localhost:8080> (SPA and API are same-origin).

### Development

1. Compile the TypeSpec contract (generates the OpenAPI schema):

   ```bash
   npx tsp compile main.tsp
   ```

2. Run the backend (Spring Boot, port 8080):

   ```bash
   cd backend && ./mvnw spring-boot:run
   ```

3. Run the frontend (Vite dev server, port 5173):

   ```bash
   cd frontend && npm install && npm run dev
   ```

The dev frontend talks to `http://localhost:4010` by default; set `VITE_API_BASE_URL` to point it elsewhere if needed.

### Deploying to Render

The repo contains a `render.yaml` Blueprint. In the Render dashboard: **New → Blueprint**, connect the repository on the `main` branch, and apply. This provisions `booking-calendar-backend` and `booking-calendar-frontend` and auto-deploys on every push to `main`.

Note: the backend runs with an in-memory H2 database, so data resets whenever the backend restarts or redeploys.
