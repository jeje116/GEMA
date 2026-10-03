# GEMA-021A — About Page Authentic Media Implementation + Visit Preserve

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-19
Scope: Strictly source-only replacement of visual media slots on the About page (`/about`) using approved authentic Google Drive photography for The Origin (`FNR06840.jpg`), The Philosophy (`402054FD-3282-4211-B901-BF562BBF1B99.jpg`), and The Architecture (`FNR02727.jpg`). Strict preservation of the Visit page (`/visit`). Zero redesign, zero copy changes, zero typography/spacing/structural changes.

---

## 1. Core Rule & Directives

For About:
`OLD IMAGE SOURCE` → `NEW AUTHENTIC GEMA IMAGE` inside the SAME existing slot.

Preserve exactly:
* layout
* section order
* typography
* spacing
* copy
* animation
* interaction
* aspect ratios
* responsive structure

Do not add new media sections.

### A. Slot 1 — The Origin
- **Approved Source**: `drive-download-20260917T042811Z-1-001/FNR06840.jpg`
- **Target Web Asset**: `apps/web/public/media/about/about-origin.jpg`
- **Existing Geometry**: `aspect-[4/5]`
- **Visual Content**: Stacked GEMA-branded porcelain/tableware with visible "G" monogram, hospitality detail, physical brand identity.
- **Semantic Rule**: Do NOT describe this image as literally documenting GEMA's historical origin; it is an editorial representation of identity, intentionality, brand detail, and hospitality craftsmanship. Section copy remains unchanged.
- **Framing**: Prioritize visible GEMA monogram, stacked tableware, and recognizable branded detail within the 4:5 container.

### B. Slot 2 — The Philosophy
- **Approved Source**: `drive-download-20260917T042811Z-1-001/402054FD-3282-4211-B901-BF562BBF1B99.jpg` (explicitly NOT QAR03973.jpg)
- **Target Web Asset**: `apps/web/public/media/about/about-philosophy.jpg`
- **Existing Geometry**: `aspect-square`
- **Visual Content**: Organized selection of culinary spices / aromatics / ingredients arranged neatly on a stainless-steel tray.
- **Semantic Rule**: Semantically aligns with culinary philosophy centered on respect for ingredients, intention, precision, and culinary discipline.
- **Framing**: Retain a meaningful spread of ingredients rather than focusing on only one spice. Preserve square geometry.

### C. Slot 3 — The Architecture
- **Approved Source**: `drive-download-20260917T042811Z-1-001/FNR02727.jpg` (explicitly NOT FNR06860.jpg to prevent cross-page duplication with Occasions)
- **Target Web Asset**: `apps/web/public/media/about/about-architecture.jpg`
- **Existing Geometry**: `aspect-[3/4]`
- **Visual Content**: Warm cream/ivory upholstered banquette seating, rich dark espresso wood, woven cane screen texture, refined table setting, ambient pendant lighting.
- **Framing**: Prioritize curved ivory banquette, espresso wood, cane screen, and lighting elements. Do not overcrop into a generic tabletop image.

### D. Visit Page — Strict Preservation
- **Status**: NO CHANGES.
- **Invariants**: Preserve Google Maps embed, address, operating information, reservation CTA, WhatsApp behavior, layout, typography, and spacing.
- **Directives**: Do not add photography to Visit. The map remains the primary visual/functional anchor.

---

## 2. Files Created
- `apps/web/public/media/about/about-origin.jpg` (Optimized progressive JPEG, ~1200px width, quality ~85)
- `apps/web/public/media/about/about-philosophy.jpg` (Optimized progressive JPEG, ~1200px width, quality ~85)
- `apps/web/public/media/about/about-architecture.jpg` (Optimized progressive JPEG, ~1200px width, quality ~85)

## 3. Files Modified
- `apps/web/src/components/about/AboutClient.tsx` (Replace 3 Unsplash stock URLs with `/media/about/about-origin.jpg`, `/media/about/about-philosophy.jpg`, `/media/about/about-architecture.jpg` and update descriptive alt text; zero layout/structural changes)
- `.agents/TASKS.md` (Register GEMA-021A with status and execution notes)

---

## 4. Out-of-Scope / Untouched Systems
- Visit page (`apps/web/src/components/visit/VisitClient.tsx`, `apps/web/src/app/[locale]/visit/page.tsx`): UNTOUCHED.
- Homepage, Menu, Experience, Occasions, Events, Journal, Recognition, Navbar, Footer, Reservation: UNTOUCHED.
- All copy, headings, section order, spacing, and animations across About: UNTOUCHED.

---

## 5. QA Plan & Verification Contract
1. **Visual Parity**: Existing layout is oracle. 4:5, square, and 3:4 aspect ratios strictly preserved.
2. **Desktop Browser QA (~1440x900)**:
   - Origin: GEMA-branded tableware visible, 4:5 geometry intact.
   - Philosophy: Ingredient/spice composition visible, square geometry intact.
   - Architecture: Ivory/espresso/cane/lighting elements visible, 3:4 geometry intact.
   - No typography, spacing, or section positioning changed.
3. **Mobile Browser QA (~390x844)**:
   - Origin monogram remains visible after crop.
   - Philosophy image remains readable at square size.
   - Architecture crop retains booth + wood + lighting context.
   - Zero horizontal overflow, no layout shift.
4. **Visit Page Verification**:
   - Confirm source files untouched.
   - Visual appearance, Google Maps embed, and reservation CTA unchanged.
5. **Code QA**:
   - `npm run typecheck` passes.
   - `npm run build` passes.
