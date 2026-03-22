# SetRsoft Architecture Overview

This document provides a concise overview of the SetRsoft project's core architecture. It is intended to help AI agents quickly understand the technology stack and repository structure.

## 1. Technology Stack

### Frontend
- **Framework:** React 19 built with Vite.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4 (configured via `@theme` in `src/index.css`). Design follows the "Stitch" UI charter ("The Kinetic Monolith").
- **Routing:** React Router v7.
- **State/Data Fetching:** React Query (TanStack Query v5).
- **Internationalization (i18n):** `react-i18next` supporting multiple languages (EN, FR, DE, RU, CN).

### Backend
- **Framework:** Django (Python).
- **Database:** PostgreSQL 16.

### Infrastructure & Deployment
- **Containerization:** Docker & Docker Compose.
- **Services:** `db` (Postgres), `backend` (Django runserver), `frontend` (Vite dev server).

## 2. Directory Structure

- `/frontend/` - Contains the React single-page application.
  - `src/app/` - App-wide layout (`Root.tsx`), global routing, and main entry providers.
  - `src/features/` - Domain-specific modules (e.g., `showcase`, `gym`, `editor`).
  - `src/shared/` - Shared UI components (e.g., `Footer`, `LanguageSwitcher`), hooks, and utilities.
  - `src/locales/` - JSON files for i18n translations.
- `/backend/` - Contains the Django server, API definitions, and models.
- `/docker-compose.yml` - Defines the local development environment using containerized services.
