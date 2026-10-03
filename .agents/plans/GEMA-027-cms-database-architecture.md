# GEMA-027 — Payload CMS & PostgreSQL Architecture & Implementation Plan

Status: PROPOSED — FINAL ARCHITECTURE REVIEW
Date: 2026-09-20
Scope: Authoritative architecture, content vs. code ownership boundary, corrected Collection and Global schemas, field-level EN/ID localization, PostgreSQL data strategy, Local API access contract, media migration strategy, deterministic seed verification, and milestone breakdown for Payload CMS co-located in `apps/web`.

---

## 1. Locked Architectural Decisions

The following architectural foundations are explicitly locked:
1. **Co-location Inside `apps/web`**: Payload CMS lives directly inside `apps/web` under an isolated `(payload)` route group (`/admin` and `/api`), eliminating dual-server operational overhead while sharing types and runtime.
2. **PostgreSQL via `@payloadcms/db-postgres`**: Native PostgreSQL adapter utilizing Drizzle ORM migrations.
3. **Payload Local API for Frontend Ingestion**: Server Components query content directly via in-memory Local API calls (`getPayload({ config })`) without HTTP network overhead.
4. **EN / ID Field-Level Localization**: Applied directly on content fields (`localized: true`) within unified documents. Locales: `['en', 'id']`, default: `'en'`.
5. **No Visual Page Builder**: CMS manages editorial strings and structured content only. Strictly zero layout, CSS, breakpoint, typography, or animation controls.
6. **No ERP / POS / Inventory Model**: The CMS serves public marketing and reservations, not floor management, stock tracking, or kitchen production.
7. **Strict Two-Role Access**: `admin` (full technical and operational control) and `editor` (content storytelling). No enterprise permission matrices.
8. **Cloudflare R2 Media Storage**: Staging and production use Cloudflare R2 via `@payloadcms/storage-s3`. Local development uses local disk.
9. **Payload Lexical for Journal**: Minimal Lexical configuration (paragraph, heading, blockquote, link, media).
10. **About / Experience / Occasions Frozen in Code**: Kept outside Phase-1 CMS scope.

---

## 2. Payload Authentication & Generated Fields

### 2.1 Users Collection (`auth: true`)
Payload automatically generates the following internal fields for auth-enabled collections:
- `email` (login identity, unique index, format validation)
- `resetPasswordToken` & `resetPasswordExpiration`
- `salt` & `hash`
- `loginAttempts` & `lockUntil`

**Custom Defined Fields**:
- `name`: Text (required)
- `role`: Select (`admin` | `editor`, required, default `'editor'`, `saveToJWT: true` for zero-query admin access validation)

*Redundant independent `email` field is removed.*

### 2.2 Media Collection (`upload: true`)
Payload automatically generates technical upload metadata:
- `filename`
- `mimeType`
- `filesize`
- `width` & `height`
- `url` & `thumbnailURL`
- `focalX` & `focalY`

**Custom Defined Fields**:
- `alt`: Text (`localized: true`, required)
- `caption`: Text (`localized: true`, optional)

*Redundant manual `filename` definition is removed.*

### 2.3 Draft & Publication Status (`_status`)
Payload Drafts natively manages publication lifecycle:
- `_status`: `'draft'` | `'published'`

*Redundant custom `status` fields are removed from `journal-posts` and `events`.*

---

## 3. Redundant & Unused Fields Removed

1. **`menu-items.slug`**: Removed. Audit confirms no Menu Item detail route exists (`/menu/[slug]`). Homepage signature selection uses item IDs.
2. **`menu-items.contentStatus`**: Removed. Official Menu dataset is authoritative and locked.
3. **`journal-posts.relatedPosts`**: Removed. Not rendered or consumed anywhere in current journal UI.
4. **`events.gallery`**: Removed. No gallery rendered in Event UI.
5. **`events.eventType`**: Removed. Unused in event list or detail pages.
6. **`events.reservationType` & `reservationLabel`**: Removed. Button statically triggers reservation modal.
7. **`events.capacityLabel` & `terms`**: Removed. Not displayed in current templates.
8. **`recognitions.logoOrImage`**: Removed. Recognition rows display text, year, awarding body, and external links only.

---

## 4. Final Corrected Collections

### 4.1 `users`
- **Purpose**: Staff authentication and permissions.
- **Auth**: `true` (Payload managed email, password, tokens).
- **Drafts / Versions**: No / No.
- **Fields**:
  | Field | Type | Required | Localized | Default | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | `name` | `text` | Yes | No | None | User display name |
  | `role` | `select` | Yes | No | `'editor'` | `admin`, `editor` (`saveToJWT: true`) |
- **Access**: Admin: Full CRUD. Editor: Self read/update only.

### 4.2 `media`
- **Purpose**: Uploads repository for editorial images and videos.
- **Upload**: `true` (Payload managed filename, mimeType, size, dimensions, focal point).
- **Drafts / Versions**: No / No.
- **Fields**:
  | Field | Type | Required | Localized | Default | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | `alt` | `text` | Yes | Yes | None | Accessibility & SEO description |
  | `caption` | `text` | No | Yes | None | Optional caption |
- **Access**: Public read for published media; Authenticated create/update/delete.

### 4.3 `menu-categories`
- **Purpose**: Food and beverage section groupings. Exactly 20 categories.
- **Drafts / Versions**: No / No.
- **Fields**:
  | Field | Type | Required | Localized | Unique | Default | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
  | `name` | `text` | Yes | Yes | No | None | Category display name (e.g. "CICCHETTI / Snacks") |
  | `slug` | `text` | Yes | No | Yes | None | Section scroll target anchor (e.g. "cicchetti-snacks") |
  | `menuType` | `select` | Yes | No | No | None | **LOCKED: Belongs ONLY to Category (`food`, `beverage`)** |
  | `sortOrder` | `number` | Yes | No | No | `1` | Order within food or beverage |
  | `isActive` | `checkbox` | Yes | No | No | `true` | Public menu visibility |
  | `sectionNote` | `text` | No | Yes | No | None | Optional guidance note |
- **Access**: Admin & Editor full access.

### 4.4 `menu-items`
- **Purpose**: Official 118 dishes and beverages across 20 categories.
- **Drafts / Versions**: No / No.
- **Fields**:
  | Field | Type | Required | Localized | Default | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | `category` | `relationship` | Yes | No | None | Relates to `menu-categories` |
  | `name` | `text` | Yes | No | None | Official dish/drink title |
  | `description` | `textarea` | No | Yes | None | Culinary composition |
  | `priceLabel` | `text` | Yes | No | None | Formatted price (e.g. "Rp 145.000") |
  | `portion` | `text` | No | No | None | Serving portion (e.g. "280gr") |
  | `priceVariants` | `array` | No | No | None | Multi-portion pricing rows (`portion`, `label`, `priceLabel`) |
  | `subhead` | `text` | No | Yes | None | Subhead (e.g. "Chef's Cut") |
  | `subheadNote` | `text` | No | Yes | None | Guidance beneath subhead |
  | `additionalNotes`| `array` | No | No | None | Rows: `note` (text) |
  | `isIntroBlock` | `checkbox` | Yes | No | `false` | True for editorial intro cards ("CHEF'S CUT") |
  | `featured` | `checkbox` | Yes | No | `false` | Featured badge |
  | `signature` | `checkbox` | Yes | No | `false` | Homepage Signature Dishes source |
  | `isAvailable` | `checkbox` | Yes | No | `true` | **PUBLIC MENU AVAILABILITY / VISIBILITY ONLY** |
  | `sortOrder` | `number` | Yes | No | `10` | Sort order within category |
- **Access**: Admin & Editor full access.

### 4.5 `journal-posts`
- **Purpose**: Editorial essays and culinary stories.
- **Drafts / Versions**: Yes (`_status: 'draft' | 'published'`) / Yes.
- **Fields**:
  | Field | Type | Required | Localized | Unique | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | `title` | `text` | Yes | Yes | No | Article headline |
  | `slug` | `text` | Yes | No | Yes | Canonical URL slug |
  | `category` | `text` | Yes | Yes | No | Tag label (e.g. "Culinary Craft") |
  | `excerpt` | `textarea` | Yes | Yes | No | Card preview and meta description |
  | `heroImage` | `relationship` | Yes | No | No | Relates to `media` |
  | `content` | `richText` | Yes | Yes | No | Lexical (paragraph, heading, blockquote, link, media) |
  | `publishDate` | `date` | Yes | No | No | Publication date |
  | `authorLabel` | `text` | No | No | No | Default: `'GEMA Editorial'` |
  | `seo` | `group` | No | Yes | No | Nested `metaTitle` and `metaDescription` |
- **Access**: Admin & Editor full access.

### 4.6 `events`
- **Purpose**: Tasting series and seasonal dining experiences.
- **Drafts / Versions**: Yes (`_status: 'draft' | 'published'`) / Yes.
- **Fields**:
  | Field | Type | Required | Localized | Unique | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | `title` | `text` | Yes | Yes | No | Event headline |
  | `slug` | `text` | Yes | No | Yes | Canonical URL slug |
  | `eyebrow` | `text` | No | Yes | No | Kicker tag (e.g. "Exclusive Tasting") |
  | `shortDescription` | `textarea` | Yes | Yes | No | Summary for cards and meta description |
  | `fullDescription` | `richText` | No | Yes | No | Event overview and dining details |
  | `startDateTime` | `date` | Yes | No | No | ISO commencement timestamp |
  | `endDateTime` | `date` | No | No | No | Optional ISO conclusion timestamp |
  | `priceLabel` | `text` | No | Yes | No | Sidebar price (e.g. "Rp 1.250.000++") |
  | `heroImage` | `relationship` | Yes | No | No | Relates to `media` |
  | `featured` | `checkbox` | Yes | No | No | Featured badge for homepage |
- **Access**: Admin & Editor full access.

### 4.7 `recognitions`
- **Purpose**: Guide distinctions and press accolades.
- **Drafts / Versions**: No / No.
- **Fields**:
  | Field | Type | Required | Localized | Default | Admin Notes |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | `year` | `text` | Yes | No | None | 4-digit year (e.g. "2026") |
  | `title` | `text` | Yes | Yes | None | Award title |
  | `awardingBody` | `text` | Yes | No | None | Issuing institution |
  | `scope` | `select` | Yes | No | `'restaurant'` | Options: `restaurant`, `chef` |
  | `externalUrl` | `text` | No | No | None | Optional press verification link |
  | `sortOrder` | `number` | Yes | No | `10` | Display sequence |
  | `contentStatus` | `select` | Yes | No | `'needs-confirmation'` | Administrative provenance flag (`verified`, `demo`, `needs-confirmation`) |
- **Access**: Admin & Editor full access.

---

## 5. Final Corrected Globals

### 5.1 `site-settings`
- **Drafts / Versions**: No / Yes.
- **ADR-006 Governance**: Operational fields are **ADMIN-WRITE ONLY**. Admin descriptions explicitly state that values remain pending Product Owner confirmation.
- **Fields**:
  - `brandName`: Text (Locked authoritative: `GEMA`, Admin write)
  - `entitySubtitle`: Text (ADR-006 Group 1, Admin write)
  - `physicalAddress`: Textarea (ADR-006 Group 2, Admin write)
  - `phone`: Text (ADR-006 Group 3, Admin write)
  - `whatsapp`: Text (ADR-006 Group 3, Admin write)
  - `email`: Text (ADR-006 Group 6, Admin write)
  - `instagramUrl`: Text (ADR-006 Group 4, Admin write)
  - `tiktokUrl`: Text (ADR-006 Group 5, Admin write)
  - `dietaryPolicy`: Text (`localized: true`, ADR-006 Group 7, Admin write)
  - `services`: Array of strings (Locked: `['dine-in']`, Admin write)
  - `googleMapsUrl`: Text (Admin write)

### 5.2 `homepage`
- **Drafts / Versions**: Yes (`_status`) / Yes. Strictly zero motion, timing, or layout parameters.
- **Fields**:
  - `hero`: Group (`kicker`, `headline`, `support`, `location`, `ctaPrimary`, `ctaSecondary` — all localized)
  - `positioning`: Group (`text`, `dietaryBadge` — localized)
  - `spaceIntro`: Group (`title`, `text`, `ctaLabel` — localized)
  - `chefIntro`: Group (`text`, `ctaLabel` — localized)
  - `signatureDishes`: Group (`title` — localized)
  - `recognitionIntro`: Group (`title`, `ctaLabel` — localized)
  - `eventsIntro`: Group (`sectionTitleNow`, `sectionTitleUpcoming`, `ctaLabel` — localized)
  - `reviews`: Array of guest quotes (`quoteText` localized, `attribution`, `contentStatus`) — **MIGRATION HOLD: Seed blocked until PO verification**
  - `journalIntro`: Group (`title`, `ctaLabel` — localized)
  - `visitIntro`: Group (`title` — localized)

### 5.3 `navigation`
- **Drafts / Versions**: No / Yes.
- **Fields**:
  - `headerLinks`: Array (`label` localized, `internalPath` enum: `/menu`, `/experience`, `/events`, `/occasions`, `/about`, `/visit`)
  - `footerLinks`: Array (`label` localized, `internalPath` enum: `/menu`, `/experience`, `/occasions`, `/events`, `/about`, `/journal`, `/recognition`, `/visit`)

### 5.4 `chef`
- **Drafts / Versions**: No / Yes. Strictly zero audio choreography or color-reveal timing controls.
- **Fields**:
  - `name`: Text ("Mandif Warokka")
  - `role`: Text (`localized: true`, "Culinary Director")
  - `portrait`: Relationship to `media` (editorial portrait)
  - `videoPoster`: Relationship to `media` (video reel poster)
  - `videoFile`: Relationship to `media` (MP4 video loop asset)
  - `biography`: RichText (Lexical paragraphs)
  - `quote`: Textarea (`localized: true`)
  - `ctaLabel`: Text (`localized: true`)

---

## 6. Corrected Relationships Map

```text
menu-categories (1) ────────< (N) menu-items
                                  └── priceVariants (nested array)

media (1) ───────────────────< (N) journal-posts.heroImage
media (1) ───────────────────< (N) events.heroImage
media (1) ───────────────────< (1) chef.portrait
media (1) ───────────────────< (1) chef.videoPoster
media (1) ───────────────────< (1) chef.videoFile

users (1) ───────────────────< (N) audit trail / author stamps
```

---

## 7. Factual Content Migration Gate

| Domain | Status | Reason |
| :--- | :--- | :--- |
| **Menu** (Categories & Items) | **VERIFIED — MAY MIGRATE** | Official, authoritative, locked 20 categories and 118 items. |
| **Journal** (Articles) | **VERIFIED — MAY MIGRATE** | Approved storytelling articles and culinary copy. |
| **Events** (6 Events) | **VERIFIED — MAY MIGRATE** | Approved event previews and tasting concepts. |
| **Recognitions** (6 Entries) | **HOLD — REQUIRES CONFIRMATION** | Fixtures contain placeholder copy ("title to be confirmed"). Public queries filter `contentStatus = 'verified'`. |
| **Guest Reviews** (5 Quotes) | **HOLD — REQUIRES CONFIRMATION** | Marked as "concept content" in UI and demo in fixture. CMS-003 seed blocked until PO verifies authentic testimonials. |
| **Site Settings (Brand/Dine-In)** | **VERIFIED — MAY MIGRATE** | Authoritatively locked facts per ADR-006. |
| **Site Settings (Operations)** | **HOLD — REQUIRES CONFIRMATION** | Preserved in CMS under Admin-only write lock per ADR-006; not promoted to authoritative. |

---

## 8. Local API Public Read Contract

### 8.1 Public Frontend Queries
- **Rule**: Must explicitly set `overrideAccess: false`.
- **Draft Filtration**: For draft-enabled entities (`journal-posts`, `events`, `homepage`), queries unconditionally add `where: { _status: { equals: 'published' } }`.
- **Recognitions Filtration**: Queries add `where: { contentStatus: { equals: 'verified' } }`, ensuring unverified claims are never published.
- **Menu Filtration**: Queries add `where: { isAvailable: { equals: true } }` on items, and query active categories.

### 8.2 Privileged Operations
- **Rule**: Seed scripts, migration scripts, and maintenance tasks explicitly set `overrideAccess: true`.
- Code must never rely on implicit Local API defaults.

---

## 9. Media Ownership & Migration Strategy

| Asset Class | Ownership | Migration Strategy |
| :--- | :--- | :--- |
| **Brand Logos & Monograms** | **CODE** | Stored in `/public/media/brand/`. Referenced directly by layout components. |
| **System & UI Icons** | **CODE** | Lucide icons and inline SVGs. |
| **Ambient Audio Master** | **CODE** | Stored in `/public/media/audio/` and managed by `audioManager.ts`. |
| **Chef Video & Portrait** | **CMS** | Seeded into `media` collection; relations bound to `chef` Global. |
| **Journal Hero Images** | **CMS** | Seeded deterministically into `media`; linked to `journal-posts`. |
| **Event Cover Images** | **CMS** | Seeded deterministically into `media`; linked to `events`. |
| **Future Editorial Uploads** | **CMS** | Uploaded via Payload Admin directly to Cloudflare R2 (staging/production). |

### Deterministic Seed Procedure
1. Existing files under `/public/media/` remain untouched during Phase 1 to ensure zero broken links.
2. The seed script checks if each required CMS asset exists in `media`. If missing, it creates a record using local file buffers.
3. R2 object keys are generated with deterministic paths (`uploads/[hash]-[filename]`).
4. Public URLs resolve via the configured R2 bucket domain or local media route.

---

## 10. Database & Environment Architecture

### 10.1 Local Development
- Database: Local PostgreSQL 16 server or Docker container (`postgres:16-alpine`), connection string via `DATABASE_URI`.
- Drizzle schema push is permitted during early schema scaffolding in CMS-001/002.
- Media: Local filesystem storage under `apps/web/public/media/uploads` (gitignored).

### 10.2 Staging (Netlify)
- Database: Managed cloud PostgreSQL (provider selected during CMS-001 based on account and region).
- Connection Strategy: Serverless-compatible connection pooler appropriate to the selected provider to prevent Netlify Function connection exhaustion.
- Migrations: Committed migration files executed in CI build hook (`npm run payload migrate`) prior to `next build`. No schema push.
- Media: Cloudflare R2 via `@payloadcms/storage-s3`.

### 10.3 Production (VPS)
- Database: Dedicated production PostgreSQL 16+ with automated daily backups.
- Runtime: Long-running Node.js process managed via PM2 / Docker behind reverse proxy.
- Migrations: Executed during deployment pipeline before container reload.
- Media: Cloudflare R2 via `@payloadcms/storage-s3`.

---

## 11. Refined Implementation Milestones

### CMS-001: Payload + PostgreSQL Foundation (Foundation Only)
- **Scope**:
  - Install compatible Payload 3 packages in `apps/web`.
  - Configure `payload.config.ts` and `next.config.ts` with `withPayload`.
  - Configure PostgreSQL adapter via `DATABASE_URI`.
  - Create auth-enabled `users` collection (`role: 'admin' | 'editor'`).
  - Mount `(payload)` route group (`/admin` and `/api`).
  - Verify local database connection and first-user creation flow.
- **Acceptance Criteria**:
  - Payload Admin loads cleanly at `/admin`.
  - First admin user created securely via browser (no hardcoded passwords committed).
  - Public website (`/en`, `/id`, Menu, Reservation, Chef, Audio, Motion) is 100% UNCHANGED.
  - `npm run typecheck` and `npm run build` pass with 0 errors.
  - Zero content migrated; zero frontend providers switched.

### CMS-002: Core Collections & Globals Schemas
- **Scope**: Implement `media`, `menu-categories`, `menu-items`, `journal-posts`, `events`, `recognitions`, `site-settings`, `homepage`, `navigation`, and `chef`.
- **Verification**: `payload generate:types` runs; types match `apps/web` expectations; Admin UI validates all field configs.

### CMS-003: Deterministic Data Seeding & Parity Verification
- **Scope**: Seed 20 categories and 118 menu items from `menu.ts`; seed 3 journal posts and 6 events; block review seed until PO confirmation; execute automated 1:1 Menu Parity Test.
- **Verification**: `verify_menu_parity.mjs` confirms 100% match on categories, prices, portions, variants, subheads, and flags.

### CMS-004: Domain-by-Domain Incremental Frontend Integration
- **Scope**: Sequentially switch `provider.ts` methods to Payload Local API:
  1. Menu -> 2. Recognitions -> 3. Events -> 4. Journal -> 5. Chef -> 6. Homepage -> 7. Site Settings.
- **Verification**: Each domain undergoes browser visual and functional QA before progressing.

### CMS-005: Admin UX, Access Control & Production Hardening
- **Scope**: Field labels, descriptions, Admin-only operational fact locks, on-demand ISR revalidation hooks (`revalidatePath`), Netlify staging deployment verification.
