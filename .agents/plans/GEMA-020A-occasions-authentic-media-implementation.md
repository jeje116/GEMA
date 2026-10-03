# GEMA-020A — Occasions Page Authentic Media Implementation

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-19
Scope: Source-only replacement of visual media slots on the Occasions page (`/occasions`) using approved authentic Google Drive photography for Hero (`QAR03928.jpg`) and Private Dinings (`FNR06860.jpg`). Strict preservation of Weddings, Birthdays, and Brand Exclusives. Zero layout, copy, typography, spacing, or structural changes.

---

## 1. Locked Approvals & Directives

### A. Occasions Hero
- **Source**: `drive-download-20260917T042811Z-1-001/QAR03928.jpg`
- **Target Web Asset**: `apps/web/public/media/occasions/occasions-hero.jpg`
- **Visual**: Sunlit dining terrace corner inside GEMA with arched window, glass door, stone wall, terracotta banquette, green bistro tile table, woven rattan armchairs, tropical planter, and scalloped awning.
- **Constraints**:
  - Preserve `w-full h-[60vh] md:h-[70vh] relative` geometry unchanged.
  - Preserve `brightness-[0.7]`, headline, and tagline positioning.
  - Recommended focal treatment: `object-position: center 40%`.
  - Preserve architectural arch, dining table, terracotta banquette, tropical planting, and scalloped awning.
  - Alt text: localized/semantic description of GEMA occasions dining atmosphere.

### B. Category 01 — Private Dinings
- **Source**: `drive-download-20260917T042811Z-1-001/FNR06860.jpg`
- **Target Web Asset**: `apps/web/public/media/occasions/occasions-private-dining.jpg`
- **Visual**: Secluded indoor dining booth with curved cream leather banquettes, olive green cushions, white marble/terrazzo table set with glassware/napkins, and wooden lattice cane privacy partitions.
- **Constraints**:
  - Preserve `aspect-[4/5]` geometry, responsive column width, and hover scale animation.
  - Recommended focal treatment: `object-position: center 45%` (or natural center).
  - Represents "a GEMA space suitable for private dining" — environmental representation only.
  - Alt text: GEMA private dining booths.

### C. Strictly Preserved Media Slots (DO NOT MODIFY)
- **Category 02: Weddings**: Retain current stock media. No authentic wedding photos exist in the current Drive pool. Defer to future CMS/admin upload.
- **Category 03: Birthdays**: Retain current stock media. No authentic birthday photos exist in the current Drive pool. Defer to future CMS/admin upload.
- **Brand Exclusives (Mondial, Frank & Co, Maharva)**: Retain current stock media. No authentic documentary assets exist in the current Drive pool for these specific partnerships. Defer to future CMS/admin upload.

---

## 2. Files to Create
- `apps/web/public/media/occasions/occasions-hero.jpg` (Optimized progressive JPEG, ~2100px width, quality ~86)
- `apps/web/public/media/occasions/occasions-private-dining.jpg` (Optimized progressive JPEG, 4:5 aspect ratio, 1200x1500px, quality ~86)

## 3. Files to Modify
- `apps/web/src/components/occasions/OccasionsClient.tsx` (Update hero image `src` to `/media/occasions/occasions-hero.jpg` and check alt text/styling)
- `apps/web/src/content/fixtures/occasions.ts` (Update `occasionCategories[0].image` to `/media/occasions/occasions-private-dining.jpg`)
- `.agents/TASKS.md` (Register GEMA-020A with status and notes)

---

## 4. Out-of-Scope / Untouched Systems
- Homepage, Menu, Experience, Events, Journal, Recognition, Visit, About: UNTOUCHED.
- ReservationOverlay, WhatsApp flow, form logic, area/time rules, button behavior: UNTOUCHED.
- All layout, section order, copy, typography, spacing, and buttons on Occasions: UNTOUCHED.

---

## 5. QA Plan & Verification Contract
1. **Visual Parity**: Existing layout is the oracle. Zero layout shift, no margin/padding drift, no typography changes.
2. **Desktop Browser QA (~1440x900)**:
   - Authentic `occasions-hero.jpg` renders cleanly with readable white typography and visible architectural details.
   - Authentic `occasions-private-dining.jpg` renders cleanly in 4:5 geometry with visible private booths and privacy screen.
   - Weddings, Birthdays, Mondial, Frank & Co, Maharva remain visually intact with their existing media.
3. **Mobile Browser QA (~390x844)**:
   - Hero framing remains balanced and headline legible.
   - Private Dinings 4:5 framing retains booth/table context.
   - Zero horizontal overflow.
   - Inquire Now buttons trigger reservation modal cleanly.
4. **Code QA**:
   - `npm run typecheck`
   - `npm run build`
