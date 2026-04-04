# Architecture Brief — SetRsoft

## Overview

SetRsoft is a climbing route setting tool. Gym staff ("setters") use a 3D editor to place holds on wall models and save sessions. The product is a React/TypeScript SPA backed by a Django REST API, containerized with Docker Compose.

---

## Frontend (`frontend/src/`)

**Stack:** React 18 + TypeScript, Vite, Tailwind CSS v4, React Router v6, TanStack React Query v5, Zustand, React Three Fiber (Three.js), react-i18next.

### Folder structure

```
src/
├── app/          # Bootstrap: router (routes.tsx), root layout (Root.tsx), App.tsx
├── features/     # Self-contained feature modules (see below)
├── shared/       # Cross-feature utilities
│   ├── api/      # fetch wrapper: apiClient (get/post), reads VITE_API_BASE
│   ├── auth/     # AuthProvider, useAuth hook, ProtectedRoute/PublicRoute
│   ├── analytics/# PostHog client (posthog.ts)
│   ├── hooks/    # useAxiosPrivate, useVisitTracker
│   └── components/ # Footer, LanguageSwitcher, Placeholder
├── core/         # App-wide primitives
│   ├── config/   # env.ts, constants.ts (ROUTES), i18n.ts
│   ├── lib/      # cn() utility
│   └── ui/       # Button, shared UI tokens
└── locales/      # i18n JSON files: en, fr, de, ru, cn
```

### Features

| Feature | Route | Description |
|---|---|---|
| `showcase` | `/` | Public landing / HomePage |
| `gym` | `/gym` | Gym dashboard for setters |
| `editor` | `/editor/:wallId` | Full-screen 3D route editor |

### Editor feature (`features/editor/`)

The most complex feature. Runs **outside** the `Root` layout — it is a full-screen canvas with its own nav.

- **`EditorApp.tsx`** — top-level component; loads the wall session via React Query, preloads GLB models, wires unsaved-changes guard.
- **`store.ts`** — two Zustand stores:
  - `useDragStore` — tracks the currently dragged model (type, url, orientation).
  - `usePlacementStore` — all placed objects (`PlacedObject[]`), selection, wall/hold colors, unsaved-changes flag.
- **`components/`** — `MainCanvas` (R3F scene), `Sidebar` (holds + walls panels), `HoldInspector`, `FileManager`, `AddHoldModal`, `Tutorial`.
- **`utils/`** — `HandleAddHold`, `HandleLoadSession`, `HoldsStockQuery`, `WallSessionQuery`, `useHoldAvailabilityValidation`.
- **`mocks/useEditorAuth.ts`** — mock auth hook used while the real auth endpoint is not connected.

### State management

| Layer | Tool |
|---|---|
| Server state (API data, caching) | TanStack React Query v5 |
| Editor UI state (placement, drag) | Zustand |
| Auth state | React Context (`AuthProvider`) |

### Routing

`App.tsx` → `createBrowserRouter`:
- `/` → `Root` (shared nav + footer) wraps `HomePage`, `GymDashboard`.
- `/editor/:wallId` → `EditorApp` directly (no `Root` wrapper).
- All unknown routes redirect to `/`.

---

## Backend (`backend/`)

**Stack:** Django 4+, Django REST Framework, PostgreSQL.

```
backend/
├── setrsoft/   # Project config: settings.py, urls.py, wsgi.py, asgi.py
└── api/        # REST app: views.py, urls.py, apps.py
```

All API routes are mounted under `/api/`. Currently only one endpoint exists:
- `GET /api/health/` → `{ "status": "ok" }`

The backend is early-stage; the frontend uses mock/stub data for most features.

---

## Frontend ↔ Backend

- `VITE_API_BASE` env var sets the API origin (default: `http://localhost:8000`).
- `shared/api/client.ts` wraps `fetch` with typed `get<T>()` / `post<T>()`.
- TanStack React Query handles caching and loading states on top of this client.

---

## Analytics

PostHog is integrated in `shared/analytics/posthog.ts`. Events are captured directly (e.g. `posthog.capture('editor session opened', ...)`).

---

## Production

`docker-compose.prod.yml`: Nginx serves the Vite build and reverse-proxies `/api/`, `/admin/`, `/static/` to Gunicorn. Only port 80 is exposed.

---

## Key Conventions

- **Styling:** Tailwind v4 — tokens defined via `@theme` in `src/index.css`. No `tailwind.config.js`. Use named tokens (`surface-low`, `surface-high`, `mint`, `on-surface-variant`). No 1px borders; use background color shifts.
- **i18n:** All user-facing strings via `useTranslation()`. Never hardcode display text.
- **New libraries:** Check this file before adding a dependency — prefer extending existing stack (R3F/Drei for 3D, Zustand for local state, React Query for server state).
