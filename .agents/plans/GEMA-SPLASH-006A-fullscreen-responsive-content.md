# GEMA — SPLASH-006A: Fullscreen Background + Responsive Content Composition

## Objective
Correct the Splash architecture by removing the contained fixed-ratio artboard approach (which caused letterboxing/empty bands) and establishing a true Fullscreen Background (`100vw × 100dvh`, `object-fit: cover`) paired with an Aspect-Ratio-Responsive Content Composition model across all mobile and desktop viewports.

## Core Architectural Invariants
1. **Background Media**: Always true fullscreen (`position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center;`). No letterboxing, no white/black bands, no empty margins.
2. **Responsive Content Layer**: The DOM overlay adapts to viewport aspect ratio rather than forcing a rigid bounding box:
   - **Group A (Top Brand)**: `CUCINA • BUONA COMPAGNIA • BELLA VITA` -> `Gema restaurant & societiet` (unclipped logo) -> `ITALIAN FOOD BRINGS PEOPLE TOGETHER`. Managed in a unified vertical flex stack at `clamp(1rem, 4.5dvh, 3rem)` so internal elements never collide.
   - **Group B & C (Welcome & Loading Group)**: Positioned dynamically via fluid CSS calculation:
     `top: calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1rem, 2.8dvh, 1.8rem))`
     This continuously tracks below the visible architectural center divider across all viewport aspect ratios (tall, square, wide/short), guaranteeing a stable 20px–27px clearance and zero collision with the Welcome script.
   - **Group D (Bottom Metadata)**: `EST. 2020` and `A TASTE OF ITALY ALWAYS` positioned along bottom safe area with `paddingBottom: clamp(1.5rem, 5dvh, 3rem)`, completely clear of botanical artwork.
3. **Desktop**: Fullscreen media with `object-fit: cover` and centered overlay matching the 1672×941 composition with desktop ordering (progress bar above `LOADING...`).

## Verified Viewports
- Mobile: 360×800, 375×812, 390×700, 390×780, 390×844, 390×900, 402×874, 412×915, 430×760, 430×850, 430×932, 480×800, 540×960.
- Desktop: 1280×720, 1366×768, 1440×900, 1920×1080.
- All pass fullscreen edge-to-edge assertion, zero collision, and functional tests (click-to-enter, scrollY 0 reset, loop, audio gesture).
