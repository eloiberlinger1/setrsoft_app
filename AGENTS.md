# AI Agents Directives

This document provides foundational rules and context for any AI agent interacting with the SetRsoft repository.

Look in .ai/ for more informations for specific implementations.

## Global Rules
1. **Language:** All code, comments, documentation, and commit messages MUST be written in English. Wait for explicit user override to write in another language.
2. **Context First:** Always review `.ai/architecture.md` before making architectural decisions or proposing new libraries.
3. **No Destructive Operations:** Do not delete databases or wipe configuration files without explicit user approval. 

## Frontend Development Guidelines
- **Styling:** The application uses Tailwind CSS v4. Do NOT use `tailwind.config.js` for themes; instead, rely on the `@theme` directive in `src/index.css`.
- **Design Charter:** The UI strictly follows the "Stitch" charter ("The Kinetic Monolith"). Use named tokens (`surface-low`, `mint`, `on-surface-variant`). Avoid traditional 1px borders in favor of background color shifts (`bg-surface-high` vs `bg-surface-low`).
- **Translations:** Any user-facing string must use the `useTranslation()` hook from `react-i18next` mapped to the JSON files in `src/locales/`.

## Backend Development Guidelines
- Standard Django conventions apply.
- Ensure database migrations are generated and applied properly if changes are made to models.
- The PostgreSQL database is named `setrsoft` by default.
