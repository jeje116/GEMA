# GEMA-004B: Homepage Audio Choreography, Brand Scale & Chef Media Refinement

## Objective
Refine the GEMA frontend based on empirical findings from GEMA-004A:
1. **Landing / Gateway Audio Behavior**: Explicit user click to enter starts ambient soundtrack, loops with restrained volume (~0.30), without autoplay prior to interaction.
2. **Distinct User Intent vs System Attenuation**: Separate user intent (`enabled` vs `disabled`) from temporary ducking (`normal` vs `ducked`). Ducking never enables audio if user set it OFF.
3. **Smooth Audio Ducking**: When Chef media enters active viewport, smooth volume attenuation from ~0.30 to ~0.05 over 400–800ms. Restores to normal volume upon exit ONLY if user intent is enabled.
4. **Hysteresis Viewport Observation**: Native `IntersectionObserver` with enter threshold (~0.45) and exit threshold (~0.22) to prevent boundary oscillation. No continuous scroll listeners.
5. **Chef Video Lifecycle Ready**: Muted, playsInline, loop, autoPlay on visibility, pause on exit, with poster fallback while source is unsupplied.
6. **Navbar Logo Scale**: Increase visible wordmark width to ~70–90px on desktop and ~60–80px on mobile while preserving navbar height and layout.
7. **Multi-Lobe Organic Chef Blob & Decorative Outline**: Replace simple oval with an asymmetric editorial multi-lobed vector contour using SVG clipPath (`objectBoundingBox`) and matching non-scaling terracotta outline.
8. **Responsive and Accessible**: Responsive at 1440px desktop and 390px mobile, respecting `prefers-reduced-motion`.

## Files to Modify
- `apps/web/src/lib/audioManager.ts` (Implement distinct user intent, ducking state, and smooth volume ramping)
- `apps/web/src/components/layout/SiteHeader.tsx` (Increase visual wordmark width to 70–90px desktop / 60–80px mobile)
- `apps/web/src/components/home/ChefPreview.tsx` (IntersectionObserver with hysteresis, multi-lobed SVG clipPath, matching decorative outline, audio ducking lifecycle)
- `apps/web/src/components/motion/GatewayExperience.tsx` (Ensure user gesture sets userIntent to enabled and begins playback)
- `.agents/TASKS.md` (Update task registry)

## Verification Plan
1. `npm run typecheck` passes with 0 errors.
2. `npm run build` passes with 0 errors.
3. Runtime QA in browser:
   - Gateway enter starts audio.
   - Floating audio button toggles ON/OFF.
   - If audio is OFF, scrolling to Chef section never enables it.
   - If audio is ON, scrolling into Chef section smoothly fades volume to ~0.05.
   - Scrolling out of Chef section smoothly restores volume to ~0.30.
   - Navbar logo is visibly larger (wordmark ~70–90px desktop, ~60–80px mobile).
   - Chef blob is visibly multi-lobed and organic with matching terracotta outline.
   - Desktop 1440px and Mobile 390px layouts pass.
