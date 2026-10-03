# Implementation Plan — CMS-006: Homepage Signature Dishes Direct CMS Curation

Version: 1.0 (CMS-006A Approved)

## 1. Objective
Enable direct Payload CMS curation of the 4 Homepage Signature Dishes (selection and display order) by converting `Homepage.signatureDishes.items` into a sortable `hasMany` non-localized relationship to `menu-items`, removing all runtime derivation logic (`.filter(signature)`, `.slice(0, 4)`, and `sortOrder`) from the frontend while preserving 100% visual and structural parity.

---

## 2. Source-of-Truth & Ownership Boundary
- **Payload CMS**:
  - `Homepage.signatureDishes.title` (`localized: true`): Section heading in EN / ID.
  - `Homepage.signatureDishes.items` (`localized: false`): Shared relationship list of exactly 4 unique `menu-items` in display order.
- **Code / Schema**:
  - Exactly 4 cards layout structure, card components, animations, responsive design.
  - Curation constraints (`minRows: 4`, `maxRows: 4`, duplicate ID rejection).
- **MenuItems Collection**:
  - `MenuItem.signature` remains preserved as Menu-page metadata (for the "Signature" / "Khas" badge); has ZERO control over Homepage.
  - `MenuItem.sortOrder` remains authoritative for Menu page order; has ZERO control over Homepage order.

---

## 3. Files to Modify / Create

### Files to Modify:
1. `apps/web/src/globals/Homepage.ts` — Add `items` relationship to `signatureDishes` group.
2. `apps/web/src/collections/MenuItems.ts` — Add `beforeChange` availability guard, `beforeDelete` deletion guard, and targeted `afterChange` revalidation.
3. `apps/web/src/content/provider.ts` — Update `getHomepageData()` to populate `depth: 2` and return `items: MenuItem[]` in exact relationship order.
4. `apps/web/src/components/home/SignatureDishes.tsx` — Simplify props to `{ locale, title, items }`, remove `.filter(signature)` and `.slice(0, 4)`.
5. `apps/web/src/app/(frontend)/[locale]/page.tsx` — Pass curated items and title; remove `contentProvider.getMenuItems(locale)` from `Promise.all`.
6. `apps/web/scripts/bootstrap-content.ts` — Add verification / seeding for `homepage.signatureDishes.items`.

### Files to Create:
1. `apps/web/src/migrations/YYYYMMDD_HHMMSS_add_homepage_signature_dishes_items.ts` — Committed Drizzle migration.
2. `apps/web/scripts/seed-cms-006-signatures.ts` — Programmatic legacy derivation and initial seeding script.
3. `apps/web/scripts/test-cms-006-qa.ts` — Comprehensive automated QA test suite.

---

## 4. Detailed Specification

### A. Homepage Schema (`Homepage.ts`)
- Field `signatureDishes`:
  - `title`: `text`, `localized: true`.
  - `items`:
    - `type: 'relationship'`
    - `relationTo: 'menu-items'`
    - `hasMany: true`
    - `localized: false` (shared between EN and ID)
    - `required: true`
    - `minRows: 4`
    - `maxRows: 4`
    - `admin`:
      - `isSortable: true`
      - `allowCreate: false`
      - `description: 'Select exactly 4 dishes for the Homepage. Drag to control display order.'`
    - `filterOptions`: `{ isAvailable: { equals: true } }`
    - `validate`: Normalize IDs (`typeof val === 'object' ? val.id : val`), check `length === 4` and `new Set(ids).size === 4`.

### B. MenuItems Guards (`MenuItems.ts`)
- **Availability Guard (`beforeChange`)**:
  - When `originalDoc?.isAvailable === true` and incoming `data.isAvailable === false`:
  - Check if `originalDoc.id` exists in `Homepage.signatureDishes.items` on published Homepage OR latest draft Homepage.
  - If referenced, throw `APIError`: `"Cannot mark this item unavailable because it is currently selected as a Homepage Signature Dish. Replace it in Homepage first."`
- **Delete Guard (`beforeDelete`)**:
  - Check if `id` exists in `Homepage.signatureDishes.items` on published Homepage OR latest draft Homepage.
  - If referenced, throw `APIError`: `"Cannot delete this item because it is currently selected as a Homepage Signature Dish. Replace it in Homepage first."`
- **Targeted Revalidation (`afterChange`)**:
  - Check if `doc.id` is in published `Homepage.signatureDishes.items`.
  - If yes and rendered fields changed (name, description, image, priceLabel), trigger `revalidateHomepage()`.

### C. Data Provider (`provider.ts`)
- In `getHomepageData(locale)`:
  - Query with `depth: 2`.
  - Inspect `homepage.signatureDishes?.items`.
  - Map each item to `MenuItem` object preserving array index order.
  - Return `{ title: string, items: MenuItem[] }`.

### D. Frontend Routing & Components (`page.tsx`, `SignatureDishes.tsx`)
- Remove `contentProvider.getMenuItems(locale)` call from `HomePage` route.
- In `SignatureDishes`:
  - Accept `items: MenuItem[]`.
  - `const signatures = items;`
  - Zero `.filter` or `.slice`.

### E. Programmatic Seeding & Parity (`seed-cms-006-signatures.ts`)
- Query available menu items, sort by `sortOrder`, filter `signature === true`, slice first 4.
- Assert matching baseline:
  1. `pizzetta-1`
  2. `pizzetta-2`
  3. `woodfire-carne-1`
  4. `dolci-1`
- Update `homepage.signatureDishes.items` with these IDs.

---

## 5. Verification Contract
1. **Automated QA (`test-cms-006-qa.ts`)**:
   - Initial parity check (before vs after).
   - Reversible replace test.
   - Reversible reorder test (proves no `sortOrder` side-effects).
   - Availability guard test (curated blocked vs non-curated allowed).
   - Delete guard test (curated blocked vs non-curated temporary item allowed).
   - Draft safety test.
   - Exactly 4 validation and duplicate validation.
2. **Code QA**:
   - `npx payload generate:types` & `generate:importmap`.
   - `npm run typecheck` (`tsc --noEmit`).
   - `npm run build` (Turbopack).
3. **Browser QA (`browser_subagent`)**:
   - Admin UI drag-and-drop test in `/admin`.
   - Public desktop & mobile viewports on `/en` and `/id`.
