# GEMA — SPLASH-006: Fix Splash Responsive Composition Across Mobile Widths

## Objective
Establish a single unified responsive artboard composition model for the GEMA Splash Experience (`GatewayExperience.tsx`) so that background video/poster media and DOM overlay elements live in the exact same coordinate system, preventing aspect-ratio drift, element-crop divergence, and collision between the architectural divider/quatrefoil and the Welcome wordmark across all mobile and desktop viewports.

## Scope & Blast Radius
- Primary target file: `apps/web/src/components/motion/GatewayExperience.tsx`
- Preserved assets: `apps/web/public/media/splash/gema-dark.png` (SPLASH-005B unclipped logo, untouched), MP4 video files untouched.
- Preserved functional contracts: SPLASH-004 hierarchy and ordering, click-to-enter, homepage scroll normalization (`scrollY = 0`), audio gesture triggering, loop playback, reduced-motion fallback.

## In-Scope Behavior
1. Replace detached root-viewport `object-cover` video background and separate `max-w-[56.3vh]` overlay wrapper with a single, unified Responsive Artboard container.
2. Mobile Artboard:
   - Aspect ratio: `941 / 1672` (exact visual oracle ratio ~ 0.5628).
   - Proportional scale within available viewport: `w-full h-full max-w-[calc(100dvh*(941/1672))] max-h-[calc(100dvw*(1672/941))] mx-auto my-auto overflow-hidden`.
   - Both background media (poster/video) and DOM overlay occupy `absolute inset-0 w-full h-full` of the artboard.
   - Fit strategy: Contain (preserves 100% complete composition without edge-to-edge cropping; surrounding background blends seamlessly into gateway `#F6F1EA`).
3. Desktop Artboard:
   - Aspect ratio: `1672 / 941` (exact visual oracle ratio ~ 1.7768).
   - Proportional scale within available viewport: `w-full h-full max-w-[calc(100dvh*(1672/941))] max-h-[calc(100dvw*(941/1672))] mx-auto my-auto overflow-hidden`.
   - Shared coordinate system for desktop media and DOM overlay.
4. Position Calibration (Oracle Ground Truth):
   - Welcome Script positioned to ensure minimum clear visual separation (no collision, no tangent) with the architectural center divider/quatrefoil.
   - Oracle divider ends at `y = 63.94%`; Welcome centered at `70.25%` (top `66.39%`), providing a clear 2.45% artboard height safety clearance.
   - Lower group order preserved: `GOOD FOOD. BRIGHTER DAYS.` -> gold hairline accent -> `LOADING...` -> progress bar.
   - Bottom corner copy (`EST. 2020` and `A TASTE OF ITALY ALWAYS`) positioned clearly inside safe margin, away from foreground botanical artwork.

## Verification Matrix
- Mobile sizes: 360×800, 375×812, 390×844, 402×874, 412×915, 430×932, 480×800, 540×960.
- Variable height tests at same width: 390×700..900, 430×760..932.
- Continuous resize: 360px → 540px.
- Desktop sizes: 1280×720, 1440×900, 1920×1080.
- Functional verification: Click to enter, audio start, scroll reset, loop, fallback, reduced motion.
- Code QA: Typecheck and build passes.
