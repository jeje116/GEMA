# GEMA-025 — Isolated Payload CMS + PostgreSQL Scaffold (Phase 1)

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-19
Scope: Phase 1 CMS foundation. Scaffold an isolated, standalone Payload CMS application in `apps/cms` backed by PostgreSQL. Strict frontend freeze on `apps/web` (zero application source code modifications). Minimal core schema restricted to `users` and `media` with EN/ID localization, access control, and migration support.

---

## 1. Locked Architectural Directives

- **Application Isolation**: Payload CMS lives exclusively in `apps/cms`. It is NOT embedded in `apps/web`.
- **Frontend Freeze**: `apps/web` remains completely untouched. No schema, components, routing, or dependencies modified in `apps/web`.
- **Payload Version**: Current stable Payload release (`3.90.x`) with official `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, and `sharp`.
- **Database**: PostgreSQL configured via `DATABASE_URL` environment variable using `@payloadcms/db-postgres`. Explicit migration support.
- **Port Strategy**: `apps/web` runs on port 3001; `apps/cms` runs on port 3000. They run completely independently.

---

## 2. Core Collections

### A. `users`
- Auth-enabled collection.
- Fields: `email`, `password` (managed by Payload auth), `role` (`admin` | `editor`, default `editor`).
- Access:
  - Admin: full CMS content access and user management.
  - Editor: CMS content/media access; strictly prohibited from managing other users.

### B. `media`
- Upload-enabled collection supporting images and video files.
- Fields:
  - `alt`: Text (`localized: true`, required).
  - `caption`: Text (`localized: true`, optional).
- Native Image Crop & Focal Point: Utilizes Payload native focal point / crop UI powered by `sharp`. No custom `{ x, y }` coordinate fields.
- Derivatives: Restrained admin preview / thumbnail only; visual slot geometry remains client-owned.
- Access: Public read for published media assets; authenticated create/update/delete.

---

## 3. Localization & Migration Strategy

- **Locales**: `en` (default) and `id`.
- **Field Localization**: Applied to editorial text fields (`alt`, `caption`). Upload metadata remains language-neutral.
- **Fallback Policy**: Documented for future adapter integration to use `fallbackLocale: false`.
- **Migrations**: Explicit migration workflow configured via `payload migrate:create` and `payload migrate`.

---

## 4. Verification Contract

1. **CMS Dev Server**: Starts on port 3000 independently.
2. **Admin UI**: Admin route `/admin` renders clean first-user registration screen.
3. **REST API**: Responds at `/api/users` and `/api/media`.
4. **PostgreSQL**: Connects and creates schema in local database without errors.
5. **Types Generation**: `payload generate:types` outputs valid TypeScript interfaces.
6. **CMS Code QA**: `npm run typecheck` and `npm run build` pass in `apps/cms`.
7. **Frontend Regression**: `npm run typecheck` and `npm run build` in `apps/web` pass with zero changes.
