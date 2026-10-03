# Implementation Plan — CMS-007: Homepage Cuisine / Menu Teaser Content Ownership

Version: 1.0 (CMS-007A Approved)

## 1. Objective
Migrate the content of the Homepage Cuisine / Menu Teaser section from hardcoded component copy to Payload CMS while preserving exact visual design, hover/click background image transitions, slot numbering (`01`–`04`), responsive behavior, and code-owned Menu CTA. Crucially, the database migration must safely copy existing Media relationships from the `cuisineTeaser` array to the new fixed fields before any tables are dropped.

---

## 2. Source-of-Truth & Ownership Boundary
- **Payload CMS**:
  - `Homepage.cuisineTeaser.item01..item04.label` (`localized: true`): Category/course labels in EN and ID.
  - `Homepage.cuisineTeaser.item01..item04.image` (`localized: false`): Shared Media relationships to existing images.
- **Code / Schema**:
  - Exactly four structural slots (named `item01`, `item02`, `item03`, `item04`).
  - Slot numbering `01`, `02`, `03`, `04`.
  - Section layout, hover/focus interactions, active background crossfade, responsive styling.
  - Object positions (`object-[center_35%]` for item03, `object-center` for others).
  - Menu CTA label ("Explore the Menu" / "Jelajahi Menu") and destination (`/${locale}/menu`).
- **Signature Dishes**:
  - Completely separate component and separate CMS field (`Homepage.signatureDishes.items`). No coupling.

---

## 3. Files to Modify / Create

### Files to Modify:
1. `apps/web/src/globals/Homepage.ts` — Replace `cuisineTeaser` array with fixed group containing `item01`..`item04`; update Admin descriptions for both `cuisineTeaser` and `signatureDishes`.
2. `apps/web/src/content/provider.ts` — Update `HomepageData` interface and `getHomepageData()` to map `item01`..`item04` with localized labels and resolved media.
3. `apps/web/src/components/home/CuisineCategories.tsx` — Receive `cuisineData`, construct visual items from CMS, remove hardcoded labels, preserve presentation/interaction.
4. `apps/web/src/app/(frontend)/[locale]/page.tsx` — Pass `cuisineData={homepageData?.cuisineTeaser}` to `CuisineCategories`.
5. `apps/web/scripts/bootstrap-content.ts` — Add verification and bootstrap checks for `homepage.cuisineTeaser.item01..item04`.

### Files to Create:
1. `apps/web/src/migrations/YYYYMMDD_HHMMSS_add_homepage_cuisine_teaser_fixed_group.ts` — Committed migration with safe copy-before-drop logic and reversible `down` migration.
2. `apps/web/scripts/seed-cms-007-cuisine-teaser.ts` — Standalone seeding script for fresh DB / verification.
3. `apps/web/scripts/test-cms-007-qa.ts` — Automated QA test suite.

---

## 4. Migration Strategy & Data Safety
- **Order of Operations in Migration `up`**:
  1. Read existing rows from `homepage_cuisine_teaser` (main) and `_homepage_v_version_cuisine_teaser` (versions).
  2. Validate that exactly 4 media relations exist:
     - `old[0]` -> Antipasti
     - `old[1]` -> Pasta
     - `old[2]` -> Woodfire & Grill
     - `old[3]` -> Dolci
  3. Add new columns to `homepage`, `_homepage_v`, and `homepage_locales` (if labels are localized in separate table) for `item01`..`item04` labels and image IDs.
  4. Copy existing image IDs into `cuisine_teaser_item01_image_id`, `cuisine_teaser_item02_image_id`, `cuisine_teaser_item03_image_id`, `cuisine_teaser_item04_image_id`.
  5. Populate initial localized labels:
     - EN: `Antipasti`, `Primi Piatti`, `Secondi & Grill`, `Dolci`
     - ID: `Antipasti`, `Primi Piatti`, `Secondi & Panggang`, `Dolci`
  6. Only after successful copy and verification: drop `homepage_cuisine_teaser` and `_homepage_v_version_cuisine_teaser`.
- **Reversible `down`**:
  - Re-create array tables, copy `item01`..`item04` back as rows with order 1..4, and drop fixed columns.

---

## 5. Verification Contract
1. **Automated QA (`test-cms-007-qa.ts`)**:
   - Media parity: `item01..item04` images match legacy `01..04`.
   - Fixed slot structure: no generic array.
   - Reversible direct label edit test.
   - Reversible direct image edit test.
   - Independent EN vs ID localization test.
   - Draft safety test: draft saves isolate from public output, preview reflects draft.
   - Signature Dishes (CMS-006) regression check.
2. **Code QA**:
   - `npx payload generate:types` and `generate:importmap`.
   - `npm run typecheck` (`tsc --noEmit`).
   - `npm run build` (Turbopack).
3. **Browser QA (`browser_subagent`)**:
   - Admin UI test in `/admin`: label change and image picker test.
   - Desktop and Mobile viewports on `/en` and `/id`.
