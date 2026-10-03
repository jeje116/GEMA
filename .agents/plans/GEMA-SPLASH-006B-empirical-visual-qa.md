# GEMA — SPLASH-006B: Real Empirical Visual QA & Validation

## Objective
Validate the SPLASH-006A Fullscreen Background + Responsive Content Composition architecture using empirical browser-rendered screenshot evidence across all 13 mobile and 4 desktop viewports. Eliminate mathematical divider modeling (`63.94%`) as the primary oracle and replace with visual screenshot audits and labeled contact sheets.

## Verification Scope & Artifacts
1. **Stable Non-Visual QA Selectors**: Added `data-splash-element` attributes (`media-layer`, `poster-fallback`, `video-stream`, `motto`, `logo`, `italian-food`, `divider`, `welcome`, `good-food`, `accent`, `loading`, `progress`, `est`, `taste`) with zero styling or accessibility impact.
2. **Visual Contact Sheets**:
   - `mobile_contact_sheet.png`: 4×4 grid of all 13 mobile viewports with ratio labels and PO baseline highlight.
   - `desktop_contact_sheet.png`: 2×2 grid of all 4 desktop viewports with ratio labels.
3. **Empirical Screenshot Audits**:
   - All 13 Mobile Viewports: 360×800, 375×812, 390×700, 390×780, 390×844 (PO baseline), 390×900, 402×874, 412×915, 430×760, 430×850, 430×932, 480×800, 540×960.
   - All 4 Desktop Viewports: 1280×720, 1366×768, 1440×900, 1920×1080.
4. **Fluid Model Refinements Verified**:
   - Group A (Top Brand): `top: clamp(3rem, 7.5dvh, 4.5rem)` ensures motto `CUCINA` clears top-left botanical leaves with >= 17px breathing room even on short viewports (390×700) while maintaining balanced whitespace above building roof.
   - Group D (Bottom Metadata): `paddingLeft: clamp(1.8rem, 7dvw, 2.8rem)`, `paddingRight: clamp(1.8rem, 7.5dvw, 2.8rem)`, `paddingBottom: clamp(1.8rem, 5.8dvh, 2.8rem)` keeps `EST. 2020` and `A TASTE OF ITALY ALWAYS` positioned inside the inner gold frame line and clear of foliage.
   - Welcome Region: Fluid tracking `top: calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1rem, 2.8dvh, 1.8rem))` guarantees consistent 20px–27px clearance below the visible video divider across all ratios.
5. **Functional Invariants**:
   - Desktop and Mobile local video stream playback verified.
   - Seamless video loop continuity verified.
   - Reduced motion still fallback verified.
   - Click to enter dismisses Gateway immediately.
   - Synchronous ambient audio gesture satisfaction verified.
   - Homepage scroll normalization to `scrollY === 0` verified.
6. **Code QA**:
   - `npm run typecheck` passed (0 errors).
   - `npm run build` passed (Turbopack production build, 47/47 static pages generated).
