# SPLASH-002: Replace Failed Google Drive Video Delivery with Local Same-Origin Video Assets

Implementation contract to replace the blocked Google Drive video URLs with reliable same-origin local video assets while strictly preserving the approved SPLASH-001 visual and interaction architecture.

---

## 1. Objective & Delivery Strategy
- **Background**: SPLASH-001 empirically proved that Google Drive direct download endpoints cannot stream HTML5 `<video>` to modern web browsers due to mandatory server headers (`cross-origin-resource-policy: same-site`, `content-disposition: attachment`) which trigger browser-level ORB (`net::ERR_BLOCKED_BY_ORB`) and CORS rejection.
- **Resolution**: Transition runtime video delivery to same-origin static assets served directly from `apps/web/public/media/splash/`:
  - Desktop: `/media/splash/gema-splash-desktop.mp4` (from Drive file `19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz`, 1280 × 720)
  - Mobile: `/media/splash/gema-splash-mobile.mp4` (from Drive file `1uNOiyFIl29En3thRJnntpemLX6r4rJ6o`, 720 × 1280)
- **Zero Google Drive Runtime Requests**: Remove all runtime requests to `drive.google.com` or `drive.usercontent.google.com`. Google Drive remains source provenance only.
- **Visual & Interaction Fidelity**:
  - The videos provide the living background motion (villa illustration, waving foliage, moving shadows, arch frame).
  - The DOM overlay provides the typography and branding (`CUCINA • BUONA COMPAGNIA • BELLA VITA`, `Gema`, `ITALIAN FOOD BRINGS PEOPLE TOGETHER`, divider, `Welcome`, `GOOD FOOD. BRIGHTER DAYS.`, `LOADING...`, `EST. 2020`, `A TASTE OF ITALY ALWAYS`).
  - While video loads or if error occurs, the visual oracle poster (`desktop-ref.png` / `mobile-ref.png`) is visible underneath with zero black/white flash.
  - When video reaches playable state (`canplay`/`playing` with advancing `currentTime`), it transitions unobtrusively to the moving video, and DOM overlay is visible with zero duplicate text.
  - Video loops seamlessly every ~10s without restarting or re-animating the stable DOM overlay.
  - Preserved: Click anywhere to enter, `audioManager.startFromUserGesture()`, `window.scrollY === 0`, and reduced motion still image.

---

## 2. Scope & Blast Radius
- **FILES TO MODIFY**:
  - `apps/web/src/components/motion/GatewayExperience.tsx`
  - `.agents/TASKS.md`
- **FILES TO CREATE**:
  - `apps/web/public/media/splash/gema-splash-desktop.mp4`
  - `apps/web/public/media/splash/gema-splash-mobile.mp4`
  - `.agents/plans/SPLASH-002-local-same-origin-video-delivery.md`
  - `apps/web/scripts/qa-splash-002.cjs`
- **UNTOUCHED COMPONENTS**:
  - Homepage sections, Menu, Reservation, Header, Footer, Chef, Recognition, Visit, Events, Audio manager architecture, Route architecture, Payload CMS.

---

## 3. Implementation Steps

### Step 1: Install Local Same-Origin Video Assets
- Copy `/tmp/desktop-video.mp4` -> `apps/web/public/media/splash/gema-splash-desktop.mp4`
- Copy `/tmp/mobile-video.mp4` -> `apps/web/public/media/splash/gema-splash-mobile.mp4`
- Verify files exist and match exact byte counts (2,788,643 bytes and 2,491,002 bytes).

### Step 2: Update GatewayExperience.tsx
- Replace Drive video URLs with same-origin URLs:
  - `DESKTOP_VIDEO_URL = '/media/splash/gema-splash-desktop.mp4'`
  - `MOBILE_VIDEO_URL = '/media/splash/gema-splash-mobile.mp4'`
- Ensure responsive source loading: Desktop loads desktop MP4, Mobile loads mobile MP4.
- Ensure seamless video -> poster transition:
  - While video initializes: poster (`desktop-ref.png` / `mobile-ref.png`) is visible.
  - Once video starts playing (`onPlaying`): video smoothly cross-fades in.
  - When video is active, DOM overlay is displayed on top of the textless video.
  - If video fails: fallback image remains active with zero broken UI.
  - If `prefersReducedMotion`: video is not rendered; still image is displayed.

### Step 3: Empirical Browser QA & Verification
- Execute comprehensive Playwright script (`apps/web/scripts/qa-splash-002.cjs`):
  - Desktop (1440×900): verify same-origin MP4 request, HTTP 200, `readyState >= 3`, `currentTime` advances > 0.5s, visible movement, 0 Drive requests, 0 black flash, overlay matches reference, enter click works, `scrollY === 0`.
  - Mobile (390×844): verify mobile MP4 request, `currentTime` advances > 0.5s, loop works, 0 overflow, 0 black flash.
  - Loop verification: observe beyond 10s duration, verify loop back to 0 without breaking.
  - Fallback simulation: simulate video failure and confirm fallback to reference image.
  - Static Code QA: `npm run typecheck` and `npm run build`.
