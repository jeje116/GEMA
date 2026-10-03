# GEMA — Decisions

This file contains APPROVED and LOCKED project decisions.

Do not change an existing LOCKED decision without explicit user approval.

Use ADR identifiers for durable decisions.


---

# ADR-001 — Google AI Studio Frontend Is the Visual Baseline

Status:

LOCKED

Decision:

The existing frontend generated from Google AI Studio is the starting visual specification for GEMA.

Implications:

- Do not independently redesign approved pages.
- Preserve visual hierarchy.
- Preserve navigation semantics.
- Preserve intended responsive behavior.
- Backend convenience is not sufficient reason to change frontend UX.
- Material visual changes require explicit approval.


---

# ADR-002 — Human-Governed Agentic Development

Status:

LOCKED

Decision:

GEMA uses human-governed agentic development.

The user retains authority over:

- product behavior,
- architecture,
- material UX changes,
- business logic,
- API contracts,
- database structure,
- security model,
- material implementation scope.

The coding agent may analyze, plan, implement approved scope, test, debug, and document.

Discussion is not execution authorization.


---

# ADR-003 — Prefer Small, Robust, Reversible Changes

Status:

LOCKED

Decision:

When multiple implementations satisfy the approved requirement, prefer the approach with:

- smaller blast radius,
- higher reversibility,
- fewer dependencies,
- lower operational complexity,
- better testability,
- adequate maintainability.

Do not optimize prematurely for hypothetical scale.


---

# ADR-004 — Official Menu Authority & Editorial Normalization Policy

Status:

LOCKED

Decision:

PDF source documents are authoritative for menu substance, items, categories, pricing, portions, and variants.

Obvious source-document typographical errors may be normalized for public website copy without changing meaning (e.g., Stracciatella, Pomodorini, Basilico Verde, Chantilly, focaccia, government).

Implications:

- Meaning, pricing, and ingredient identity must remain unchanged.
- Transcription errors introduced during integration must be corrected to match authoritative source (e.g., Patatine).
- Intended source diacritics should be preserved (e.g., Ragù di Manzo, Béchamel).
- PDF icons without verified semantic legend remain unmapped.


---

# ADR-005 — Menu Authentic Media Policy

Status:

LOCKED

Decision:

The Menu page uses photography only for orientation and atmosphere, not as a dish-by-dish catalog.

Implications:

- Keep the menu page text-first, editorial, scan-friendly, fast, and functional.
- Do not add photography to every dish or every category.
- Use exactly ONE contextual editorial media panel near the top that updates according to active menu mode (Food overview: FNR03012.jpg table spread / Beverage craft: QAR04031.jpg cocktail preparation).
- Media panel must not be sticky and must scroll away naturally.
- Switching between Food and Beverage uses a subtle opacity crossfade (250-400ms) with zero parallax or dramatic zoom.
- Do not identify general overview assets as specific named menu items or cocktails.


---

# ADR-006 — Business Fact Provenance & Production Confirmation Registry

Status:

LOCKED

Decision:

1. Internal repetition across repository code (e.g., `site.ts`, `translations.ts`, baseline commits) does not constitute authoritative business provenance.
2. Operational business facts transition to `AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED` exclusively upon explicit Product Owner confirmation.
3. Pending Product Owner confirmation, the following 7 FACT GROUPS remain non-destructively preserved under their respective classifications:
   - Group 1: **Full Entity Subtitle** — `GEMA Restaurant & Societiet` (`REPOSITORY-CONSISTENT, SOURCE NOT VERIFIED`)
   - Group 2: **Official Physical Address** — `Jl. Musi No. 32, Darmo, Kec. Wonokromo, Surabaya, Jawa Timur 60241, Indonesia` (`REPOSITORY-CONSISTENT, SOURCE NOT VERIFIED`)
   - Group 3: **Official Guest Phone + WhatsApp** — `0812-5220-0049` / `+62 812-5220-0049` / `6281252200049` (`REPOSITORY-CONSISTENT, SOURCE NOT VERIFIED`)
   - Group 4: **Instagram** — `https://instagram.com/gema.surabaya` (`@gema.surabaya`) (`REPOSITORY-CONSISTENT, SOURCE NOT VERIFIED`)
   - Group 5: **TikTok** — `https://www.tiktok.com/@gemarestaurant` (`UNVERIFIED — PRESERVED`)
   - Group 6: **Reservation / General Email** — `reservations@gemasurabaya.com` (`UNVERIFIED — PRESERVED`)
   - Group 7: **Dietary Policy** — `No Pork, No Lard` (`REPOSITORY-CONSISTENT, SOURCE NOT VERIFIED`)
4. Authoritatively verified closed facts remain locked:
   - GEMA brand name (`AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED`)
   - Primary service: Dine-in (`AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED`)
   - Menu tax + service charges: 10% + 10% (`AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED`)
   - Culinary Director: Chef Mandif Warokka (`AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED`)
   - Reservation slot & smoking logic (`AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED`)
   - Ambient backsound track: Stillness in the Atrium (`AUTHORITATIVELY VERIFIED — PRODUCT OWNER CONFIRMED`)
5. Speculative prototype placeholders remain removed:
   - Takeaway service (`UNVERIFIED — REMOVED`)
   - Public opening hours (`UNVERIFIED — REMOVED`)
6. Unconfirmed facts must NOT be silently altered or deleted without explicit Product Owner instruction.

---

# ADR-007 — Homepage Cuisine / Menu Teaser Content Ownership & Fixed 4-Slot Architecture

Status:

LOCKED

Decision:

1. Homepage Cuisine / Menu Teaser visible content is owned by Payload CMS via a fixed 4-slot group container (`cuisineTeaser.item01..item04`) on the Homepage Global.
2. Labels are localized (`localized: true`) for EN and ID.
3. Media relationships are non-localized (`localized: false`), shared across locales, and reference existing unique Media records.
4. Slot count (exactly 4), slot numbers (`01`–`04`), presentation layout, animations, active/hover transitions, object-position styling (`item03: object-[center_35%]`, others `object-center`), and Menu CTA navigation are 100% CODE-OWNED.
5. Zero runtime fallback to hardcoded editorial category strings or static image paths.
6. Signature Dishes (`homepage.signatureDishes.items`) is a completely separate component with independent CMS ownership.

---

# ADR-008 — Payload Admin Order & Operational Globals UX Architecture

Status:

LOCKED

Decision:

1. **Page-Oriented Forms**: For all page-oriented CMS forms, Payload Admin editing order must strictly mirror public website content order from top to bottom (`PAYLOAD ADMIN ORDER == PUBLIC WEBSITE CONTENT ORDER`). The public website render tree is the authoritative order oracle.
2. **Code-Owned & Externally Managed Sections**: For sections that are code-owned, governance-held, or managed in separate collections, use Admin-only presentational landmarks (e.g. `type: 'collapsible'` with no `name`) to guide editors without changing database paths or creating stored groups.
3. **Technical/System Fields**: Technical and system fields (such as IDs, revalidation triggers, or system metadata) are placed after page-visible content or in appropriate sidebar/system areas.
4. **Operational Globals**: Operational globals (such as Site Settings) are organized by operational clarity rather than forcing an artificial 1:1 match with a single public page.
5. **Site Settings Identity**: `restaurantName` is the single authoritative restaurant identity field (current value: `'GEMA Restaurant & Societiet'`). No separate `entitySubtitle` field exists or is required. Active field count is exactly 10.
6. **Zero Silent Schema Drift**: Presentational grouping must never alter database paths, field keys, or generate unapproved database migrations.

---

# ADR-009 — Public Content Provenance & Full-Site CMS Ownership

Status:

LOCKED

Decision:

1. **Verified Provenance Required for Public Reviews**:
   - Customer testimonials/reviews must be managed via the `Reviews` Collection in Payload CMS.
   - Only reviews with `verificationStatus = 'verified'` AND `isActive = true` may be selected for or rendered on public routes.
   - Zero fallback to `fixtures/reviews.ts` in public runtime.
   - If zero verified reviews are selected for the Homepage, the Reviews section is cleanly hidden, preserving natural flow from Events to Journal.
   - Delete and status guards (`isReviewInHomepage`) prevent deletion, deactivation, or demotion of any review currently referenced by Homepage published or draft versions.

2. **Verified Provenance Required for Public Recognition**:
   - Recognition awards and press mentions are managed in the `Recognitions` Collection in Payload CMS.
   - Public queries must use `contentStatus = 'verified'` and preserve `overrideAccess: false`.
   - Zero fallback to `fixtures/recognition.ts` in public runtime.
   - If zero verified recognitions exist, Homepage Recognition preview is hidden and the Recognition archive page displays the CMS-managed header without fabricating awards.

3. **Operational Facts Single Source**:
   - `SiteSettings` is the authoritative runtime single source for operational facts: `fullAddress`, `locationLabel`, `mapUrl`, `phone`, `whatsappNumber`, `email`, `instagramUrl`, `tiktokUrl`, `dietaryPolicy`, and `services`.
   - Public runtime components (e.g. Visit map embed, Visit SEO metadata, Footer social links, Footer dietary policy, Footer location label) must derive directly from `SiteSettings` and must never hardcode operational facts or parse addresses with heuristics.

4. **Editorial Page Content Belongs to Payload CMS**:
   - Visible page titles and listing framing (Recognition page title, Occasions page title, Visit page title, Visit section headings, Homepage visit headings, Events listing title & subtitle, Journal listing title & subtitle) are editorial page content owned and localized in Payload CMS Globals (`RecognitionPage`, `OccasionsPage`, `VisitPage`, `Homepage`, `EventsPage`, `JournalPage`).
   - `RecognitionPage.title` is 100% Payload-owned and localized EN/ID; runtime and metadata components must never fallback to `t('nav.recognition')`.
   - Navigation labels in `Navigation` Global / `translations.ts` remain strictly decoupled from page editorial titles.
   - `chef.previewText` is ACTIVE as the editorial source for Chef page SEO metadata description / preview context. `chef.ctaLabel` remains POTENTIALLY DEAD (Homepage reads `homepage.chefPreview.ctaLabel`).

5. **Functional & System Labels Belong to Code Translations**:
   - Functional controls, CTAs, status badges, and metadata labels (`occasions.inquire`, `visit.map.open`, `visit.reserve`, `events.meta.*`, `events.state.*`, `events.cta.*`, `journal.filter.*`, `journal.readStory`, `journal.back`, `journal.exploreMore`, `footer.nav`, `404.*`) belong to `translations.ts` with complete EN/ID coverage.

6. **Media Invariant**:
   - Static brand assets (logos, favicon, UI icons, audio tracks) remain code-owned system assets. Active content media is 100% Payload-managed.

7. **Final Content Ownership State & Quality Gates**:
   - Editorial / Business Content → Payload CMS
   - Operational Facts → Site Settings
   - Functional / System UI → Code + Translation Layer (`translations.ts`)
   - Layout / Structure / Motion → Code
   - Provenance-Sensitive Content → Payload + Verification Gate
   - Remaining P0: 0
   - Remaining P1: 0
   - Active content static media references: 0
   - Unverified public review claims: 0
   - Unverified public recognition claims: 0

---

# ADR-010 — Product Owner UAT Remediation & Editorial Architecture Parity

Status:

LOCKED

Decision:

1. **Gateway Lifecycle & Public Scoping**:
   - The Gateway experience is strictly scoped to the public frontend (`(frontend)` route group) and NEVER mounts on `/admin` or `/api/*`.
   - Every full document load or browser refresh of a public frontend route displays the Gateway.
   - Once dismissed via user click ("Enter"), the Gateway remains dismissed across client-side SPA route transitions within the document lifecycle.
   - `gemaAudioPref` in localStorage is preserved (maintains separate user intent). No `gema_gateway_seen` or equivalent state is persisted across reloads.
2. **Footer Social Handles**:
   - Visible social handle links in the Site Footer display without a leading `@` (`gema.surabaya`). Destination URLs are authoritatively owned by `SiteSettings.instagramUrl` and `SiteSettings.tiktokUrl`.
3. **Menu Signature Removal & Dormancy**:
   - All Signature visual indicators (top-right legend, dots next to dish titles, badges) are removed from Menu presentation.
   - `MenuItem.signature` remains in the collection schema as dormant (0 runtime consumers; POTENTIALLY DEAD) to avoid unnecessary schema destruction.
4. **Experience Materials CMS Integration & Transitional Presentation**:
   - 4 optional Media relationship slots (`materialImage01`..`materialImage04`) are provided in `PageMedia.experience`.
   - No fake, arbitrary, or placeholder photographs are inserted.
   - Until the Product Owner explicitly populates all 4 CMS image relationships, a transitional presentation fallback renders the approved color swatches.
5. **Homepage Recognition Removal & Version Safety**:
   - Recognition is completely removed from the Homepage component tree.
   - `recognitionIntro` is safely dropped from `homepage_locales` and `_homepage_v_locales` via a committed, reversible database migration.
   - Admin hierarchy for Homepage is renumbered 01 through 10.
6. **Journal as Layout Oracle & Single-Image Editorial Architecture**:
   - Journal layout is the strict oracle. Visual regression against the pre-refactoring baseline is zero.
   - Both Journal and Recognition share structural presentation components: `EditorialListingPage` and `EditorialDetailPage`.
   - Single main image policy: detail pages render exactly one `coverImage`, followed by an optional localized `imageCaption` inside semantic `<figure>` and `<figcaption>`.
   - Upload/image insertion nodes in the Lexical editor are disabled for both Journal and Recognition `content` fields to prevent unauthorized embedded body media.
7. **Recognition Detail Route & Publication Guard**:
   - Recognition Detail is served at `/[locale]/recognition/[slug]` using Next.js App Router with `dynamicParams = true`, ensuring newly verified records resolve dynamically without requiring a project redeployment.
   - A `beforeChange` hook in `Recognitions` strictly enforces the publication guard: records cannot transition to `contentStatus = 'verified'` unless all required editorial fields (`title`, publication-ready `slug`, `year`, `awardingBody`, `scope`, `coverImage`, `excerpt`, and `content`) are populated with valid data.
   - Unverified Recognition detail routes return 404.

---

# ADR-011 — ResDiary Website Reservation Widget Integration

Status:

LOCKED

Decision:

1. **Locked ResDiary Architecture**:
   - Integration Method: OFFICIAL RESDIARY JAVASCRIPT WIDGET
   - iFrame: NOT USED
   - Venue: `GemaSurabaya/2025`
   - Official Widget URL: `https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false`
   - Official Loader: `https://booking.resdiary.com/bundles/WidgetV2Loader.js`
   - No private, reverse-engineered, or undocumented ResDiary APIs are permitted.

2. **Loader Lifecycle & Zero Synthetic Dispatch (RES-001B)**:
   - Widget DOM: Present in initial public frontend document (`#rd-widget-frame` + `#rdwidgeturl` rendered in `ReservationOverlay`).
   - Official Loader: `<Script id="rd-loader-script" src="https://booking.resdiary.com/bundles/WidgetV2Loader.js" strategy="beforeInteractive" />` loaded before natural browser window load in `apps/web/src/app/(frontend)/[locale]/layout.tsx`.
   - Initialization: NATURAL WINDOW LOAD (`window.onload`).
   - Synthetic global load dispatch (`window.dispatchEvent(new Event('load'))`): STRICTLY PROHIBITED.
   - Private / undocumented ResDiary initializer: STRICTLY PROHIBITED.
   - Loader script instances: Exactly 1.
   - Widget container instances: Exactly 1.
   - Route Isolation: Public frontend only (`(frontend)` route group); zero script, DOM, or network contamination in `/admin` or `/api/*`.

3. **Reservation UX & Boundary Ownership**:
   - Standard Reservation CTAs → GEMA `ReservationOverlay` drawer → ResDiary Widget.
   - `ReservationOverlay` drawer shell, positioning, transitions, and concierge fallbacks remain owned by GEMA.
   - ResDiary owns the standard table booking form, date/time pickers, party sizes, and live diary availability experience.
   - Special Occasion / Brand Event inquiries: Preserve dedicated bespoke inquiry flow (`/occasions`).

4. **Widget Lifecycle & DOM Retention**:
   - Open 1: Reuses pre-initialized widget mounted on initial document load.
   - Close: Keeps widget mounted and transitions drawer to `inert`, `aria-hidden`, and `translate-x-full` off-canvas.
   - Open 2 / Open 3: Reuses identical widget DOM across all subsequent drawer interactions.
   - Zero script reinjections.
   - Zero widget reinitializations.
   - Zero form resets caused by GEMA drawer open/close lifecycle.

5. **Accessibility & Modal Isolation**:
   - Closed Drawer:
     - `inert`: YES
     - `aria-hidden`: YES
     - Hidden widget keyboard focus: NO (tabbing completely suppressed)
     - Pointer interaction: NO (`pointer-events-none`)
   - Open Drawer: Focus trapped, body scroll locked, interactive.

6. **Failure Mode & Concierge Fallback**:
   - ResDiary slow loading (>8 seconds) or network failure: Offer prominent WhatsApp concierge fallback card.
   - WhatsApp source: `SiteSettings.whatsappNumber` (`+6281252200049`).
   - Container resilience: Do not destroy or unmount the widget container (`#rd-widget-frame`) solely due to timeout; if ResDiary finishes loading late, seamlessly render it.

7. **Production Safety & Booking Restrictions**:
   - Current venue: PRODUCTION GEMA SURABAYA DIARY (`GemaSurabaya/2025`).
   - Uncontrolled test bookings: STRICTLY PROHIBITED.
   - Reservation submissions during implementation/QA: NONE.
   - Production records created: Exactly 0.
   - End-to-end booking verification status: `NOT VERIFIED — PRODUCTION TEST RESTRICTED`.
   - Future E2E booking tests require: Dedicated ResDiary sandbox/test venue OR explicit Product Owner authorization for a coordinated live production test.

8. **Performance Trade-Off Acceptance**:
   - Current observed ResDiary initial-load cost: 13 additional requests, ~1.88 MB uncompressed resources.
   - Observed material initial rendering regression: NO.
   - Accepted architectural trade-off for utilizing the official loader with its natural browser lifecycle.
   - Reintroducing synthetic window load events to optimize lazy loading is prohibited.
   - Future optimization may only proceed with empirical evidence and without violating the official ResDiary embed contract.

9. **Supersession & Governance**:
   - RES-001A is superseded by RES-001B where lifecycle behavior differs.
   - Code Quality: Typecheck PASS, Production Build PASS, Public Frontend Isolation PASS, `/admin` Contamination NONE, CSP Changes NONE REQUIRED.

---

# ADR-012 — ResDiary Insecure Protocol Fallback & Production HTTPS Requirement

Status:

LOCKED

Decision:

1. **Root Cause & Asset Ownership**:
   - The compact "Reserve Now" presentation and broken image observed in `ReservationOverlay` occur exclusively when the official ResDiary JavaScript widget is embedded on an unencrypted HTTP origin (`http://localhost`).
   - ResDiary's runtime logic checks `rd.helpers.isOnSecurePage: function(e) { return "https:" === e.location.protocol }`.
   - When running on HTTP, ResDiary deliberately disables inline booking to protect user credentials, activating its `insecure-fallback-book-button` template.
   - The broken image is caused by ResDiary's own server-rendered template hardcoding `<img alt="Powered by ResDiary" src="" />` with an empty string, which causes compliant browsers to resolve the image against the document HTML URI, failing image decoding.
   - The failed asset is NOT the `GemaSurabaya` venue logo; it is ResDiary's own platform badge.
   - The "Reserve Now" button is an external anchor linking to `https://www.resdiary.com/Restaurant/GemaSurabaya` (which redirects to DishCult).
   - This behavior is 100% owned by ResDiary's platform implementation.

2. **HTTPS Production Behavior**:
   - On HTTPS (`https:` protocol), `isOnSecurePage` evaluates to true.
   - ResDiary renders the complete in-page interactive table reservation interface (date picker, party size, area selection, time slot controls) with a clean SVG badge (`https://widget-themes.resdiary.com/widgetthemes/newwidgetlogo1.svg`) and exactly 0 broken images.
   - This is the authoritative, expected production behavior.

3. **GEMA Code Invariants & Prohibition of Masking**:
   - GEMA code defects: NONE.
   - GEMA CSP defects: NONE.
   - GEMA asset defects: NONE.
   - GEMA ReservationOverlay defects: NONE.
   - ResDiary venue-profile defects: NONE.
   - Modifying GEMA application code, injecting CSS masking, manipulating the DOM via MutationObserver, or reverse-engineering ResDiary internals to artificially alter the HTTP fallback is strictly PROHIBITED.

4. **Local Development & QA Expectation**:
   - When developing through plain `http://localhost`, the compact ResDiary fallback and its broken platform badge may be visible. This is NOT considered a GEMA regression.
   - Accurate visual verification of the ResDiary booking interface must be conducted in an HTTPS development/staging environment.
   - Production deployment must use HTTPS.

---

# ADR-013 — Local HTTPS Development Reverse Proxy Architecture for ResDiary QA

Status:

LOCKED

Decision:

1. **Dual Local Development Environments**:
   - **Normal HTTP Development**: `http://localhost:3001` via `npm run dev` (preserved unchanged as the default development workflow).
   - **Secure HTTPS QA Environment**: `https://localhost:3002` via `npm run dev:https` (reverse proxy to `http://localhost:3001`).
   - Both endpoints serve the identical Next.js application, source code, and hot-reload runtime.

2. **Reverse Proxy & HMR Architecture**:
   - The HTTPS endpoint is powered by a lightweight native Node.js reverse proxy (`apps/web/scripts/dev-https-proxy.cjs`) requiring zero third-party npm dependencies.
   - Forwards standard HTTP requests with `'x-forwarded-proto': 'https'`.
   - Forwards WebSocket upgrade connections (`server.on('upgrade', ...)`), ensuring Turbopack Fast Refresh / HMR works seamlessly over `wss://localhost:3002`.

3. **Certificate Management & Git Security**:
   - Certificates are stored in `apps/web/.certs/` (`localhost-cert.pem`, `localhost-key.pem`).
   - Automatically generated on first run with Subject Alternative Names (`DNS:localhost, IP:127.0.0.1`) via local `openssl`.
   - All certificates, keys, and `.certs/` directories are strictly ignored by `.gitignore` and must NEVER be committed to Git.
   - Developers may optionally trust the certificate via macOS Keychain or use `mkcert` for zero-warning browser sessions.

4. **Production Isolation**:
   - This architecture is strictly confined to local development.
   - Production Nginx, Hostinger VPS configuration, Docker setups, and production TLS are completely untouched.
   - ADR-011 and ADR-012 production safety invariants remain strictly active: live diary `GemaSurabaya/2025` must NEVER receive automated or test booking submissions.

5. **Authoritative Local Environment for ResDiary Visual QA**:
   - `https://localhost:3002` is the authoritative local environment for ResDiary visual and functional QA.
   - Modifying GEMA application code, CSS, or markup to alter ResDiary's HTTP-only fallback presentation on `http://localhost:3001` is strictly PROHIBITED.

---

# ADR-014 — Splash / Gateway Baseline Freeze

Status:

LOCKED / FROZEN

Decision:

1. **Approved Gateway Architecture**:
   - The authoritative Splash/Gateway architecture is **FULLSCREEN MEDIA BACKGROUND + RESPONSIVE CONTENT COMPOSITION**.
   - **Background**: Always fills `100vw × 100dvh` with `object-fit: cover` and `object-position: center`. Zero letterboxing, zero black/white bands, proportional crop allowed. Desktop and mobile video sources remain separate local same-origin MP4 assets.
   - **Content**: Adapts responsively to viewport aspect ratio with fluid group spacing and scaling. Fixed-ratio contained artboards (`aspect-[9/16]`) and letterboxed viewports are strictly PROHIBITED.

2. **Approved Visual State**:
   - Top motto (`clamp(3rem, 7.5dvh, 4.5rem)`), Gema logo group, Italian Food block, architectural background relationship, Welcome group (`calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1rem, 2.8dvh, 1.8rem))`), mobile gold accent hairline, loading hierarchy (Mobile: subtitle -> accent -> LOADING -> progress bar; Desktop: subtitle -> progress bar -> LOADING), progress bar, bottom metadata (`paddingLeft: clamp(1.8rem, 7dvw, 2.8rem)`, `paddingRight: clamp(1.8rem, 7.5dvw, 2.8rem)`, `paddingBottom: clamp(1.8rem, 5.8dvh, 2.8rem)`), and responsive spacing are FROZEN.
   - Zero opportunistic visual "improvements" or refactoring permitted.

3. **Approved Logo Asset**:
   - `apps/web/public/media/splash/gema-dark.png` is FROZEN as the authoritative unclipped Gema mark (complete G stroke, full descender loop, complete right terminal, 16px transparent safety padding on all sides).
   - Auto-trimming, cropping, regenerating, or removing padding without explicit Product Owner authorization is strictly PROHIBITED.

4. **Approved Video Delivery & Assets**:
   - `/media/splash/gema-splash-desktop.mp4` and `/media/splash/gema-splash-mobile.mp4` are FROZEN.
   - Recompressing, regenerating, replacing, or changing framing is strictly PROHIBITED.

5. **Approved Responsive Boundary**:
   - Empirically validated across ~360px → 540px mobile width (short and tall aspect ratios) and 1280px → 1920px desktop landscape ratios.
   - Future tasks must not replace the fluid responsive model with fixed top percentages, exact-device breakpoints, contained 9:16 artboards, letterboxed media, or per-device CSS hacks.

6. **Preserved QA Instrumentation & Canonical Suite**:
   - Non-visual `data-splash-element="..."` attributes are approved QA instrumentation and must be preserved.
   - `apps/web/scripts/qa-splash-006b.cjs` is the canonical Splash regression test suite for empirical screenshot capture, contact sheet assembly, and functional validation.

7. **Future Regression Invariant**:
   - Any future task modifying `GatewayExperience.tsx` must explicitly verify it does not regress the approved Splash baseline: fullscreen media, zero letterboxing, logo completeness, divider/Welcome clearance, loading hierarchy, bottom metadata, mobile responsive composition, click-to-enter, ambient audio unlock gesture, and Homepage `scrollY === 0` normalization.

8. **Current Splash Status**:
   - **FROZEN**. Future changes require an explicit Product Owner request and must be treated as a newly scoped Splash task. Modifying Gateway visual behavior incidentally during unrelated work is strictly PROHIBITED.

---

# ADR-015 — Database-Driven Splash Video Assets & Removal of Loading Module (SPLASH-008)

Status:

LOCKED

Decision:

1. **Database-Driven Splash Media Configuration & Strict Hardening (SPLASH-008A)**:
   - `GatewayExperience` no longer owns authoritative Splash video URLs as hard-coded constants.
   - Authoritative video URLs and metadata are stored in PostgreSQL table `splash_media_config` (`key`, `media_type`, `variant`, `asset_path`, `mime_type`, `is_enabled`, `created_at`, `updated_at`).
   - MP4 binaries are static application assets in `apps/web/public/media/splash/` and are NOT stored as database BLOBs.
   - Server-side data loader `getSplashMediaConfig()` in `apps/web/src/lib/splashConfig.ts` queries PostgreSQL during page render and passes `splashConfig` to `GatewayExperience`.
   - **Removal of Hardcoded Video Fallbacks**: All hardcoded video fallback URLs and constants are permanently removed from application configuration logic. If the database is unreachable, a variant record is missing, or `is_enabled = false`, the application does NOT substitute an alternative video URL; it falls back strictly to the authoritative still reference image (`/media/splash/desktop-ref.png` or `mobile-ref.png`).
   - **Credential Safety**: No database credentials, host, or ports are hard-coded in application source code.
   - **CMS Isolation**: Payload CMS is NOT involved; no collections, globals, or admin UI exposure.

2. **Removal of Loading Module & Rebalanced Lower Composition**:
   - The entire visual loading UI (`LOADING...` text and animated progress bar) is permanently removed from both Desktop and Mobile Splash compositions and accessible text landmarks.
   - A short, static, warm gold hairline (`data-splash-element="accent"`, `w-16 h-[1px] bg-[#BFA16F]/70`) serves as a quiet decorative terminator after `GOOD FOOD. BRIGHTER DAYS.` on both desktop and mobile compositions.
   - Lower composition is responsively rebalanced:
     - Desktop: Welcome group sits at `top-[75.5%]`, subtitle at `top-[84.5%]`, static gold hairline at `top-[88%]`, and bottom metadata elevated to `bottom-[4.5%]`.
     - Mobile: Welcome group sits at `calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1.2rem, 3.2dvh, 2rem))`, bottom metadata padding elevated to `clamp(2.2rem, 6.8dvh, 3.4rem)`.
     - Negative space remains balanced without empty voids, dead zones, or unnecessary new text.

3. **Authoritative Video Sources**:
   - Desktop: Authoritative source `/Users/jasonsjanuard/Desktop/GEMA/splash-screen-desktop.mp4` copied to `apps/web/public/media/splash/gema-splash-desktop.mp4` (SHA-256: `ab320f1878617dac9c3ab1cbf3e232c7aa191a8e7745676ba96e4c840f81346f`).
   - Mobile: Authoritative source `/Users/jasonsjanuard/Desktop/GEMA/splash-screen-mobile.mp4` verified identical to `apps/web/public/media/splash/gema-splash-mobile.mp4` (SHA-256: `70a429d7bb632cbe02911c75b00da8dd6e241bf6b9b8bc41cf45a7680d3516ea`).

4. **Preserved Invariants**:
   - Fullscreen background: `100vw × 100dvh` with proportional cover behavior and zero letterboxing.
   - Brand mark: Unclipped `gema-dark.png` preserved.
   - Functional gateway: Click anywhere to enter, audio user gesture initialization, `scrollY === 0` homepage reset, loop, muted, playsInline, poster fallback, and reduced motion still fallback.

---

# ADR-016 — Splash Bottom Metadata Responsive Rebalance (SPLASH-009)

Status:

LOCKED

Context:

On both desktop and mobile viewports, the bottom-right text block (`A TASTE OF ITALY ALWAYS`) was previously positioned too close to or colliding with the decorative gold horizontal line and corner ornament that are intrinsic to the background video and poster assets. Furthermore, the bottom-left establishment label used outdated copy (`EST. 2020`).

Decision:

1. **Copy Updates**:
   - Bottom-left establishment label updated from `EST. 2020` to `EST. 2026` across all occurrences: DOM desktop overlay, DOM mobile overlay, and screen reader accessible landmarks.
   - Bottom-right copy preserved strictly unchanged: `A TASTE` / `OF ITALY` / `ALWAYS`.
   - Zero new copy introduced.

2. **Strict Invariant on Background Video/Poster**:
   - The decorative gold line on the right side belongs intrinsically to the video and poster background assets.
   - Strictly no modification, faking, redrawing, hiding, or CSS repositioning was applied to the background video/poster media.
   - Clearance is achieved solely by repositioning the DOM metadata text blocks.

3. **Responsive Breakpoint & Band Architecture**:
   - **Band A (Mobile Small / Normal: 360px <= width < 430px)**:
     - Padding: `padding-left: clamp(2rem, 8dvw, 3rem)`, `padding-right: clamp(2.8rem, 11dvw, 4rem)`, `padding-bottom: clamp(4.2rem, 9.8dvh, 5.2rem)`.
     - Text block elevated to clear the mobile horizontal frame line (+49px to +59px clearance) with zero collision with falling leaves or side branches.
   - **Band B (Mobile Wide / Short-Wide: 430px <= width < 768px)**:
     - Padding: `padding-left: clamp(2.4rem, 9dvw, 3.6rem)`, `padding-right: clamp(3.8rem, 14dvw, 5.5rem)`, `padding-bottom: clamp(4.4rem, 10dvh, 5.4rem)`.
     - Text block shifted inward to avoid cover-crop encroachment from the right olive branch and elevated above the bottom frame.
   - **Override 1 (Short / Wide Mobile: width >= 430px and aspect ratio >= 0.56)**:
     - CSS Media Query: `@media (min-width: 430px) and (max-width: 767px) and (min-aspect-ratio: 56/100)`.
     - Padding: `padding-left: clamp(2.6rem, 9.5dvw, 3.8rem)`, `padding-right: clamp(4.5rem, 16dvw, 6.2rem)`, `padding-bottom: clamp(4.2rem, 9.8dvh, 5.2rem)`.
     - Insets text cleanly into the open cove below the protruding olive leaf (+53px to +56px line clearance, generous headroom).
   - **Band C & D (Tablet / Desktop: width >= 768px)**:
     - Class `.splash-bottom-meta-desktop`: `bottom: clamp(4.2rem, 10.2%, 6.2rem)` with `left-[7.2%]` and `right-[7.2%]`.
     - Elevates text block safely above the desktop decorative gold line (+21px to +27px clearance).
   - **Override 2 (Short Desktop: width >= 1280px and height <= 800px)**:
     - CSS Media Query: `@media (min-width: 1280px) and (max-height: 800px)`.
     - Class `.splash-bottom-meta-desktop`: `bottom: clamp(4.6rem, 10.8%, 6.5rem)`.
     - Provides +26px to +28px clearance above the decorative line on 720p and 768p viewports.

4. **Desktop Vertical Rhythm & Central Baseline Restoration (Superseded by ADR-017)**:
   - *Note*: The upward shift of the central Welcome group in SPLASH-009 was identified as unapproved collateral change and was explicitly superseded by **ADR-017 (SPLASH-009A)**, which restored the central composition to its approved baseline (`top-[71%]`, `top-[75.5%]`, `top-[84.5%]`, `top-[88%]`).

5. **Empirical Verification**:
   - 100% pass across all 17 viewports (13 mobile, 4 desktop) in `qa-splash-009.cjs`.
   - Contact sheets verified for mobile and desktop.
   - Zero regressions to fullscreen background cover, unclipped brand mark, click-to-enter gateway, or database-driven video delivery.

---

# ADR-017 — Restoration of Approved Central Desktop Splash Composition (SPLASH-009A)

Status:

LOCKED

Date:

2026-09-24

Context:

SPLASH-009 inadvertently shifted the central Welcome composition upward (divider 71% -> 64.5%, welcome 75.5% -> 68.5%, good-food 84.5% -> 76.5%, accent 88% -> 79.5%) based on a synthetic 1D Y-axis collision check that failed to recognize that central elements (X: 47.5%–52.5%) and corner metadata blocks (X: 7.2% and 92.8%) occupy completely distinct horizontal columns with over 250px–800px of open negative space between them.

The user issued `SPLASH-009A` mandating the immediate restoration of the central composition to its pre-SPLASH-009 approved visual baseline while strictly preserving all SPLASH-009 responsive bottom metadata work.

Decision:

1. **Restored Central Desktop Splash Composition Baseline**:
   - `divider`: restored to `top-[71%]`
   - `welcome`: restored to `top-[75.5%]`
   - `good-food`: restored to `top-[84.5%]`
   - `accent`: restored to `top-[88%]`
   - No redesign, no cadence re-optimization, and no visual migration upward.

2. **Preserved SPLASH-009 Bottom Metadata System**:
   - Copy: `EST. 2026` (bottom-left) and `A TASTE OF ITALY ALWAYS` (bottom-right) strictly preserved.
   - Mobile Band A & Band B responsive padding preserved.
   - Mobile Override 1 (`min-aspect-ratio: 56/100`) preserved.
   - Desktop Band C & D `.splash-bottom-meta-desktop` (`bottom: clamp(4.2rem, 10.2%, 6.2rem)`) preserved.
   - Desktop Override 2 (`min-width: 1280px` and `max-height: 800px`, `bottom: clamp(4.6rem, 10.8%, 6.5rem)`) preserved.

3. **Collision Governance**:
   - Collision checks evaluate true 2D geometry (X & Y bounding box intersection).
   - Zero 2D collision exists between the central column and corner metadata blocks.
   - Any clearance constraints are solved locally within the bottom metadata system without moving central Welcome elements or modifying background media.

4. **Zero New Breakpoints**:
   - No unnecessary device-specific media queries added.

5. **Empirical Verification**:
   - 100% pass across all 17 viewports (13 mobile, 4 desktop) in `qa-splash-009.cjs`.
   - Visual inspection of representative viewports (390×844, 430×760, 430×932, 1280×720, 1366×768, 1440×900, 1920×1080) confirmed pristine quiet-luxury aesthetic, proper spacing below villa terrace, and zero overlap.

---

# ADR-018 — Mobile Bottom Metadata Position Correction (SPLASH-009B)

Status:

LOCKED

Date:

2026-09-25

Context:

In SPLASH-009, mobile bottom metadata was elevated too far upward (`padding-bottom: clamp(4.2rem, 9.8dvh, 5.2rem)`), causing `A TASTE OF ITALY ALWAYS` to enter the olive foliage cluster and visually compete with the right leaves. The Product Owner mandated that mobile bottom metadata must stay low, visually anchored to the bottom frame, with the olive branch and foliage remaining visually above the text.

Decision:

1. **Mobile Bottom Metadata Lowered**:
   - Lowered `padding-bottom` across mobile rules (Band A, Band B, Override 1) to `clamp(1.8rem, 4.2dvh, 2.4rem)` (~29px–38px).
   - `A TASTE OF ITALY ALWAYS` and `EST. 2026` sit comfortably and intentionally near the bottom decorative frame line (+11px to +15px clearance).
   - Foliage cluster is visually completely above the metadata block across all mobile viewports.
   - Left (`EST. 2026`) and right (`A TASTE OF ITALY ALWAYS`) maintain a perfectly balanced bottom baseline (0px baseline difference).

2. **Strict Scope Containment**:
   - Desktop layout, desktop metadata positions, short desktop override, and desktop horizontal insets: 100% UNTOUCHED.
   - Central Welcome composition: 100% UNTOUCHED.
   - Background video/poster media: 100% UNTOUCHED.
   - Copy: `EST. 2026` and `A TASTE OF ITALY ALWAYS` 100% LOCKED.
   - Zero new breakpoints added.

3. **Visual & Empirical QA**:
   - Visual inspection across all 10 mobile viewports (360×800, 390×700, 390×844, 402×874, 412×915, 430×760, 430×850, 430×932, 480×800, 540×960) confirmed 100% PASS: foliage above text, zero text covered by leaves, bottom frame visible, metadata balanced.
   - Full 17-viewport test suite (`qa-splash-009.cjs`): 100% PASS.
   - Typecheck and Turbopack production build: 100% PASS.

---

# ADR-019 — Desktop Bottom Metadata Reposition + Year Correction (SPLASH-009C)

Status:

LOCKED

Date:

2026-09-25

Context:

The Product Owner requested two primary adjustments to the desktop splash screen:
1. Reposition desktop bottom metadata into the target lower-corner framing zone (open alcove in lower right indicated by red target box; left `EST. 2025` rebalanced symmetrically).
2. Correct the founding year from `2026` to `2025` across all splash layers (`.sr-only` landmark, desktop overlay, mobile overlay).

Scope rules mandated:
- Desktop only for layout repositioning. Mobile positioning must remain strictly preserved from SPLASH-009B.
- Preserve dynamic responsive clamp system (no static fixed hacks).
- Central composition (divider, Welcome script, Good Food, accent hairline) 100% UNTOUCHED.
- Background media (villa illustration, foliage, video) 100% UNTOUCHED.

Decision:

1. **Desktop Bottom Metadata Repositioned**:
   - Right text (`A TASTE / OF ITALY / ALWAYS`) shifted right from `8.5%` to `5.0%` (`right-[5.0%]`).
   - Left text (`EST. 2025`) shifted left from `8.5%` to `5.0%` (`left-[5.0%]`), creating balanced, symmetrical horizontal margins.
   - Vertical baseline lowered from `clamp(4.2rem, 10.2%, 6.2rem)` to `clamp(3.8rem, 9.0%, 5.8rem)` on Band C/D desktop, and `clamp(4.0rem, 9.4%, 5.8rem)` on Override 2 (short desktop <= 800px).
   - This smoothly seats both metadata blocks in the open parchment framing zone between the central composition and the outer vertical frame lines, maintaining +15px to +17px clearance above the decorative bottom gold line.
   - Left and right desktop blocks share an identical baseline (0px baseline difference).

2. **Year Corrected to 2025**:
   - Updated from `EST. 2026` to `EST. 2025` across:
     - Screen-reader accessible landmark (`<p>EST. 2025</p>`)
     - Desktop overlay layout (`EST. 2025`)
     - Mobile overlay layout (`EST. 2025`)
   - Zero occurrences of `2026` or `2020` remain in the splash screen DOM or components.

3. **Strict Invariant Containment**:
   - Mobile bottom metadata positioning: 100% UNTOUCHED (SPLASH-009B layout preserved).
   - Central Welcome composition: 100% UNTOUCHED (divider 71%, welcome 75.5%, good-food 84.5%, accent 88%).
   - Background video/poster media: 100% UNTOUCHED.
   - Dynamic responsive system: fully fluid clamp rules preserved.

4. **Empirical & Visual Verification**:
   - Evaluated across all 5 desktop viewports (1280×720, 1366×768, 1440×900, 1600×900, 1920×1080) and 13 mobile viewports: 100% PASS (18/18).
   - Visual inspection of rendered screenshots confirmed elegant corner placement, balanced baselines, clear foliage margins, and zero collision.
   - Typecheck and Turbopack production build: 100% PASS with zero errors.

---

# Pending Decisions

The following are NOT YET DECIDED:

- CMS platform / custom CMS strategy
- backend architecture
- database
- admin authentication
- authorization model
- media storage
- deployment architecture
- timezone policy
- test framework

Do not treat any candidate solution as approved until explicitly decided.

