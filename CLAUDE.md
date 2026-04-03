# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Zdarzenia Niepożądane — a hospital adverse event reporting system for Polish healthcare (Dz.U. 2023 poz. 1692). Polish-language domain, English code.

Domain research docs in repo root:
- `system-specyfikacja.md` — full system specification (Polish)
- `adverse-events-guide.md` — WHO European guidelines summary
- `research-notes.md` — research on adverse event reporting systems

## Development Setup

Development and testing run locally (not in Docker). Docker Compose is for production only (requires sudo).

### Backend (Python 3.12+ / FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### Frontend (React 19 / TypeScript / Vite)

```bash
cd frontend
npm install
```

## Common Commands

### Backend

```bash
cd backend && source .venv/bin/activate
pytest tests/ -v                     # run all tests (91 tests)
pytest tests/test_incidents_api.py   # run single test file
pytest tests/ -k "test_name"         # run single test by name
ruff check app/                      # lint
ruff format app/                     # format
uvicorn app.main:app --reload        # dev server on :8000
```

### Frontend

```bash
cd frontend
npm run dev          # vite dev server on :5173
npm run build        # tsc + vite production build
npm test             # vitest in watch mode
npm run test:run     # vitest single run
```

### E2E (Playwright)

```bash
cd e2e
npm test             # headless Chromium
npm run test:headed  # visible browser
npm run test:ui      # Playwright UI debugger
```

Requires backend venv set up (`backend/.venv`) and frontend `node_modules` installed. Playwright starts both servers automatically via `webServer` config. Uses SQLite (`backend/e2e-test.db`) — no Docker needed.

### Production (Docker — user runs manually with sudo)

```bash
sudo bash start.sh   # build, migrate, seed — idempotent
```

Test accounts: admin@example.com/admin123, koordynator@example.com/koordynator123, reporter@example.com/reporter123

## Architecture

Three Docker Compose services: **db** (PostgreSQL 16), **backend** (FastAPI/Uvicorn), **frontend** (Vite). Frontend proxies `/api` to backend.

### Backend (`backend/app/`)

- `main.py` — app init, CORS, router registration
- `config.py` — env-based settings (DATABASE_URL, JWT_SECRET, etc.)
- `database.py` — SQLAlchemy engine and session factory
- `dependencies.py` — `get_current_user`, `require_role()`, `require_coordinator_or_admin`, `require_admin`
- `models/` — SQLAlchemy 2.0 models: `incident.py`, `rca.py`, `user.py`, `notification.py`
- `schemas/` — Pydantic request/response schemas
- `routers/` — `auth`, `incidents`, `rca`, `dashboard`, `export`, `notifications`
- `services/` — business logic per domain: `auth`, `incidents`, `rca`, `dashboard`, `notifications`
- `alembic/` — database migrations (written manually — no local PG for autogenerate)

All API routes under `/api` prefix. Routers delegate to services; services own DB queries. Notifications injected in routers after state changes.

### Frontend (`frontend/src/`)

- `pages/` — `LoginPage`, `ReportPage`, `MyIncidentsPage` (reporter), `IncidentsPage` (staff), `IncidentDetailPage`, `StatisticsPage`, `ActionsPage`
- `components/` — `Dashboard/` (7 widgets), `IncidentForm/` (6-step wizard), `IncidentList/`, `RCAPanel/`, `ProtectedRoute`, `NotificationBell`
- `context/AuthContext.tsx` — user state, login/logout, token management
- `api/` — `client.ts` (apiFetch with auth headers + 401/403 handling), `auth.ts`, `incidents.ts`, `dashboard.ts`, `rca.ts`, `notifications.ts`
- `types/` — TypeScript interfaces mirroring backend: `incident.ts`, `rca.ts`, `auth.ts`, `notification.ts`
- Path alias: `@/` → `./src/`

### Data Model

```
User (reporter|coordinator|admin)
  └─ Incident (reporter_user_id FK)
       └─ RCAAnalysis (1:1)
            └─ ActionItem (responsible_user_id FK)
Notification (user_id FK)
```

Incident status workflow: `new → in_triage → rejected|in_analysis → escalated_rca → action_plan → implementing → closed`

### Auth & Authorization

- JWT (pyjwt + bcrypt), 8h expiry, localStorage
- Reporter: create incidents, view own only
- Coordinator/Admin: all incidents, status changes, RCA, dashboard, export, actions
- Admin only: create users (`POST /api/auth/users`)
- All endpoints require auth except `/api/auth/login` and `/api/health`

### Notifications

- In-app only (DB table + REST API + polling)
- Triggered on: incident created → coordinators, status change → reporter, RCA created → reporter, RCA completed → coordinators, action assigned → responsible user, action completed → coordinators
- `NotificationBell` component polls `/api/notifications/unread-count` every 30s

## Code Style

- Backend: ruff, Python 3.12 target, 100 char line length
- Frontend: TypeScript strict mode, ES2020 target, Tailwind CSS 4
- Backend tests: pytest with SQLite (no Docker needed)
- Frontend tests: vitest with jsdom
- TDD approach: tests written before implementation

## Database

PostgreSQL 16 in Docker. Alembic manages schema. Migrations written manually (no local PG). Seed data is idempotent (`seed.py` skips if incidents exist).
