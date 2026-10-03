# CMS-001: Payload CMS + PostgreSQL Foundation Implementation Contract

## 1. Objective
Establish the isolated Payload 3.x CMS and PostgreSQL foundation co-located within `apps/web` without defining business content schemas, migrating content, switching frontend providers, or modifying public website design or behavior.

## 2. Source-of-Truth & Scope Boundaries
- **In-Scope**:
  - Install Payload 3.x runtime packages (`payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `graphql`) using `npm`.
  - Next.js and React versions preserved (`next@16.3.3`, `react@19.0.0`).
  - Configure PostgreSQL adapter using `@payloadcms/db-postgres` targeting PostgreSQL 16.
  - Create minimal auth-enabled `Users` collection with `name` (text, required) and `role` (select: `admin` | `editor`, required, default: `editor`, `saveToJWT: true`).
  - Prevent Editor privilege escalation via field-level access control on `role`.
  - Mount Payload App Router integration: `(payload)` route group at `/admin` and `/api/[...slug]`.
  - Reorganize frontend routes into `(frontend)` route group to cleanly isolate root layouts without nesting `<html>` tags.
  - Setup `.env.example` with safe placeholder descriptions and confirm `.env` remains gitignored.
  - Verify first-user bootstrap, admin authentication, persistence after restart, role access restrictions, and public route smoke tests.

- **Out-of-Scope (Strict Invariants)**:
  - No Phase-2 business content schemas (`MenuCategory`, `MenuItem`, `JournalPost`, `Event`, `Recognition`, `Media`, Globals).
  - No content migration; `src/content/provider.ts` remains reading from fixtures.
  - No frontend provider switching.
  - No media migration or Cloudflare R2 configuration.
  - No modification to customer-facing website design, content, transitions, audio, or layouts.

## 3. Architecture & Files
- **Created / Modified Files**:
  - `apps/web/package.json`
  - `apps/web/package-lock.json`
  - `apps/web/next.config.ts` (wrapped with `withPayload`)
  - `apps/web/tsconfig.json` (added `@payload-config` path alias)
  - `apps/web/.env.example` (safe placeholders: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`)
  - `apps/web/src/payload.config.ts`
  - `apps/web/src/collections/Users.ts`
  - `apps/web/src/app/(payload)/layout.tsx`
  - `apps/web/src/app/(payload)/admin/[[...segments]]/page.tsx`
  - `apps/web/src/app/(payload)/admin/[[...segments]]/not-found.tsx`
  - `apps/web/src/app/(payload)/admin/importMap.js`
  - `apps/web/src/app/(payload)/api/[...slug]/route.ts`
  - `apps/web/src/types/payload-types.ts`
  - `apps/web/src/app/(frontend)/layout.tsx`
  - `apps/web/src/app/(frontend)/page.tsx`
  - `apps/web/src/app/(frontend)/not-found.tsx`
  - `apps/web/src/app/(frontend)/[locale]/...`
- **Database Strategy**:
  - PostgreSQL 16 via Docker container (`gema_postgres`) or local native instance.
  - Payload/Drizzle dev schema sync for local foundation tables (`users`, `payload_locked_documents`, `payload_preferences`, `payload_migrations`, `payload_kv`).

## 4. Empirical QA Protocol
- Typecheck & Build validation (`tsc --noEmit`, `next build`).
- Real browser verification on `http://localhost:3001`:
  - `/admin`: Login UI renders, First Admin creation succeeds, Dashboard loads, Logout succeeds, Re-login succeeds.
  - Users collection: `name` and `role` fields present, no duplicate email field.
  - Role security: Editor cannot elevate own role to `admin`, cannot delete admin, cannot create users.
  - Public desktop smoke: `/en`, `/id`, `/en/menu`, reservation overlay, `/en/chef/mandif-warokka`, `/en/visit`.
  - Mobile smoke: 390x844 viewport, header, hero, sticky reserve button, reservation overlay.
  - Route isolation & CSS: No route collisions, zero Admin CSS leakage into public site.
- Direct PostgreSQL inspection: Users persist across server restarts.
