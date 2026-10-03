# GEMA — Technical Context

Last reviewed: 2026-09-16 (post GEMA-003A)

This file describes CURRENT VERIFIED SYSTEM FACTS.

It is not a wishlist and not an architecture proposal.

Update it only when the actual system state changes.


---

## 1. Project

Name:

GEMA

Purpose:

Public-facing web application with future admin-managed content and event functionality.


---

## 2. Current Frontend & Backend Stack

Current stack:

- Next.js 16.3.3 (App Router, Turbopack)
- React 19.0.0
- TypeScript 5.8.2
- Payload CMS 3.90.1 (co-located in `apps/web`)
- PostgreSQL 16 (via `@payloadcms/db-postgres` and Drizzle migrations)
- Local persistent filesystem media storage (`apps/web/public/media/cms/` -> host `/opt/gema/data/media/`)
- Lexical Rich Text (`@payloadcms/richtext-lexical`)
- Tailwind CSS v4
- motion/react (Framer Motion)
- Lucide React

Package management:

- npm with `package-lock.json` in root and `apps/web/package-lock.json`.

---

## 3. Repository & Application Directory

Repository root:

`D:\Projects\GEMA` / `/Users/jasonsjanuard/Desktop/GEMA` (tracked on branch `main`)

Remote origin:

`https://github.com/jeje116/GEMA.git`

Current active application source:

`apps/web/`

---

## 4. Content & CMS Architecture (Post CMS-005 Closure)

**CMS APPLICATION DEVELOPMENT COMPLETE.**

- **Task Statuses**:
  - CMS-001: CLOSED
  - CMS-002: CLOSED
  - CMS-003: CLOSED
  - CMS-004: CLOSED
  - CMS-005: CLOSED
  - CMS-006: CLOSED
  - CMS-007: CLOSED
  - CMS-008: CLOSED
  - CMS-009: CLOSED
  - CMS-009A: CLOSED
  - CMS-009B: CLOSED
  - UAT-001: CLOSED / DONE
  - AUDIO-001: CLOSED / DONE
  - RES-001: CLOSED
  - RES-002: CLOSED / PASS
  - DEV-HTTPS-001: CLOSED / PASS

- **UAT-001 Architectural Facts**:
  - **Gateway Lifecycle**: Mounted strictly in `(frontend)` route group. Appears on every full document load / refresh of public routes. Dismissal is maintained across client-side SPA navigation during the document lifecycle. Never appears on `/admin` or `/api/*`. `gemaAudioPref` in localStorage is preserved; no `gema_gateway_seen` persistence. On Homepage (`/en`, `/id`) full document load/refresh, scroll is normalized to `window.scrollY === 0` via temporary manual scroll restoration and `main.focus({ preventScroll: true })` with zero visible jump; non-homepage routes and SPA transitions remain unhindered.
  - **Footer Social**: Handles displayed without leading `@` (`gema.surabaya`); destination URLs derived from `SiteSettings`.
  - **Menu Presentation**: All Signature UI indicators (legend, dots, badges) removed from Menu. `MenuItem.signature` remains in schema as dormant (0 runtime consumers; POTENTIALLY DEAD).
  - **Experience Materials**: 4 optional Media slots (`materialImage01`..`04`) in `PageMedia.experience`. Transitional presentation fallback to color swatches remains active until Product Owner populates the 4 CMS media relationships; 0 fake photos inserted.
  - **Homepage Recognition**: Completely removed from Homepage layout and schema (`recognitionIntro` dropped from published and version tables via migration). Admin groups renumbered 01 to 10.
  - **Journal as Strict Oracle & Editorial Parity**:
    - Journal refactored into shared `EditorialListingPage` and `EditorialDetailPage` with zero visual drift from captured baseline.
    - Single main image policy (`coverImage` + localized `imageCaption` in `<figure>` / `<figcaption>`).
    - Body image upload disabled in Lexical rich text editor for both Journal and Recognition; legacy upload nodes in CMS data are treated as non-rendering content without calling `resolveMedia` or rendering body images.
    - `resolveMedia` hardened: `null / undefined` cleanly returns empty media (0 console noise); malformed non-null relations emit `console.warn` in development.
  - **Recognition Detail & Publication Guard**:
    - Standalone dynamic route `/[locale]/recognition/[slug]` with `dynamicParams = true` (new verified records resolve without redeploy).
    - `beforeChange` hook blocks transition to `contentStatus = 'verified'` unless all required editorial fields are valid (`title`, publication-ready `slug`, `year`, `awardingBody`, `scope`, `coverImage`, `excerpt`, `content`).
    - Unverified recognition detail routes return 404.
  - **Non-Blocking Follow-Up**:
    - Experience Materials currently display transitional color swatches until the Product Owner selects and populates the 4 CMS image relationships. Once populated, verify that the transitional presentation fallback is no longer rendered.

- **RES-001 Architectural Facts (Authoritative Standard Table Reservation)**:
  - **Authoritative Integration**: The official ResDiary JavaScript widget is the authoritative standard table reservation integration for GEMA Surabaya. iFrame is NOT used. Venue: `GemaSurabaya/2025`. Official Widget URL: `https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false`. Official Loader: `https://booking.resdiary.com/bundles/WidgetV2Loader.js`.
  - **Loader Lifecycle**: Widget DOM present in initial public frontend document (`#rd-widget-frame` + `#rdwidgeturl` in `ReservationOverlay`). Official loader loaded via `<Script strategy="beforeInteractive">` in `(frontend)` layout before natural window load. Initialization: NATURAL WINDOW LOAD (`window.onload`). Synthetic global load dispatch (`window.dispatchEvent(new Event('load'))`): STRICTLY PROHIBITED. Private/undocumented ResDiary initializers: STRICTLY PROHIBITED. Loader instances: 1; Widget instances: 1. Public frontend isolation verified; `/admin` and `/api/*` contamination: NONE.
  - **UX Boundary**: Standard Reservation CTAs open GEMA `ReservationOverlay` drawer hosting the ResDiary widget. GEMA owns drawer shell, transitions, and concierge fallback; ResDiary owns booking forms, party sizes, date/time pickers, and live availability. Special Occasion / Brand Event inquiries preserve their dedicated inquiry flow (`/occasions`).
  - **Widget Lifecycle**: Pre-initialized widget DOM is preserved across drawer open/close cycles (`inert`, `aria-hidden`, off-canvas translation). Zero script reinjections; zero reinitializations; zero form resets caused by drawer toggling.
  - **Accessibility**: Closed drawer enforces `inert={true}`, `aria-hidden={true}`, `pointer-events-none`; keyboard focus inside hidden widget is completely suppressed. Open drawer locks body scroll and traps focus.
  - **Failure Mode**: 8-second UX timeout notice and network/CDN error fallback offer WhatsApp concierge (`SiteSettings.whatsappNumber`). Widget container is never destroyed solely due to timeout.
  - **Production Safety**: Live production diary (`GemaSurabaya/2025`). Uncontrolled test bookings are PROHIBITED. Zero reservation submissions during implementation/QA. Zero production records created. E2E booking is `NOT VERIFIED — PRODUCTION TEST RESTRICTED`. Future E2E booking tests require a sandbox venue or explicit Product Owner authorization.
  - **Performance Trade-Off**: 13 requests (~1.88 MB uncompressed) on initial document load accepted by Product Owner to ensure natural browser lifecycle compliance without synthetic window event side effects.
  - **Supersession**: RES-001A is superseded by RES-001B where lifecycle behavior differs.

- **RES-002 Protocol & Visual Fallback Facts (Insecure HTTP vs Production HTTPS)**:
  - **Root Cause**: The broken image and compact "Reserve Now" fallback occur only when ResDiary's widget runs on an unencrypted HTTP origin (`http://localhost`). ResDiary's internal check (`rd.helpers.isOnSecurePage: function(e) { return "https:" === e.location.protocol }`) evaluates to false, activating its `insecure-fallback-book-button` template. This server-rendered template hardcodes `<img alt="Powered by ResDiary" src="" />` with an empty string, resolving to the page document URI and failing image decoding. The "Reserve Now" button is an external anchor linking to `https://www.resdiary.com/Restaurant/GemaSurabaya` (which redirects to DishCult).
  - **HTTPS Production Behavior**: On HTTPS (`https:` protocol), `isOnSecurePage` evaluates to true. ResDiary renders the full in-page interactive table reservation interface (date picker, party size, area selection, time slot controls) with a clean SVG badge from `https://widget-themes.resdiary.com/widgetthemes/newwidgetlogo1.svg` and exactly 0 broken images.
  - **Ownership & Remediation**: GEMA code defects: 0. ResDiary venue configuration defect: 0. Root cause is 100% owned by ResDiary's backend insecure fallback template. CSS masking, DOM surgery, and reverse-engineering of widget internals are strictly PROHIBITED. Plain `http://localhost` fallback is expected and not considered a GEMA regression. The local secure QA endpoint `https://localhost:3002` is the authoritative local environment for ResDiary visual QA. Do not attempt to fix ResDiary's HTTP-only fallback presentation in GEMA code.

- **Final Ownership Boundary (Post CMS-009 & UAT-001)**:
  - **PAYLOAD CMS**:
    - Page editorial content & titles (`About`, `Experience`, `Occasions`, `Visit`, `RecognitionPage.title` localized EN/ID with zero nav fallback, `EventsPage`, `JournalPage`)
    - Homepage Cuisine / Menu Teaser (4 fixed slots `item01`..`item04`: localized labels EN/ID, non-localized Media relationships; numbers `01`–`04`, layout, animation, and Menu CTA remain code-owned)
    - Homepage Reviews curation (sortable relationship to `Reviews` collection, kicker; filtered to `verified` + `isActive = true`)
    - Homepage Visit section headings (`locationHeading`, `servicesHeading`)
    - Reviews Collection (`quote`, `attribution`, `sourceType`, `sourceLabel`, `sourceUrl`, `verificationStatus`, `isActive`, `internalNotes` with delete & status guards)
    - Recognitions Collection (public query filtered to `contentStatus = 'verified'`)
    - Menu content (Categories & Items)
    - Journal content (Lexical articles & JournalPage global framing)
    - Event content (Events collection & EventsPage global framing)
    - Chef editorial content (`previewText` ACTIVE for SEO metadata description, `ctaLabel` POTENTIALLY DEAD)
    - Navigation labels/order within approved structure
    - Site Settings operational data (`fullAddress`, `locationLabel`, `mapUrl`, `phone`, `whatsappNumber`, `email`, `instagramUrl`, `tiktokUrl`, `dietaryPolicy`, `services`)
    - Content photos/videos (PageMedia & Media collection)
  - **CODE / TRANSLATIONS (`translations.ts`)**:
    - Functional controls, buttons, CTAs (`occasions.inquire`, `visit.map.open`, `visit.reserve`, `events.cta.request`, `journal.readStory`, `journal.back`, `journal.exploreMore`)
    - Dynamic state badges & meta labels (`events.now`, `events.upcoming`, `events.past`, `events.meta.*`, `events.state.concluded`, `journal.filter.all`)
    - System UI (`footer.nav`, `404.*`, loading states)
  - **CODE**:
    - Page structure & hierarchy
    - Layout/design
    - Responsive behavior
    - Animations & motion
    - Audio behavior & choreography
    - Reservation feature & logic
    - Forms & validation
    - Routes & dynamic segments
    - System/interface controls
  - **SITE SETTINGS (OPERATIONAL SINGLE SOURCE)**:
    - Identity: `restaurantName` ("GEMA Restaurant & Societiet").
    - Address: `fullAddress` (authoritative single source for Visit display, Visit map embed, and Visit SEO metadata).
    - Location presentation: `locationLabel` ("Surabaya, Indonesia").
    - Phone, WhatsApp, Email.
    - Social URLs: `instagramUrl`, `tiktokUrl`.
    - Map URL: `mapUrl`.
    - Dietary policy: `dietaryPolicy` ("No Pork, No Lard" / "Tanpa Babi, Tanpa Lemak Babi").
    - Operational services: `services`.
  - **ADMIN UX RULES (ADR-008)**:
    - Page-oriented forms: PAYLOAD ADMIN ORDER == PUBLIC WEBSITE CONTENT ORDER (top-to-bottom visual order is authoritative).
    - Code-owned / governance-held / externally managed sections: Admin-only presentational landmarks (`type: 'collapsible'`, no stored name/group).
    - Technical/system fields: placed after page-visible content or in appropriate sidebar/system areas.
    - Operational globals (Site Settings): organized by operational clarity rather than representing a single public page.
  - **GOVERNANCE HOLD (ADR-009)**:
    - Unverified Recognition records: NOT rendered on public routes. Zero fallback to fixtures.
    - Guest Reviews without verified provenance: NOT selectable for Homepage, NOT rendered on public routes. Zero fallback to fixtures.
    - If zero verified reviews exist: Homepage Reviews section is cleanly hidden (Events flows directly to Journal).
    - If zero verified recognitions exist: Homepage Recognition preview is cleanly hidden; Recognition archive page retains CMS header with 0 unverified claims.

- **Preserved Core Architecture**:
  - Local Payload Admin (`/admin`)
  - PostgreSQL 16 integration via Drizzle migrations (`apps/web/src/migrations/`)
  - Committed migrations with schema push disabled (`push: false`)
  - Content bootstrap scripts (`scripts/bootstrap-content.ts` with `--initial`, `--verify`, `--force`)
  - Password-reset utility (`apps/web/scripts/reset-admin-password.ts` with interactive hidden prompt)
  - Draft/preview architecture (dual-auth `PREVIEW_SECRET` + authenticated `admin`/`editor` user, strict path regex)
  - Draft-aware revalidation across EN and ID routes
  - RBAC & field-level access control
  - Local persistent Media storage (`apps/web/public/media/cms/` bind-mounted from `/opt/gema/data/media/` with direct Nginx public serving)

- **Next Activity**:
  - CMS architecture work is COMPLETE. No further CMS architecture work is required.
  - Future CMS work should originate only from:
    1. Concrete Product Owner UAT findings
    2. New business requirements
    3. Proven dead-code cleanup
    4. Deployment / infrastructure requirements
  - Do NOT reopen CMS-009 for unrelated feature work.


---

## 6. Testing Status

Current known state:

- No formal frontend test runner has yet been approved.
- Testing infrastructure will be selected after architecture and risk requirements are defined.
- Existing build capability should be treated separately from behavioral verification.
- GEMA-002 verified: `npm run build` succeeds, `npm run preview` serves all routes correctly.
- TypeScript typecheck (`tsc --noEmit`) passes except for the pre-existing GatewayExperience TS2367 error.


---

## 7. Product Direction

Expected future capability includes an administrator interface capable of managing event content.

Potential event content includes:

- title,
- description,
- date/time,
- image,
- video,
- publication state.

Exact schema is NOT YET LOCKED.


---

## 8. Important Constraints

- Existing approved visual design must not be independently redesigned.
- Static content should only become CMS-managed when product requirements justify it.
- Do not make all content editable merely because a CMS exists.
- Backend architecture must serve product requirements rather than force unnecessary frontend redesign.
- Avoid premature abstraction and premature scalability engineering.


---

## 9. Environment Classification

Production:
NOT YET DOCUMENTED

Development:
- Normal HTTP Development: http://localhost:3001 (via `npm run dev`)
- Secure HTTPS QA Environment: https://localhost:3002 (via `npm run dev:https`, native Node.js reverse proxy to http://localhost:3001 with WebSocket HMR forwarding, auto-generated local SAN certificate, and full inline ResDiary widget rendering). This is the authoritative local environment for ResDiary visual QA.


Testing:
NOT YET DEFINED

Deployment:
NOT YET DEFINED


---

## 10. Unknowns Requiring Future Decisions

- CMS approach
- database
- backend/API architecture
- admin authentication
- authorization model
- media storage
- image/video constraints
- publication workflow
- event date/timezone policy
- deployment environment
- testing framework


---

## 11. GEMA-004C Verified Features (Post Netlify-Staging Readiness)

- **Ambient Audio & Gateway Activation**: User click on Gateway starts audio synchronously (`stillness-in-the-atrium-gema.mp3`), loop enabled, volume ~0.30, singleton `audioManager` with reactive state synchronization and ducking support.
- **Audio Control**: Floating interactive button in bottom-right (`z-40`). Accurately toggles user intent (`enabled` <-> `disabled`). User OFF intent strictly preserved through page scrolling and viewport changes.
- **Header Contrast Mode**: Fully route-aware. Routes without dark hero media (e.g. `/experience`, `/visit`, `/menu`, `/about`) render solid ivory background with dark espresso text/logo. Routes with dark media hero (`/`, detail routes) render transparent light theme at top and switch to ivory on scroll.
- **Brand Wordmark Transition**: Centered GEMA brand mark in `PageReveal` scaled to ~200px visible width on desktop and ~155px on mobile, accounting for transparent PNG canvas ratio (0.502).
- **Chef Video Staging Loop**: Browser-compatible staging derivative created at `apps/web/public/media/video/chef-home-loop.mp4` (H.264, 18s continuous loop, 7.09MB, no audio track, fast-start moov atom at byte 32). Autoplays when in viewport (threshold >= 0.45) with ambient ducking to ~0.05; pauses when scrolled out (threshold < 0.22) restoring ambient volume.
- **Google Maps Integration**: Iframe embed contract configured with `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`. Graceful fallback card with direct link to Google Maps rendered when key is unset.
- **Direct WhatsApp Reservation**: Direct concierge fallback routes to `https://wa.me/6281252200049` (`SiteSettings.whatsappNumber`). Legacy reservation picker components retained.
- **Authoritative Reservation Integration (RES-001 / RES-001A / RES-001B - CLOSED)**: The official ResDiary JavaScript widget is the authoritative standard table reservation integration for GEMA Surabaya. Embedded into `ReservationOverlay` via `<div id="rd-widget-frame"></div>`, hidden input `<input type="hidden" id="rdwidgeturl" value="https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false" />`, and loader `<Script strategy="beforeInteractive">` scoped strictly to `(frontend)` (never `/admin` or `/api/*`). Natural browser `window.onload` execution with 0 synthetic events. Pre-initialized widget DOM is preserved across drawer open/close cycles without reinitialization or script duplication. Modal accessibility enforced via `inert` and `aria-hidden`. 8-second UX fallback notice and CDN error fallback route gracefully to WhatsApp (`SiteSettings.whatsappNumber`). Drawer width `md:w-[560px] lg:w-[600px]`. Production reservation submission restricted during QA. Legacy reservation picker components retained as fallback/dormant.

---

## 12. SPLASH-004 Verified Features (Full Splash Visual Fidelity Correction)

- **Local Video Delivery**: Delivered via same-origin MP4 assets `/media/splash/gema-splash-desktop.mp4` and `/media/splash/gema-splash-mobile.mp4` with `muted`, `playsInline`, `autoPlay`, `loop`, and responsive breakpoint switching (`hidden md:block` / `block md:hidden`).
- **DOM Overlay Synchrony**: DOM typography and interactive gateway controls reveal synchronously with smooth fade-in overlay.
- **Visual Oracle Fidelity**: Authoritative pixel-parity against `/media/splash/desktop-ref.png` (1672x941) and `/media/splash/mobile-ref.png` (941x1672).
  - **Desktop Loading Order**: Subtitle (`GOOD FOOD. BRIGHTER DAYS.`, center_y ~ 84.9%) → Progress Bar (center_y ~ 89.3%) → LOADING text (center_y ~ 96.1%). Progress bar is correctly rendered *above* LOADING text.
  - **Desktop Bottom Anchors**: EST. 2020 at `bottom-[3.5%]` (measured bottom ~ 4.1%, oracle 3.4%), A TASTE OF ITALY ALWAYS at `bottom-[3.5%]` (measured bottom ~ 3.5%, oracle 3.4%).
  - **Mobile Loading Sequence**: Subtitle (`GOOD FOOD. BRIGHTER DAYS.`, center_y ~ 77.7%) → Gold accent hairline (`w-16 h-[1px]`, center_y ~ 79.6%) → LOADING text (center_y ~ 82.3%) → Progress Bar (center_y ~ 84.3%). Gap between LOADING and Bar is 2.0%, completely preventing text/bar collision.
  - **Motto Color and Weight**: Desktop and mobile top motto `CUCINA • BUONA COMPAGNIA • BELLA VITA` rendered in `#6b5743` with normal font weight.
  - **Brand Logo Integrity**: Unclipped, fully visible Gema brand mark on both desktop and mobile viewports.

---

## 13. SPLASH-006A & SPLASH-006B Verified Features (Fullscreen Background + Empirical Responsive Visual QA)

- **Fullscreen Background Architecture (SPLASH-006A)**: Fullscreen video background (`object-fit: cover; object-position: center; inset: 0; width: 100%; height: 100%`) on both mobile and desktop. Contained fixed-ratio artboard approach completely eliminated. Zero letterboxing, zero black/white margins across all tested viewports.
- **Empirical Visual Validation (SPLASH-006B)**:
  - Eliminated formulaic divider estimation (`63.94%`) as acceptance oracle; validated composition via real browser full-viewport screenshots across 13 mobile viewports (360×800, 375×812, 390×700, 390×780, 390×844, 390×900, 402×874, 412×915, 430×760, 430×850, 430×932, 480×800, 540×960) and 4 desktop viewports (1280×720, 1366×768, 1440×900, 1920×1080).
  - Assembled composite visual contact sheets (`mobile_contact_sheet.png`, `desktop_contact_sheet.png`) with clear viewport labels and PO baseline highlight.
  - **Fluid Content Model Refinements**:
    - **Top Brand Group (Group A)**: `top: clamp(3rem, 7.5dvh, 4.5rem)` ensures top motto `CUCINA` maintains >= 17px breathing room below top-left botanical leaves even on short mobile viewports (390×700) while keeping balanced ~120px whitespace above the building roof.
    - **Welcome & Loading (Group B & C)**: `top: calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1rem, 2.8dvh, 1.8rem))` dynamically tracks the visible architectural divider, guaranteeing consistent 20px–27px clearance and zero collision across all ratios.
    - **Bottom Metadata (Group D)**: `paddingLeft: clamp(1.8rem, 7dvw, 2.8rem)`, `paddingRight: clamp(1.8rem, 7.5dvw, 2.8rem)`, `paddingBottom: clamp(1.8rem, 5.8dvh, 2.8rem)` keeps `EST. 2020` and `A TASTE OF ITALY ALWAYS` nestled inside the inner gold frame line, completely clear of foliage.
  - **Functional & Code QA**: Video loop, Gateway entrance dismissal, synchronous audio unlock gesture, Homepage `scrollY === 0` normalization, and reduced motion still fallback empirically verified. Typecheck and Turbopack production build pass with 0 errors.

---

## 14. SPLASH-007 Approved Splash / Gateway Baseline Freeze (ADR-014)

- **Baseline Status**: **FROZEN**.
- **Approved Architecture**: Fullscreen Media Background (`100vw × 100dvh`, `object-fit: cover; object-position: center`) + Responsive Content Composition. Contained fixed-ratio artboards and letterboxing are strictly prohibited.
- **Frozen Visual State**:
  - Group A (Top Brand): `top: clamp(3rem, 7.5dvh, 4.5rem)`.
  - Group B & C (Welcome & Loading): `top: calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1rem, 2.8dvh, 1.8rem))`.
  - Group D (Bottom Metadata): `paddingLeft: clamp(1.8rem, 7dvw, 2.8rem)`, `paddingRight: clamp(1.8rem, 7.5dvw, 2.8rem)`, `paddingBottom: clamp(1.8rem, 5.8dvh, 2.8rem)`.
  - Desktop centered composition with progress bar above `LOADING...` at `top-[89%]`.
- **Frozen Assets**:
  - Mark: `apps/web/public/media/splash/gema-dark.png` (unclipped, complete G loop and right terminal, 16px transparent safety padding).
  - Video Assets: `/media/splash/gema-splash-desktop.mp4` and `/media/splash/gema-splash-mobile.mp4` (same-origin, continuous loop, fast-start moov atom).
- **Approved Instrumentation**: `data-splash-element="..."` non-visual QA selectors preserved in `GatewayExperience.tsx`.
- **Canonical Regression Suite**: `apps/web/scripts/qa-splash-006b.cjs` and `qa-splash-008.cjs` cover fullscreen assertions, 17-viewport matrix, contact sheet assembly, and functional lifecycle.
- **Regression Rule**: Any future task touching `GatewayExperience.tsx` must re-verify all invariants (fullscreen media, no letterbox, logo completeness, divider/Welcome clearance, bottom metadata, mobile responsive composition, click-to-enter, ambient audio gesture, Homepage scrollY 0 normalization).

## 15. SPLASH-008 Verified Features (Database-Driven Splash Video Assets + Remove Loading Module)

- **Database-Driven Video Configuration**:
  - Authoritative Splash video asset configuration is stored in PostgreSQL table `splash_media_config` (`key`, `media_type`, `variant`, `asset_path`, `mime_type`, `is_enabled`).
  - MP4 binaries are static media assets (`apps/web/public/media/splash/`); database stores metadata and public runtime paths only.
  - Server-side loader `getSplashMediaConfig()` in `apps/web/src/lib/splashConfig.ts` reads records during SSR and passes `splashConfig` to `GatewayExperience`.
  - Zero hard-coded authoritative or fallback video URLs remain in `GatewayExperience.tsx` or `splashConfig.ts`.
  - Graceful fallback: when DB is unreachable, record is missing, or `is_enabled = false`, the Gateway falls back strictly to the authoritative still reference image (`desktop-ref.png` / `mobile-ref.png`) with zero fallback video requests and zero broken video icons.
  - Zero hardcoded database credentials in application source code.
  - CMS Isolation: Payload CMS is 100% untouched.
- **Authoritative PO Video Verification**:
  - Desktop source: `/Users/jasonsjanuard/Desktop/GEMA/splash-screen-desktop.mp4` copied to `apps/web/public/media/splash/gema-splash-desktop.mp4` (SHA-256: `ab320f1878617dac9c3ab1cbf3e232c7aa191a8e7745676ba96e4c840f81346f`).
  - Mobile source: `/Users/jasonsjanuard/Desktop/GEMA/splash-screen-mobile.mp4` verified identical to `apps/web/public/media/splash/gema-splash-mobile.mp4` (SHA-256: `70a429d7bb632cbe02911c75b00da8dd6e241bf6b9b8bc41cf45a7680d3516ea`).
- **Complete Loading UI Removal**:
  - `LOADING...` text and animated progress bar completely removed from desktop and mobile compositions as well as accessible landmarks (`sr-only`).
  - No empty wrapper or opacity hacks.
- **Decorative Terminator**:
  - Short, static, warm gold hairline (`data-splash-element="accent"`, `w-16 h-[1px] bg-[#BFA16F]/70`) retained/added after `GOOD FOOD. BRIGHTER DAYS.` on both desktop and mobile.
- **Rebalanced Lower Composition**:
  - Desktop: Welcome at `top-[75.5%]`, Subtitle at `top-[84.5%]`, Gold terminator at `top-[88%]`, Bottom metadata elevated to `bottom-[4.5%]`.
  - Mobile: Welcome group at `calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1.2rem, 3.2dvh, 2rem))`, Bottom metadata padding elevated to `clamp(2.2rem, 6.8dvh, 3.4rem)`.
  - Negative space remains balanced and breathing without dead zones or empty holes.
- **Empirical QA Verification**:
  - `apps/web/scripts/qa-splash-008.cjs` verified 17 viewports (13 mobile, 4 desktop), generated contact sheets, asserted zero LOADING text, zero progress bar, DB video matching, fullscreen background, click-to-enter, and reduced motion.
  - Code QA: `npm run typecheck` and `npm run build` passed with zero errors.

---

## 16. SPLASH-009 Verified Features (Bottom Metadata Responsive Rebalance)

- **Copy Update (EST. 2026)**:
  - Bottom-left label updated from `EST. 2020` to `EST. 2026` across all occurrences:
    - Accessible screen-reader landmark (`.sr-only`): `<p>EST. 2026</p>`
    - Desktop DOM overlay: `EST. 2026`
    - Mobile DOM overlay: `EST. 2026`
  - Bottom-right copy strictly preserved: `A TASTE` / `OF ITALY` / `ALWAYS`.
  - Zero "EST. 2020" occurrences remain in application source code.
- **Intrinsic Background Line Invariant**:
  - The decorative gold line on the right side belongs intrinsically to the video and poster background assets.
  - Zero modification, faking, redrawing, hiding, or CSS repositioning was applied to the background video/poster media.
  - Clearance is achieved solely by repositioning the DOM metadata text blocks.
- **Responsive Bands & Layout Logic**:
  - **Band A (Mobile Small / Normal: 360px <= width < 430px)**:
    - `.splash-bottom-meta-mobile`: `padding-left: clamp(2rem, 8dvw, 3rem)`, `padding-right: clamp(2.8rem, 11dvw, 4rem)`, `padding-bottom: clamp(4.2rem, 9.8dvh, 5.2rem)`.
    - Clearance above mobile bottom frame line: +49px to +59px across all normal mobile viewports.
    - Zero collision with falling leaves or side olive branches.
  - **Band B (Mobile Wide / Short-Wide: 430px <= width < 768px)**:
    - CSS media query `@media (min-width: 430px) and (max-width: 767px)`:
    - `padding-left: clamp(2.4rem, 9dvw, 3.6rem)`, `padding-right: clamp(3.8rem, 14dvw, 5.5rem)`, `padding-bottom: clamp(4.4rem, 10dvh, 5.4rem)`.
    - Insets metadata safely away from the right olive branch during vertical cover-crop.
  - **Override 1 (Short / Wide Mobile: width >= 430px and aspect ratio >= 0.56)**:
    - CSS media query `@media (min-width: 430px) and (max-width: 767px) and (min-aspect-ratio: 56/100)`:
    - `padding-left: clamp(2.6rem, 9.5dvw, 3.8rem)`, `padding-right: clamp(4.5rem, 16dvw, 6.2rem)`, `padding-bottom: clamp(4.2rem, 9.8dvh, 5.2rem)`.
    - Positions text block in the open cove below the protruding olive leaf (+53px to +56px clearance, +65px headroom).
  - **Band C & D (Tablet / Desktop: width >= 768px)**:
    - `.splash-bottom-meta-desktop`: `bottom: clamp(4.2rem, 10.2%, 6.2rem)` with `left-[7.2%]` and `right-[7.2%]`.
    - Clearance above desktop decorative line: +21px to +27px.
  - **Override 2 (Short Desktop: width >= 1280px and height <= 800px)**:
    - CSS media query `@media (min-width: 1280px) and (max-height: 800px)`:
    - `.splash-bottom-meta-desktop`: `bottom: clamp(4.6rem, 10.8%, 6.5rem)`.
    - Clearance above decorative line on 1280x720 (+26px) and 1366x768 (+28px).
- **Desktop Vertical Rhythm Harmonization (Superseded by SPLASH-009A)**:
  - The temporary upward shift of the central Welcome group was recognized as unapproved collateral change and superseded by SPLASH-009A.

---

## 17. SPLASH-009A Verified Features (Restored Approved Central Desktop Composition)

- **Approved Central Composition Restoration**:
  - Restored the central Desktop Welcome stack to its pre-SPLASH-009 approved visual baseline in `GatewayExperience.tsx`:
    - `divider`: `top-[71%]` (below villa terrace steps)
    - `welcome`: `top-[75.5%]` (focal script center)
    - `good-food`: `top-[84.5%]` (editorial subtitle)
    - `accent hairline`: `top-[88%]` (short static gold hairline)
  - Zero redesign, zero cadence changes, and zero upward migration.
- **Preserved SPLASH-009 Bottom Metadata System**:
  - Copy: `EST. 2026` (bottom-left) and `A TASTE OF ITALY ALWAYS` (bottom-right) strictly preserved.
  - Mobile Band A & Band B responsive padding preserved.
  - Mobile Override 1 (`min-aspect-ratio: 56/100`) preserved.
  - Desktop Band C & D `.splash-bottom-meta-desktop` (`bottom: clamp(4.2rem, 10.2%, 6.2rem)`) preserved.
  - Desktop Override 2 (`min-width: 1280px` and `max-height: 800px`, `bottom: clamp(4.6rem, 10.8%, 6.5rem)`) preserved.
- **2D Collision Invariant**:
  - Central column elements (`left-1/2 -translate-x-1/2`, X: 47.5%–52.5%) and corner metadata blocks (`left-[7.2%]`, `right-[7.2%]`, X: 7.2% and 92.8%) occupy completely distinct horizontal columns.
  - Zero 2D bounding box intersection between central composition and corner metadata across all viewports.
  - Clearance above the intrinsic background decorative line is preserved (+21px to +28px on desktop, +49px to +61px on mobile).
- **Zero New Breakpoints Added**:
  - No additional media queries introduced.
- **Visual & Automated QA**:
  - Representative viewports visually inspected and approved: 390×844, 430×760, 430×932, 1280×720, 1366×768, 1440×900, 1920×1080.
  - Full 17-viewport matrix in `apps/web/scripts/qa-splash-009.cjs`: 100% PASS (17/17).
  - Typecheck (`npm run typecheck`) and Turbopack build (`npm run build`) passed with zero errors.

---

## 18. SPLASH-009B Verified Features (Mobile Bottom Metadata Position Correction)

- **Mobile Bottom Metadata Anchored Low**:
  - Lowered `padding-bottom` across mobile responsive rules in `apps/web/src/styles/globals.css`:
    - Band A (360px–412px): `padding-left: clamp(2rem, 8dvw, 3rem); padding-right: clamp(2.2rem, 8.5dvw, 3.2rem); padding-bottom: clamp(1.8rem, 4.2dvh, 2.4rem);`
    - Band B (430px–767px): `padding-left: clamp(2.2rem, 8.5dvw, 3.2rem); padding-right: clamp(2.6rem, 10dvw, 3.8rem); padding-bottom: clamp(1.8rem, 4.2dvh, 2.4rem);`
    - Override 1 (short/wide mobile `min-aspect-ratio: 56/100`): `padding-left: clamp(2.4rem, 9dvw, 3.4rem); padding-right: clamp(3rem, 11dvw, 4.2rem); padding-bottom: clamp(1.8rem, 4.2dvh, 2.4rem);`
  - Positioned metadata cleanly in the open parchment space below the right olive branch.
  - Foliage remains visually completely above the metadata. Zero text covered by leaves; zero olive clusters competing with text.
  - Sits intentionally near the bottom decorative frame line (+11px to +15px clearance).
  - Symmetrical, balanced left and right baselines (`EST. 2026` and `A TASTE OF ITALY ALWAYS` share 0px baseline difference).
- **Desktop Invariant Strictly Preserved**:
  - Desktop Welcome stack, desktop metadata positioning, and desktop overrides: 100% UNTOUCHED.
- **Background Media Invariant**:
  - Fullscreen video and poster background assets: 100% UNTOUCHED.
- **Copy Invariant**:
  - `EST. 2026` and `A TASTE OF ITALY ALWAYS` 100% preserved. Zero `EST. 2020` occurrences.
- **Empirical & Visual QA**:
  - 10 required mobile viewports (360×800, 390×700, 390×844, 402×874, 412×915, 430×760, 430×850, 430×932, 480×800, 540×960) rendered and visually verified: 100% PASS.
  - Full 17-viewport test suite (`qa-splash-009.cjs`): 100% PASS.
  - Typecheck (`tsc --noEmit`) and Turbopack build (`next build`): 100% PASS with zero errors.

---

## 19. SPLASH-009C Verified Features (Desktop Bottom Metadata Reposition + Year Correction to 2025)

- **Desktop Bottom Metadata Rebalanced**:
  - Horizontal Inset Adjustment:
    - Right metadata (`A TASTE OF ITALY ALWAYS`) shifted to `right-[5.0%]`.
    - Left metadata (`EST. 2025`) shifted to `left-[5.0%]`.
    - Sits cleanly in the lower corner framing zone / alcoves with 45px–96px breathing space from viewport edge.
  - Vertical Baseline Tuning in `apps/web/src/styles/globals.css`:
    - Band C & D (desktop >= 768px): `bottom: clamp(3.8rem, 9.0%, 5.8rem)`.
    - Override 2 (short desktop width >= 1280px and height <= 800px): `bottom: clamp(4.0rem, 9.4%, 5.8rem)`.
    - Provides a harmonious +15px to +17px clearance above the decorative bottom gold hairline across all desktop viewports.
    - Symmetrical, perfectly level baseline between left and right blocks (0px baseline difference).
- **Year Corrected to 2025**:
  - `EST. 2025` implemented consistently in:
    - Screen-reader accessible landmark (`apps/web/src/components/motion/GatewayExperience.tsx` line 217).
    - Desktop DOM overlay (line 300).
    - Mobile DOM overlay (line 396).
  - Verified 0 remaining occurrences of `2026` or `2020` in the splash screen codebase.
- **Strict Invariants Preserved**:
  - Mobile bottom metadata positioning: 100% UNTOUCHED (SPLASH-009B rules intact).
  - Central Welcome composition: 100% UNTOUCHED (divider ~71%, welcome ~75.5%, good-food ~84.5%, accent hairline ~88%).
  - Background video and poster media: 100% UNTOUCHED.
  - Dynamic responsive clamp system: 100% preserved (zero static fixed positioning).
- **Quality Gates & Empirical Verification**:
  - Automated Playwright QA matrix (`apps/web/scripts/qa-splash-009.cjs`): 18/18 viewports PASS (100%).
  - Visual inspection of desktop viewports (1280×720, 1366×768, 1440×900, 1600×900, 1920×1080) confirmed pristine quiet-luxury aesthetic, complete foliage clearance, and balanced framing.
  - Mobile viewports confirmed identical to SPLASH-009B baseline.
  - Typecheck (`tsc --noEmit`): PASS.
  - Production build (`next build`): PASS.


