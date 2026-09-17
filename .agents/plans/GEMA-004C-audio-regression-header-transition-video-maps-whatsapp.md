# GEMA-004C — Audio Regression, Header Theme Fix, Transition Brand Scale, Chef Video Staging, Google Maps & Direct WhatsApp Reservation

## Objective
Fix the currently observed UX regressions and complete the minimum real interactive behavior required before Netlify design staging:
1. Fix audio regression on Gateway interaction and AudioControl button state/interaction.
2. Fix header theme contrast regression on the Experience route (dark readable elements over ivory background; preserve light overlay on Home hero).
3. Scale GEMA brand mark inside `PageReveal` transition overlay to match visual requirements (Desktop: 180–220px visible wordmark; Mobile: 140–170px visible wordmark).
4. Inspect master chef video, check ffmpeg availability, report status, and maintain compliant staging fallback / playback choreography.
5. Replace decorative Visit map placeholder with real iframe-based Google Maps Embed using `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` with graceful fallback and safety documentation.
6. Direct all primary "Reserve A Table" CTAs to WhatsApp `https://wa.me/6281252200049`.

## Files to Modify
- `apps/web/src/lib/audioManager.ts`
- `apps/web/src/components/gateway/GatewayExperience.tsx`
- `apps/web/src/components/audio/AudioControl.tsx`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/PageReveal.tsx`
- `apps/web/src/content/homeAssets.ts`
- `apps/web/src/components/chef/ChefPreview.tsx`
- `apps/web/src/components/visit/VisitClient.tsx`
- `apps/web/src/components/layout/MobileReserveBar.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/components/home/Hero.tsx`
- `apps/web/src/components/events/EventDetailClient.tsx`
- `.agents/TASKS.md`
- `.agents/CONTEXT.md`

## Files to Create
- `.agents/plans/GEMA-004C-audio-regression-header-transition-video-maps-whatsapp.md` (this plan)

## In-Scope Behavior
1. **Gateway Audio & AudioControl:**
   - Synchronous invocation of audio playback on user gesture in Gateway.
   - Synchronize `userIntent` ('enabled') and singleton audio instance.
   - Correct `isPlaying` state computation (reflecting active playback without blocking on readyState > 2).
   - AudioControl toggles user intent (`enabled` <-> `disabled`) with proper z-index and click events.
   - Attenuation / ducking respects user intent (OFF stays OFF).
2. **Experience Navbar Contrast:**
   - On `/experience` (and any non-dark-hero routes), header rendered over ivory background must display dark text (`var(--espresso-900)`), dark logo/wordmark, and dark border/CTA.
   - On `/` (homepage hero), header over dark photo with transparent background retains light text/logo.
   - Scrolled state on all pages continues to show solid ivory background with dark text/logo.
3. **Transition Brand Scale:**
   - In `PageReveal.tsx`, increase logo container sizing to achieve visible wordmark width of ~180–220px on desktop and ~140–170px on mobile, accounting for transparent PNG padding.
   - Maintain aspect ratio, center alignment, and transition timing.
4. **Chef Video Staging:**
   - Inspect master video metadata. Check ffmpeg availability.
   - If ffmpeg is unavailable: stop only media conversion and report. Maintain poster fallback and threshold choreography.
5. **Google Maps Embed:**
   - Implement iframe-based Google Maps Embed for Gema Restaurant & Societiet, Jl. Musi No.32, Surabaya in `VisitClient.tsx`.
   - Read `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`.
   - If key is missing, render graceful fallback with "OPEN IN GOOGLE MAPS" link and report `MAP KEY REQUIRED`.
6. **Direct WhatsApp Reservation:**
   - All primary reservation CTAs link directly to `https://wa.me/6281252200049` (`target="_blank" rel="noopener noreferrer"`).
   - No popup modal or internal booking engine.

## Out-of-Scope Behavior
- Starting Payload CMS.
- Redesigning unrelated pages or components.
- Introducing external booking SaaS.
- Changing accepted multi-lobed blob from GEMA-004B.
- Hardcoding Google Maps API keys into repository.
- Committing the 145MB video master.

## Untouched Components
- Legacy prototype (`gema-restaurant-&-societiet/`) remains 100% untouched.
- `ReservationOverlay.tsx` remains dormant without destructive deletion.
- Cuisine categories, space preview, journal, stories, and wine sections remain visually identical.

## Dependencies
- None added. Uses existing Next.js, React, and browser APIs.

## Risks & Mitigations
- **Audio Autoplay Policy:** Browsers block unprompted audio. Mitigated by binding audio playback directly to synchronous pointer/click event on Gateway.
- **Navbar Contrast:** Hardcoded styles could break dark hero. Mitigated by refining route-aware transparent/solid state logic.
- **Maps API Key Exposure:** Mitigated by using public environment variable pattern with domain restrictions documented.

## Test Contract
- **Normal Case:**
  - Fresh session -> Gateway click -> ambient audio plays (`stillness-in-the-atrium-gema.mp3`), loop=true, vol=0.3.
  - Floating AudioControl -> click disables audio; click re-enables audio.
  - Navigate to Experience -> navbar displays dark readable text on ivory background.
  - Page transition -> visible logo wordmark is ~200px desktop / ~150px mobile.
  - Primary reservation buttons open `https://wa.me/6281252200049`.
  - Visit page -> Google Maps embed iframe renders (or clean fallback if key unset).
- **Boundary & Regression Case:**
  - Audio ducking when Chef section active: ducks to ~0.05.
  - If user sets audio OFF, scrolling past Chef never plays audio.
  - Homepage hero top state maintains light text over dark photo.
