# GEMA — SPLASH-007: Freeze Approved Splash / Gateway Baseline

## Objective
Establish governance and durability for the accepted SPLASH-006B Splash/Gateway baseline across the repository. Lock the fullscreen background architecture, fluid responsive content model, corrected logo asset, local video delivery, approved QA instrumentation selectors, and canonical regression testing script.

## Frozen Baseline Contract (ADR-014)
1. **Architecture**:
   - **Background**: Fullscreen media (`100vw × 100dvh`, `object-fit: cover`, `object-position: center`). Zero letterboxing, zero black/white margins, proportional crop allowed.
   - **Content**: Fluid aspect-ratio responsive composition. Fixed-ratio contained artboards (`aspect-[9/16]`) and letterboxed viewports are strictly prohibited.
2. **Visual State**:
   - **Group A (Top Brand Group)**: `top: clamp(3rem, 7.5dvh, 4.5rem)`.
   - **Group B & C (Welcome & Loading Group)**: `top: calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1rem, 2.8dvh, 1.8rem))`.
   - **Group D (Bottom Metadata)**: `paddingLeft: clamp(1.8rem, 7dvw, 2.8rem)`, `paddingRight: clamp(1.8rem, 7.5dvw, 2.8rem)`, `paddingBottom: clamp(1.8rem, 5.8dvh, 2.8rem)`.
   - **Desktop**: Fullscreen media with centered overlay matching the 1672×941 desktop oracle. Progress bar rendered above `LOADING...` at `top-[89%]`.
3. **Assets**:
   - `apps/web/public/media/splash/gema-dark.png`: Unclipped mark with 16px transparent safety padding.
   - `/media/splash/gema-splash-desktop.mp4` and `/media/splash/gema-splash-mobile.mp4`: Local same-origin MP4 assets with continuous loop and fast-start moov atom.
4. **QA Instrumentation**:
   - Non-visual `data-splash-element="..."` attributes preserved in `GatewayExperience.tsx`.
5. **Canonical QA Script**:
   - `apps/web/scripts/qa-splash-006b.cjs` established as the authoritative empirical regression test.
6. **Regression Gate**:
   - Any future modification to `GatewayExperience.tsx` requires verification across all 10 invariants: fullscreen media, zero letterbox, logo completeness, divider/Welcome clearance, loading hierarchy, bottom metadata, mobile responsive composition, click-to-enter, ambient audio unlock gesture, Homepage `scrollY === 0` normalization.
7. **Baseline Status**:
   - **FROZEN**. Modifying Gateway visual behavior incidentally during unrelated work is prohibited.
