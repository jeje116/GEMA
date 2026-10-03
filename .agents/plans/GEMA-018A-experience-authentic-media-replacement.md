# GEMA-018A — Experience Page Authentic Media Replacement

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-19
Scope: Source-only replacement of visual media slots on the Experience page (`/experience`) using approved authentic Google Drive photography. Zero layout, copy, typography, spacing, or structural changes.

---

## 1. Locked Approvals & Directives

### A. Section 1 — Hero / "A Place to Linger"
- **Source**: `QAR03930.jpg`
- **Target Web Asset**: `apps/web/public/media/experience/experience-hero.jpg`
- **Visual**: GEMA's sunlit dining terrace with black/white diamond checkered tile flooring, woven bistro armchairs, marble tables, tropical greenery behind glass, and scalloped awning.
- **Constraints**:
  - Preserve existing parallax container (`h-screen min-h-[600px]`, `yImage: [0, 150]`).
  - Preserve `className="w-full h-full" imgClassName="brightness-[0.7]" priority`.
  - Alt text updated appropriately.

### B. Section 2 — Day to Night: Morning Light
- **Source**: `B0B59315-6AFD-4FF2-BBCE-1D64796313E7.jpg`
- **Target Web Asset**: `apps/web/public/media/experience/experience-day-morning.jpg`
- **Visual**: Intimate dining table bathed in morning sunlight, emerald green glazed tile tabletop, brass "Welcome to Gema" stand, yellow flowers, and striped banquette cushion.
- **Constraints**:
  - Preserve `aspect-[4/5] mb-6` geometry exactly.
  - Crop centered on sunlit tabletop, brass stand, and flowers.

### C. Section 3 — Day to Night: Evening Shadows (DO NOT REPLACE)
- **Status**: AUTHENTIC REPLACEMENT DEFERRED — NO SEMANTICALLY SAFE AUTHENTIC EVENING PHOTO AVAILABLE.
- **Decision**: Retain existing Unsplash stock photo (`photo-1514933651103-005eec06c04b`) temporarily until dedicated low-light evening photography is captured and integrated via CMS.
- **Strict Invariants**:
  - Do NOT replace with `FNR06860.jpg` (which was taken in bright daylight).
  - Do NOT artificially darken or grade any photo to simulate night.
  - Preserve `aspect-video mb-6` geometry.

### D. Section 4 — Day to Night: Culinary Details
- **Source**: `FNR06840.jpg`
- **Target Web Asset**: `apps/web/public/media/experience/experience-culinary-details.jpg`
- **Visual**: Stack of ceramic saucers embossed with GEMA's scripted "G" monogram on green fluted ceramic bar counter.
- **Constraints**:
  - Preserve `aspect-square mb-6 w-3/4 ml-auto` geometry exactly.
  - Crop centered 1:1 on stacked monogram saucers and fluted counter.

### E. Section 5 — The Materials (STRICTLY PRESERVE)
- **Treatment**: 4 material color swatches (`#8B5A47`, `#E8E4D9`, `#B5A18C`, `#2C2420`).
- **Decision**: Strictly preserve. No image replacements, no color changes, no structural modifications.

---

## 2. Files to Create
- `apps/web/public/media/experience/experience-hero.jpg` (Optimized progressive JPEG, 2100px width, quality ~86)
- `apps/web/public/media/experience/experience-day-morning.jpg` (Optimized progressive JPEG, 4:5 aspect ratio, 1200x1500px, quality ~86)
- `apps/web/public/media/experience/experience-culinary-details.jpg` (Optimized progressive JPEG, 1:1 aspect ratio, 1000x1000px, quality ~86)

## 3. Files to Modify
- `apps/web/src/components/experience/ExperienceClient.tsx` (Update image `src` and `alt` properties for Hero, Morning Light, and Culinary Details; Evening Shadows and The Materials strictly untouched).
- `.agents/TASKS.md` (Register GEMA-018A with status and notes).

---

## 4. Out-of-Scope / Untouched Systems
- Homepage (`apps/web/src/components/home/*`)
- Menu (`apps/web/src/components/menu/*`)
- Events, Journal, Occasions, Visit, Recognition, About
- Reservation system and shared overlays
- Brand, layout, audio, navbar, footer
- All copy, translations, and editorial text

---

## 5. QA Plan & Verification Contract
1. **Visual Parity**: Pre-implementation layout is the oracle. Zero layout shift, no margin/padding drift, no typography changes.
2. **Browser QA**:
   - Desktop (~1440x900): Hero parallax check, Morning Light 4:5 check, Evening Shadows Unsplash retention check, Culinary Details 1:1 check, Materials 4 swatches check.
   - Mobile (~390x844): Responsive framing, focal crop survival, zero horizontal overflow.
3. **Code QA**:
   - `npm run typecheck`
   - `npm run build`
