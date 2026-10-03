# SPLASH-001: Splash Screen Redesign with Google Drive Video Sources

Implementation contract for redesigning the GEMA entry / gateway experience using Google Drive video sources and static visual oracles.

---

## 1. Objective & Requirements Summary
- **Goal**: Transform the GEMA Splash / Gateway screen into a living scene powered by Google Drive video sources, while matching the composition, typography, and visual hierarchy of the authoritative reference images.
- **Authoritative Assets**:
  - **Desktop Reference Image**: `ChatGPT Image Sep 22, 2026, 03_30_22 PM.png` (File ID: `1eL4Dj20uAJ21yGeDZ7c-zgqhT186C0Yx`, 1672 × 941, `/media/splash/desktop-ref.png`)
  - **Mobile Reference Image**: `ChatGPT Image Sep 22, 2026, 03_30_18 PM.png` (File ID: `1W6472_3_IBC4e4Fe2yjltNhQRUrD2QSL`, 941 × 1672, `/media/splash/mobile-ref.png`)
  - **Desktop Video**: `Leaves_Animate_the_provided_image_int (1).mp4` (File ID: `19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz`, 1280 × 720, 10s loop)
  - **Mobile Video**: `Leaves_Animate_the_provided_image_int.mp4` (File ID: `1uNOiyFIl29En3thRJnntpemLX6r4rJ6o`, 720 × 1280, 10s loop)
- **Temporary Video Hosting Strategy**:
  - Use Google Drive direct file-serving endpoints derived from the supplied file IDs:
    - Desktop: `https://drive.usercontent.google.com/download?id=19wGXqoFUtY_RIDN2TGkecGKepzQjcTyz&export=download`
    - Mobile: `https://drive.usercontent.google.com/download?id=1uNOiyFIl29En3thRJnntpemLX6r4rJ6o&export=download`
  - No local copying/downloading of MP4 files into `public/`.
  - Fallback Rule: If video fails to load, cannot autoplay, stalls, or is blocked by browser cross-origin policy (e.g. Chromium ORB `cross-origin-resource-policy: same-site`), gracefully render the matching reference image (`desktop-ref.png` / `mobile-ref.png`) without black flash or broken UI.
  - Video must be `autoPlay`, `muted`, `loop`, `playsInline`, background-only, non-blocking.
- **Visual Composition Discovery**:
  - The video files contain only the architectural villa illustration, moving background foliage/shadows, and the outer arch/border frame. They contain NO overlay typography or branding.
  - Therefore, all typography, logos, divider rules, and progress bar are rendered as a precise DOM overlay matching the visual oracles.
- **Preserved Functional Invariants**:
  - Click/tap anywhere enters website.
  - Click triggers ambient audio (`audioManager.startFromUserGesture()`).
  - Homepage lands strictly at `window.scrollY === 0`.
  - Transition out: smooth slide-up (`exit={{ opacity: 0, y: '-100%' }}`).
  - `prefers-reduced-motion`: Render matching reference still image without video animation.

---

## 2. Scope & Blast Radius
- **FILES TO MODIFY**:
  - `apps/web/src/components/motion/GatewayExperience.tsx`
- **FILES TO CREATE**:
  - `.agents/plans/SPLASH-001-splash-screen-redesign-gdrive-video.md`
  - `apps/web/scripts/qa-splash-001.cjs`
  - Extracted transparent brand assets in `apps/web/public/media/splash/` (`gema-dark.png`, `welcome.png`)
- **IN-SCOPE BEHAVIOR**:
  - Responsive video background with Google Drive runtime endpoints.
  - Responsive visual fallback to `desktop-ref.png` / `mobile-ref.png` upon error/stall.
  - Desktop overlay typography matching `desktop-ref.png` (top badge, Gema logo, right-aligned motto, divider with quatrefoil, Welcome, subtitle, loading bar, bottom corner notes).
  - Mobile overlay typography matching `mobile-ref.png` (centered badge, Gema logo, centered motto, Welcome, subtitle, loading bar, bottom corner notes).
  - Calm, restrained fade-in motion.
  - Ambient audio trigger and scroll normalization preservation.
- **OUT-OF-SCOPE BEHAVIOR**:
  - No modifications to homepage sections (Hero, Positioning, Dishes, Reviews, Space, Chef, Events, Visit).
  - No modifications to Menu, Reservation, Header, Footer, Audio manager architecture, or Payload CMS.

---

## 3. Implementation Steps

### Step 1: Prepare Clean Transparent Typography Overlay Assets
- From `desktop-ref.png`:
  - `gema-dark.png`: Dark espresso cursive "Gema" + "restaurant & societiet" with transparent background.
  - `welcome.png`: Dark espresso cursive "Welcome" with transparent background.
  - Save cleanly into `apps/web/public/media/splash/`.

### Step 2: Implement GatewayExperience.tsx
- Structure:
  - Responsive viewport detection (`isMobile` / media query hook or responsive CSS container).
  - Video container with `<video autoPlay muted loop playsInline>` targeting Google Drive endpoints.
  - Fallback `<img src="/media/splash/desktop-ref.png" | "/media/splash/mobile-ref.png">` that renders whenever `useFallback === true` or `prefersReducedMotion === true`.
  - Overlay layer with pointer-events-none:
    - **Top Bar**: `CUCINA • BUONA COMPAGNIA • BELLA VITA` (condensed uppercase tracking-widest, color `#4a382c`).
    - **Header Block**:
      - "Gema" brand cursive logo.
      - Desktop: "ITALIAN FOOD BRINGS PEOPLE TOGETHER" placed to the right of Gema.
      - Mobile: "ITALIAN FOOD BRINGS PEOPLE TOGETHER" placed centered below Gema.
    - **Divider**:
      - On Desktop: Gold hairline with central quatrefoil ornament between villa and Welcome.
      - On Mobile: Preserved naturally from background video / fallback image.
    - **Welcome Block**:
      - "Welcome" cursive logo.
      - "GOOD FOOD. BRIGHTER DAYS." (all caps, spaced serif/condensed, color `#5a4537`).
    - **Loading Bar**:
      - "LOADING..." (condensed uppercase tracking-widest text).
      - Delicate rounded progress bar with animated gold fill.
    - **Bottom Bar**:
      - Left: `EST. 2020` with delicate underline.
      - Right: `A TASTE OF ITALY ALWAYS` (multiline on desktop & mobile).
  - Interactive click anywhere: Full-screen `<motion.button>` with keyboard accessibility (`Enter`, `Space`).
  - Audio trigger: Calls `audioManager.startFromUserGesture()`.
  - Scroll normalization: Forces `scrollY === 0`.

### Step 3: Empirical Browser QA & Verification
- Execute comprehensive Playwright script (`apps/web/scripts/qa-splash-001.cjs`):
  - Desktop (1440×900) layout, typography, and fallback/playback.
  - Mobile (390×844) layout, typography, and fallback/playback.
  - Error simulation: Verify fallback image displays without black screen or broken icon.
  - Enter click: Verify `audioManager.startFromUserGesture()` is called and homepage lands at `scrollY === 0`.
  - Static Code QA: `npm run typecheck` and `npm run build`.
