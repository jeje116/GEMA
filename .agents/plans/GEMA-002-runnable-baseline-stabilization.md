# GEMA-002 — Runnable Baseline & Prototype Stabilization

Status: APPROVED
Risk Level: MEDIUM
Approved by: User
Approved date: 2026-09-16
Approval evidence: "Approved. Implement GEMA-002."

---

# 1. Objective

Restore the locked dependency environment using `npm ci`, run baseline compiler and build checks (`npm run lint`, `npm run build`), repair 8 confirmed baseline defects across exactly 6 consumer files, and empirically verify a stable, zero-compiler-error, runnable baseline of the Google AI Studio prototype using `npm run preview`.

---

# 2. Reason

The repository lacks `node_modules` and cannot execute typechecks, builds, or tests. Furthermore, empirical inspection identified 8 confirmed baseline defects between UI consumers and canonical domain models that prevent Menu items, Event descriptions, and Journal stories from rendering.

---

# 3. Files to Modify (Exactly 6 Files)

- `src/pages/MenuPage.tsx`
- `src/pages/EventDetailPage.tsx`
- `src/pages/JournalDetailPage.tsx`
- `src/pages/RecognitionPage.tsx`
- `src/pages/VisitPage.tsx`
- `src/components/layout/SiteFooter.tsx`

---

# 4. Files to Create

None.

---

# 5. In-Scope Behavior

1. **Environment Baseline**:
   - Capture repository git status before `npm ci`.
   - Execute `npm ci` without modifying `package.json` or `package-lock.json`.
   - Capture repository git status after `npm ci`.
   - Verify `package.json` and `package-lock.json` are unchanged.
   - Verify `npm ci` introduced no unexpected tracked-file changes while strictly preserving any pre-existing user changes.
2. **Compiler & Bundler Ground Truth**:
   - Execute `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`) to record baseline failures.
3. **Consumer Repairs (Strictly within the 6 approved files)**:
   - `MenuPage.tsx`: Correct property bindings to `item.categoryId === cat.id`, `item.priceLabel`, and `item.dietaryNotes`.
   - `EventDetailPage.tsx`: Correct property bindings to `event.fullDescription` and `event.priceLabel`.
   - `JournalDetailPage.tsx`: Render typed `entry.bodyBlocks` (paragraphs, images, quotes); remove the broken read-time display so `"undefined min read"` never renders.
   - `RecognitionPage.tsx`: Correct property binding to `rec.externalUrl`.
   - `VisitPage.tsx`: Remove stale email rendering line completely; preserve phone/address layout. Do not modify `src/data/types.ts`.
   - `SiteFooter.tsx`: Attach `onClick={openReservation}` from `useUI()` to the Reserve button.
4. **Import Adjustments**:
   - Adding or removing imports that are strictly required by the approved changes inside the six approved files is in scope. This includes removing imports made unused by an approved repair (e.g. unused `Markdown` in `JournalDetailPage.tsx`) and adding already-existing project imports (e.g. `useUI` in `SiteFooter.tsx`). No new package dependency is authorized.
5. **Empirical Verification**:
   - Verify `npm run lint` exits with code 0 (zero TypeScript errors).
   - Verify `npm run build` exits with code 0.
   - Execute final browser smoke verification against `npm run preview`.

---

# 6. Out-of-Scope Behavior

- No modification of `src/data/types.ts`.
- No arbitrary reading-time calculation algorithms.
- No CMS or database implementation.
- No backend API or server scripts.
- No redesign of visual layouts, colors, or typography.
- No removal or modernization of dependencies.
- No modification of relative demo event dates or simulated reservation/audio behavior.
- No changes to modal focus-trap behavior or untouched accessibility logic.
- No site-wide i18n translation remediation.

---

# 7. Untouched Components

- `src/data/types.ts`
- `package.json` & `package-lock.json`
- `vite.config.ts`, `tsconfig*.json`
- `src/main.tsx`, `src/App.tsx`, `src/router.tsx`
- All home page components (`src/pages/home/*`)
- `src/components/shared/ReservationOverlay.tsx`
- `src/components/motion/GatewayExperience.tsx`
- `src/data/events.ts`, `src/data/menu.ts`, `src/data/journal.ts`, `src/data/site.ts`, `src/data/recognition.ts`

---

# 8. Dependencies

None. No new runtime or development packages.

---

# 9. Data / Database Impact

- Schema change: NO
- Production data mutation: NO
- Migration: N/A

---

# 10. Web Test Strategy & Test Matrix

[WEB TEST STRATEGY]

Task:
GEMA-002 — Runnable Baseline & Prototype Stabilization

Risk Level:
MEDIUM

Primary Failure Modes:
1. Compiler breakages across unaligned TypeScript interface consumers.
2. Empty or collapsed UI components when binding to mismatched data keys (MenuPage, EventDetailPage, JournalDetailPage).
3. Runtime exceptions or broken links on stale/missing properties (VisitPage, RecognitionPage).
4. Regression of existing interactive flows (language switching, mobile drawer, reservation overlay).

Required Test Layers:
1. Static Verification (tsc --noEmit via npm run lint)
2. Build Verification (vite build via npm run build)
3. Production Runtime Verification (vite preview via npm run preview)
4. Component Data-Binding Verification (inspect rendered DOM for items, body text, prices)
5. Browser Smoke & Routing Verification (inspect /, /menu, /events/:slug, /journal/:slug, /visit, 404 fallback)
6. Responsive Smoke Verification (verify mobile header drawer, mobile reserve bar at 390px)
7. Regression Verification (LanguageProvider behavior, reservation modal open/close)

TEST MATRIX

| Scenario | Layer | Input / Action | Independent Expected Result | Regression Protected |
| -------- | ----- | -------------- | --------------------------- | -------------------- |
| Environment Integrity | Static | Record pre-status, run `npm ci`, record post-status | Dependencies installed; `package.json` and `package-lock.json` remain unchanged; `npm ci` introduces no unexpected tracked-file changes | Dependency lockfile stability & preservation of pre-existing repository state |
| Static Compilation | Static | Run `npm run lint` | Exits with code 0, 0 diagnostic errors | Complete TypeScript typecheck |
| Production Bundling | Build | Run `npm run build` | Produces production output in `dist/`, exits with code 0 | Vite/Tailwind v4 asset bundling |
| Production Runtime Smoke | Runtime / Preview | Launch `npm run preview` and visit `/` | Production bundle serves cleanly; page loads without console errors | Production asset serving |
| Menu Item Display | Component/DOM | Navigate to `/menu` | Renders > 0 dish items under each category heading (e.g. 'Burrata Caprese' under Antipasti, 'Chicken Pistachio' with price 'Rp 165.000') | Menu category navigation & dish listings |
| Event Detail Content | Component/DOM | Navigate to `/events/private-table-series` | Narrative prose contains full description text; price renders 'Rp 1.250.000 / person' (EN) or 'Rp 1.250.000 / orang' (ID) | Event detail narrative and meta sidebar |
| Event Detail Routing Boundary | Browser/Routing | Navigate to `/events/non-existent-event-slug` | Immediately redirects to `/404`, renders 'Page Not Found' | Invalid slug handling |
| Journal Detail Content | Component/DOM | Navigate to `/journal/inside-gemas-fresh-pasta` | Category and date render; string 'undefined min read' does not appear; body contains paragraph text and image element | Journal story reader |
| Journal Detail Routing Boundary | Browser/Routing | Navigate to `/journal/invalid-article-slug` | Immediately redirects to `/404`, renders 'Page Not Found' | Invalid slug handling |
| Visit Contact Display | Component/DOM | Navigate to `/visit` | Displays valid phone and address; does not display 'undefined' text or broken mailto link | Contact information fidelity |
| Recognition External Link | Component/DOM | Navigate to `/recognition` | Renders list items; does not throw when `externalUrl` is undefined | Press/accolade timeline |
| Footer Reservation Trigger | Component/DOM | Click 'Reserve' in SiteFooter | Global `ReservationOverlay` mounts and becomes visible | Modal trigger parity with Header CTA |
| Language Switcher Parity | Regression | Toggle EN -> ID in Header | Existing localized elements continue switching according to existing LanguageProvider behavior; modified EventDetail price uses correct EN/ID LocalizedText value; no new localization regression introduced | Bilingual context and translations |
| Mobile Navigation & CTA | Responsive | View at 390x844 (Mobile) | Fixed `MobileReserveBar` is visible at bottom; hamburger menu opens drawer | Mobile viewport usability |

Minimum Verification Commands:
- `npm ci`
- `npm run lint`
- `npm run build`
- `npm run preview`

Regression Boundary:
- `src/data/types.ts`
- `src/pages/HomePage.tsx` and all 11 home sections (`Hero`, `Positioning`, `SpacePreview`, etc.)
- `src/components/motion/GatewayExperience.tsx`
- `src/components/motion/PageReveal.tsx`
- `src/components/shared/ReservationOverlay.tsx`
- `src/i18n/LanguageProvider.tsx` and `src/i18n/translations.ts`
- `src/data/events.ts`, `src/data/menu.ts`, `src/data/journal.ts`, `src/data/reviews.ts`, `src/data/site.ts`

QA Handoff:
Instruct `/autonomous_qa_engineer` to verify compiler zero-error state (`npm run lint`), execute production build (`npm run build`), launch production preview (`npm run preview`), and inspect rendered DOM and console on `/menu`, `/events/private-table-series`, `/journal/inside-gemas-fresh-pasta`, `/visit`, and SiteFooter using the exact Oracle Contract definitions.

[/WEB TEST STRATEGY]

---

# 11. Oracle Contract

## Normal Case
- **Clean Compilation**: `npm run lint` exits with code `0`; zero TypeScript errors.
- **Clean Production Build**: `npm run build` exits with code `0`; bundles created in `dist/`.
- **Production Preview Launch**: `npm run preview` serves production bundle cleanly.
- **Menu Population**: `/menu` renders all six categories. Under Antipasti: "Burrata Caprese" (Rp 145.000), "Beef Carpaccio" (Rp 185.000), "Calamari Fritti" (Rp 120.000). Under Fresh Pasta: "Chicken Pistachio di Stracciatella" (Rp 165.000, signature indicator), "Gnocchi al Tartufo" (Rp 175.000).
- **Event Detail Body & Price**: `/events/private-table-series` displays narrative text: *"Join us for an intimate culinary journey where Chef Mandif showcases the best of local and imported seasonal produce, crafted into modern Italian masterpieces."* Price sidebar displays: *"Rp 1.250.000 / person"* (in EN) or *"Rp 1.250.000 / orang"* (in ID).
- **Journal Story Body & Read Time**: `/journal/inside-gemas-fresh-pasta` displays category and date; string `"undefined min read"` does **not** appear; body displays paragraph: *"Pasta is more than just flour and eggs; it is a testament to patience, tradition, and touch..."* followed by image and second paragraph.
- **Footer Reservation**: Clicking "Reserve" in footer mounts `ReservationOverlay` at Step 1.
- **Visit Contact Info**: `/visit` displays phone "0812-5220-0049" and address "Jl. Musi No. 32, Darmo..."; no `undefined` text or `mailto:undefined` link exists.

## Boundary Case
- **Invalid Event Slug**: `/events/non-existent-event` immediately redirects to `/404` and displays "Page Not Found".
- **Invalid Journal Slug**: `/journal/non-existent-article` immediately redirects to `/404` and displays "Page Not Found".
- **Missing Recognition URL**: `/recognition` items lacking `externalUrl` render year, title, and awarding body without "Read Article" link; no runtime exception.

## Error Case
- **Catch-All 404**: Arbitrary unmatched routes render `NotFoundPage` with return link "Return to Home".
- **Zero Runtime Console Errors**: Browser developer console across all public routes in preview contains zero uncaught TypeError or ReferenceError exceptions.

## Regression Case
- **Home Page Layout**: `/` renders all 11 sections in display order without layout shifts or missing elements.
- **Bilingual Toggle**: Existing localized elements continue switching according to existing LanguageProvider behavior; modified EventDetail price uses the correct EN/ID LocalizedText value (`'Rp 1.250.000 / person'` in EN, `'Rp 1.250.000 / orang'` in ID); GEMA-002 introduces no new localization regression.
- **Events & Journal Index**: `/events` and `/journal` continue listing cards and filtering categories accurately.
- **Mobile Navigation**: Hamburger menu opens slide-over navigation at 390px viewport.

---

# 12. Risks & Mitigations

- *Risk*: `npm ci` modifies lockfile or reverts pre-existing user work.  
  *Mitigation*: Capture git status before and after; verify `package.json` and `package-lock.json` are byte-identical; ensure pre-existing changes are preserved without regression.
- *Risk*: Consumer repairs inadvertently alter visual styling.  
  *Mitigation*: Repairs strictly align property bindings within existing JSX tags and Tailwind classes without altering styling rules.

---

# 13. Plan Deviations

1. **Deviation GEMA-002-DEV-01 (Authorized 2026-09-16)**:
   - *Reason*: `package-lock.json` was absent; project was exported with `bun.lock` (lockfileVersion 2). `npm ci` failed with `EUSAGE`.
   - *Action*: Executed `npm install --package-lock-only --ignore-scripts` to generate `package-lock.json` without modifying `package.json` or `bun.lock`. Then executed `npm ci`.
   - *Verification*: Verified SHA-256 hashes of `package.json` (`D9FC68...`) and `bun.lock` (`034B8A...`) remained identical before and after. Generated `package-lock.json` (`0539B1...`) verified with direct semver parity.
