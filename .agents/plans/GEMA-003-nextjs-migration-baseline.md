# GEMA-003 — Next.js Migration Baseline & Planning

Status: APPROVED
Risk Level: HIGH
Approved by: User
Approved date: 2026-09-17
Approval evidence: "Approved. Implement GEMA-003 exactly according to the corrected final execution contract."

---

# 1. Objective

Scaffold and implement a production-grade, highly performant Next.js 16.3.3 App Router frontend for GEMA in `apps/web/`, achieving 100% design and functional parity with the approved Google AI Studio visual baseline and preserving all 8 verified GEMA-002 consumer defect repairs, while establishing clean Server/Client boundaries, an asynchronous typed Content Provider abstraction ready for future Payload CMS integration, time-aware ISR event visibility, strict bilingual routing (`/en`, `/id`) with SEO translation fallback gating, and reproducible lockfile governance.

---

# 2. Reason

The initial Google AI Studio prototype was built on Vite and React Router as an isolated client-side SPA. GEMA requires:
- Next.js App Router to support server-rendered SEO (crucial for the Journal editorial engine and entity search),
- High-ticket commercial discovery for Events and Occasions,
- Seamless future co-location with Payload CMS in the same application,
- Separation of concerns between code-controlled design and eventually CMS-controlled data through an async typed content provider boundary,
- Preservation of the visual baseline without material visual drift.

---

# 3. Files to Modify

None in the legacy application.
- `.agents/TASKS.md` (Update task status)
- `.gitignore` (Ensure `apps/web/node_modules` and `apps/web/.next` are ignored if not already covered)

---

# 4. Files to Create

All new files live exclusively under `apps/web/`:
- `apps/web/package.json`
- `apps/web/package-lock.json`
- `apps/web/tsconfig.json`
- `apps/web/next.config.ts`
- `apps/web/postcss.config.mjs`
- `apps/web/src/styles/tokens.css`
- `apps/web/src/styles/globals.css`
- `apps/web/src/styles/index.css`
- `apps/web/src/lib/utils.ts`
- `apps/web/src/i18n/config.ts`
- `apps/web/src/i18n/translations.ts`
- `apps/web/src/i18n/getDictionary.ts`
- `apps/web/src/content/types.ts`
- `apps/web/src/content/fixtures/events.ts`
- `apps/web/src/content/fixtures/journal.ts`
- `apps/web/src/content/fixtures/menu.ts`
- `apps/web/src/content/fixtures/occasions.ts`
- `apps/web/src/content/fixtures/recognition.ts`
- `apps/web/src/content/fixtures/reviews.ts`
- `apps/web/src/content/fixtures/site.ts`
- `apps/web/src/content/provider.ts`
- `apps/web/src/components/shared/UIContext.tsx`
- `apps/web/src/components/shared/ReservationOverlay.tsx`
- `apps/web/src/components/shared/MobileReserveBar.tsx`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/components/layout/AudioControl.tsx`
- `apps/web/src/components/motion/GatewayExperience.tsx`
- `apps/web/src/components/motion/MotionReveal.tsx`
- `apps/web/src/components/home/Hero.tsx`
- `apps/web/src/components/home/Positioning.tsx`
- `apps/web/src/components/home/CuisineCategories.tsx`
- `apps/web/src/components/home/SignatureDishes.tsx`
- `apps/web/src/components/home/SpacePreview.tsx`
- `apps/web/src/components/home/ChefPreview.tsx`
- `apps/web/src/components/home/RecognitionPreview.tsx`
- `apps/web/src/components/home/EventsPreview.tsx`
- `apps/web/src/components/home/ReviewsPreview.tsx`
- `apps/web/src/components/home/JournalPreview.tsx`
- `apps/web/src/components/home/VisitPreview.tsx`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/robots.ts`
- `apps/web/src/app/sitemap.ts`
- `apps/web/src/app/[locale]/layout.tsx`
- `apps/web/src/app/[locale]/page.tsx`
- `apps/web/src/app/[locale]/menu/page.tsx`
- `apps/web/src/app/[locale]/experience/page.tsx`
- `apps/web/src/app/[locale]/occasions/page.tsx`
- `apps/web/src/app/[locale]/private-dining/page.tsx`
- `apps/web/src/app/[locale]/events/page.tsx`
- `apps/web/src/app/[locale]/events/[slug]/page.tsx`
- `apps/web/src/app/[locale]/journal/page.tsx`
- `apps/web/src/app/[locale]/journal/[slug]/page.tsx`
- `apps/web/src/app/[locale]/about/page.tsx`
- `apps/web/src/app/[locale]/chef/mandif-warokka/page.tsx`
- `apps/web/src/app/[locale]/recognition/page.tsx`
- `apps/web/src/app/[locale]/visit/page.tsx`
- `apps/web/src/app/[locale]/not-found.tsx`

---

# 5. In-Scope Behavior

1. **Scaffold & Baseline Setup**:
   - Create `apps/web/` directory.
   - Install authorized dependencies and establish `apps/web/package-lock.json`.
   - Configure Next.js 16.3.3, TypeScript ~5.8.2, and PostCSS with Tailwind CSS v4.3.3.
   - Configure `next/font/google` for Cormorant Garamond, Inter, and Roboto Condensed.
2. **Content Boundary & Domain Fixtures**:
   - Establish typed domain contracts in `content/types.ts` incorporating Source B additions (`PrivateEventCategory`, `PastBrandEvent`, `email` on `SiteData`).
   - Create static fixtures in `content/fixtures/` preserving historical event dates and structured journal blocks.
   - Implement `content/provider.ts` offering typed async queries and `isJournalLocaleSubstantive`.
3. **Core Shell & Client Island Architecture**:
   - Server-rendered HTML root and locale layouts.
   - Client Islands for `SiteHeader`, `AudioControl`, `GatewayExperience` (with clean lifecycle, no TS2367), `ReservationOverlay`, and `MobileReserveBar`.
   - Reconcile `SiteFooter`: Include Source B `/occasions` link and restore Source A's GEMA-002 `onClick={openReservation}` trigger.
4. **Bilingual Routing & Redirects**:
   - Root `/` permanent 308 redirect to `/en`.
   - `/[locale]/private-dining` permanent 308 redirect to `/[locale]/occasions`.
   - Invalid locale parameter (e.g. `/fr/menu`) returns HTTP 404.
5. **Time-Aware Event Visibility & ISR**:
   - `/[locale]/events` and `/[locale]/events/[slug]` filter by `endDateTime >= now` and specify `export const revalidate = 3600`.
   - Unmatched or expired event slugs return HTTP 404.
6. **Journal Editorial SEO & Gating**:
   - Server-render article body blocks.
   - Set `robots: noindex, follow` and canonical to `/en/...` when substantive Indonesian content is absent.
7. **Empirical Verification & Zero Material Visual Drift**:
   - Run typecheck, build, and HTTP smoke tests.
   - Execute visual parity audit vs legacy Vite app.

---

# 6. Out-of-Scope Behavior

- No installation or configuration of Payload CMS or database.
- No deletion or modification of `gema-restaurant-&-societiet/`.
- No modification of `reference/` artifacts.
- No Google Drive media migration or real audio files.
- No automated deployment to Netlify or production VPS.

---

# 7. Untouched Components

- `gema-restaurant-&-societiet/` (entire directory)
- `reference/` (entire directory)
- `archive/` (entire directory)
- `gema-restaurant-&-societiet.zip`

---

# 8. Dependencies (Locked Matrix)

- `next`: `16.3.3`
- `react`: `^19.0.0`
- `react-dom`: `^19.0.0`
- `tailwindcss`: `^4.3.3`
- `@tailwindcss/postcss`: `^4.3.3`
- `postcss`: `^8.5.3`
- `typescript`: `~5.8.2`
- `motion`: `^12.23.24`
- `lucide-react`: `^0.546.0`
- `clsx`: `^2.1.1`
- `tailwind-merge`: `^3.7.0`
- `@types/node`: `^22.14.0`
- `@types/react`: `^19.0.0`
- `@types/react-dom`: `^19.0.0`

---

# 9. Web Test Strategy & Test Matrix

[WEB TEST STRATEGY]

Task:
GEMA-003 — Next.js Migration Baseline Implementation & Verification

Risk Level:
HIGH

Primary Failure Modes:
1. Hydration errors on client islands (GatewayExperience, AudioControl, Language dropdown, ReservationOverlay).
2. Missing or broken dynamic routes (/events/[slug], /journal/[slug]) or failed redirect (/private-dining -> /occasions).
3. Invalid locale route parameter not triggering 404 (e.g. /fr/menu silently failing or falling back).
4. Stale event rendering due to missing time-aware revalidation.
5. Regression of verified GEMA-002 fixes (unbound footer Reserve button, empty menu lists, journal read-time rendering 'undefined').
6. Material visual drift from baseline (geometry, typography, colors, responsive breakpoints).
7. Inappropriate indexing of fallback translations (missing robots: noindex on incomplete Indonesian pages).

Required Test Layers:
1. Static Verification (npm run typecheck via tsc --noEmit in apps/web)
2. Production Build Verification (npm run build in apps/web)
3. Production Runtime & HTTP Status Smoke Test (npm run start -p 3001)
4. Route, Locale & Redirect Verification (HTTP 308 on /, /private-dining; HTTP 200 on valid canonical routes; HTTP 404 on invalid slugs and invalid locales)
5. Component & Data-Binding Verification (DOM inspection for dishes, prices, journal blocks, occasion cards)
6. Responsive Verification (Mobile 390px drawer, bottom reserve bar, desktop 1440px navigation)
7. Client Island Interaction Verification (Reservation modal open/close, Audio toggle, Gateway entrance)
8. Visual Parity Verification (Side-by-side comparison against legacy Vite app on port 3000)

TEST MATRIX

| Scenario | Layer | Input / Action | Independent Expected Result | Regression Protected |
|---|---|---|---|---|
| Static Compilation | Static | Run `npm run typecheck` in `apps/web` | Exits with code 0; zero TypeScript errors | Complete TypeScript typecheck across Next.js app |
| Production Bundling | Build | Run `npm run build` in `apps/web` | Exits with code 0; produces optimized SSG/ISR routes | Next.js App Router bundling & CSS compilation |
| Root Redirect | HTTP/Routing | GET `http://localhost:3001/` | Returns HTTP 308 with `Location: /en` | Deterministic root locale entry |
| Private Dining Redirect | HTTP/Routing | GET `http://localhost:3001/en/private-dining` | Returns HTTP 308 with `Location: /en/occasions` | Route backward compatibility |
| Invalid Locale Boundary | Routing | GET `http://localhost:3001/fr/menu` | Returns HTTP 404 status code; renders not-found page | Strict locale parameter validation |
| Server HTML Content (Journal) | SEO/DOM | Fetch HTML for `/en/journal/inside-gemas-fresh-pasta` | Response body contains raw HTML: `<h1>Inside GEMA's Fresh Pasta</h1>`, body paragraphs, author label; zero `"undefined min read"` | Server-rendered editorial SEO |
| Server HTML Content (Events) | SEO/DOM | Fetch HTML for `/en/events/private-table-series` | Response body contains raw HTML: `<h1>Private Table Series</h1>`, price `Rp 1.250.000 / person` | Server-rendered event discoverability |
| Event Time-Aware Visibility | Component/ISR | Navigate to `/en/events` | Renders upcoming/ongoing events (`endDateTime >= now`); does not render past events (`endDateTime < now`); ISR `revalidate = 3600` configured | Public events time-aware visibility invariant |
| Invalid Event Slug | Routing | GET `/en/events/non-existent-event` | Returns HTTP 404 status code; renders 404 page | Slug route boundary |
| Invalid Journal Slug | Routing | GET `/en/journal/non-existent-article` | Returns HTTP 404 status code; renders 404 page | Slug route boundary |
| Fallback SEO Protection | SEO | Fetch metadata for an incomplete Indonesian journal article | Emits `robots: noindex, follow`, canonical points to `/en/...`, omitted from Indonesian hreflang | Prevents thin/fallback duplicate content indexing |
| Menu Population Parity | Component/DOM | Navigate to `/en/menu` | Displays >0 dish items per category; "Burrata Caprese" (Rp 145.000) under Antipasti; "Chicken Pistachio" (Rp 165.000) under Fresh Pasta | GEMA-002 menu binding repair |
| Occasions Page & Brand Grid | Component/DOM | Navigate to `/en/occasions` | Displays 3 occasion categories (Private Dinings, Weddings, Birthdays) and 3 brand exclusives (Mondial, Frank & Co, Maharva) | Source B Occasions feature integration |
| Footer Reservation CTA | Component/DOM | Click "Reserve" in SiteFooter | Global `ReservationOverlay` mounts and opens Step 1 | GEMA-002 footer repair parity (restored from Source A) |
| Bilingual Routing | Regression/i18n| Navigate to `/id/menu` and `/id/events` | Indonesian translated labels render (`Menu`, `Acara`, `Pesan Kursi`); currency and text match ID locale | Bilingual routing parity |
| Mobile Usability | Responsive | View at 390px viewport | Fixed `MobileReserveBar` visible at bottom; hamburger icon triggers mobile drawer | Mobile user journey |
| Gateway Island | Runtime | Visit `/en` with clean session | Gateway animation renders; clicking "Enter" transitions to home; setting stored in sessionStorage | Gateway client island behavior |

Minimum Verification Commands:
- `cd apps/web && npm run typecheck`
- `cd apps/web && npm run build`
- `cd apps/web && npm run start -p 3001`

Regression Boundary:
- `gema-restaurant-&-societiet/` (untouched)
- `reference/` (untouched)
- `.agents/` (authoritative)

QA Handoff:
Instruct `/autonomous_qa_engineer` to verify clean typecheck and build, launch production server on port 3001, verify HTTP status codes (308 redirect on `/` and `/en/private-dining`, 404 on `/fr/menu` and invalid slugs), inspect rendered HTML for Server Components, verify Client Islands (ReservationOverlay, Gateway), test SEO fallback headers on incomplete translations, and execute visual parity check against legacy Vite app on port 3000.

[/WEB TEST STRATEGY]

---

# 10. Oracle Contract

## Normal Case
- **Clean Build**: `apps/web` builds cleanly with `next build` exiting with code 0.
- **Root Entry**: Visiting `/` returns HTTP 308 redirecting to `/en`.
- **Private Dining Entry**: Visiting `/en/private-dining` returns HTTP 308 redirecting to `/en/occasions`.
- **Menu Parity**: `/en/menu` renders all 6 categories:
  - Antipasti: "Burrata Caprese" (Rp 145.000), "Beef Carpaccio" (Rp 185.000), "Calamari Fritti" (Rp 120.000).
  - Fresh Pasta: "Chicken Pistachio di Stracciatella" (Rp 165.000), "Gnocchi al Tartufo" (Rp 175.000).
- **Event Detail**: `/en/events/private-table-series` displays narrative prose, price `"Rp 1.250.000 / person"`, and reservation CTA.
- **Journal Detail**: `/en/journal/inside-gemas-fresh-pasta` displays author label `"GEMA Culinary Team"`, structured paragraphs, image, quote, and zero `"undefined min read"`.
- **Occasions**: `/en/occasions` displays hero, 3 occasion categories with feature bullets, and Brand Exclusives grid.
- **Footer Reservation**: Clicking "Reserve" in the footer opens the `ReservationOverlay` modal.
- **Visit Page**: `/en/visit` displays phone `"0812-5220-0049"`, address, and email `"reservations@gemasurabaya.com"`.

## Boundary Case
- **Invalid Locale**: `GET /fr/menu` or `GET /de` triggers `notFound()` and returns HTTP 404.
- **Invalid Event Slug**: `/en/events/non-existent-event` triggers `notFound()` and returns HTTP 404.
- **Invalid Journal Slug**: `/en/journal/non-existent-article` triggers `notFound()` and returns HTTP 404.
- **Past Events**: Events where `endDateTime < now` are automatically omitted from public listings and return 404 on slug routes.
- **Translation Fallback SEO Gating**: When a page displays fallback content due to missing substantive Indonesian text, `robots: noindex, follow` is set, canonical points to `/en/...`, and the Indonesian URL is omitted from `hreflang` and sitemap.

## Error Case
- **Unmatched Route**: Arbitrary paths (e.g. `/en/unknown-path`) render `not-found.tsx` with "Page Not Found" and return to home link.
- **Zero Runtime Errors**: Developer console across all routes contains zero unhandled TypeError, ReferenceError, or React hydration mismatch warnings.

## Regression & Visual Parity Case
- **No Material Visual Drift**: Side-by-side comparison between `apps/web` (port 3001) and legacy Vite app (port 3000) at agreed viewports (`1440px` desktop, `390px` mobile) confirms no material visual drift across layout geometry, typography, spacing, colors, image composition, and animation intent.
- **Baseline Preservation**: All verified GEMA-002 repairs survive without degradation.
- **Legacy App Untouched**: Git diff confirms zero lines modified in `gema-restaurant-&-societiet/`.
