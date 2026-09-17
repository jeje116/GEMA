# GEMA-004A: Homepage Brand, Chef Video & Backsound Integration

## Objective
Integrate real GEMA brand assets into the Next.js frontend (`apps/web`):
1. Approved GEMA light brand logo in the top-left navbar and centered within internal page transition overlays.
2. Verified chef video stream / staging fallback in the homepage chef section (replacing the pre-existing headphone visual) with organic blob visual treatment.
3. Real GEMA ambient backsound (`stillness-in-the-atrium-gema.mp3`) connected to `AudioControl`, starting upon Gateway user gesture and preserving playback continuity across internal route and locale changes.

## Files to Modify
- `apps/web/src/components/layout/SiteHeader.tsx` (Replace textual GEMA with light logo, clickable to current locale home)
- `apps/web/src/components/motion/PageReveal.tsx` (Center GEMA light logo in transition overlay curtain)
- `apps/web/src/app/[locale]/page.tsx` (Wrap homepage in PageReveal for branded transition parity)
- `apps/web/src/components/home/ChefPreview.tsx` (Replace headphone visual with organic blob chef media container)
- `apps/web/src/components/layout/AudioControl.tsx` (Connect to real audio playback manager and reflect actual audio state)
- `apps/web/src/components/motion/GatewayExperience.tsx` (Trigger audio playback on user Enter interaction)
- `.agents/TASKS.md` (Update task registry status)

## Files to Create
- `apps/web/public/media/brand/gema-logo-light.png` (Direct copy of root `GEMA_brand.png`)
- `apps/web/public/media/audio/stillness-in-the-atrium-gema.mp3` (Direct copy of root `stillness-in-the-atrium_GEMA.mp3`)
- `apps/web/src/content/media/homeAssets.ts` (Staging media manifest for chef video)
- `apps/web/src/lib/audioManager.ts` (Singleton HTMLAudioElement manager ensuring audio continuity across navigation and locale switches)

## In-Scope Behavior
- Copy `GEMA_brand.png` without modification/recoloring to `apps/web/public/media/brand/gema-logo-light.png`.
- Inspect and copy `stillness-in-the-atrium_GEMA.mp3` to `apps/web/public/media/audio/stillness-in-the-atrium-gema.mp3`.
- Verify Google Drive delivery URL for file ID `1-FyV-tjBSYFPREnlLVztF09dCSut5Zv8`. If unsuitable for direct browser `<video>` playback, stop video integration portion, set `src: ''` in manifest, and report `DRIVE VIDEO DELIVERY UNSUITABLE`.
- Replace headphone image in `ChefPreview.tsx` with responsive organic blob media container with decorative outline.
- Connect backsound to user gesture on Gateway Enter and `AudioControl` button with loop, restrained volume (0.3), and route continuity.
- Center GEMA logo in internal page transitions.
- Maintain full accessibility (`aria-label`, `prefers-reduced-motion`).

## Out-of-Scope Behavior
- Full homepage asset migration.
- Modifications to unrelated pages or fixtures.
- Payload CMS integration.
- Netlify deployment.
- Modifying or recompressing master audio without approval.
- Modifying legacy Vite app (`gema-restaurant-&-societiet/`).
- Introducing third-party video hosting services without authorization.

## Verification Plan
1. `npm run typecheck` in `apps/web` must exit 0.
2. `npm run build` in `apps/web` must exit 0.
3. Runtime browser testing:
   - Navbar brand logo display and click navigation.
   - Branded page transition overlay display.
   - Chef section layout, removal of headphone visual, and organic blob styling.
   - Audio playback on Gateway Enter, AudioControl toggle, and navigation continuity across `/en` and `/id`.
