# Implementation Plan: GEMA-SPLASH-008 Database-Driven Splash Video Assets + Remove Loading Module

## Objective
Implement two approved changes to the frozen GEMA Splash baseline:
1. **Database-Driven Splash Video Configuration**: Replace hard-coded Splash video URLs in `GatewayExperience` with video asset records read from the PostgreSQL database via server-side data access. MP4 binaries remain static assets under `apps/web/public/media/splash/`; database stores metadata + runtime path. CMS is completely isolated and NOT involved.
2. **Remove Loading Module & Rebalance Lower Composition**: Remove `LOADING...` and animated progress bar from both Desktop and Mobile Splash. Retain/introduce a short static warm gold hairline as a decorative terminator after `GOOD FOOD. BRIGHTER DAYS.` on both viewports. Rebalance the lower composition responsively to eliminate dead zones without overfilling negative space.

## Authoritative Local Sources Verification
- Desktop Source: `/Users/jasonsjanuard/Desktop/GEMA/splash-screen-desktop.mp4`
  - Dimensions: 1920x1080 (16:9), Duration: 10s, Codec: H.264 / AAC, Size: 19,251,063 bytes.
  - SHA-256: `ab320f1878617dac9c3ab1cbf3e232c7aa191a8e7745676ba96e4c840f81346f`.
  - Differed from previous public asset -> Copied to `apps/web/public/media/splash/gema-splash-desktop.mp4`.
- Mobile Source: `/Users/jasonsjanuard/Desktop/GEMA/splash-screen-mobile.mp4`
  - Dimensions: 720x1280 (9:16), Duration: 10s, Codec: H.264 / AAC, Size: 2,491,002 bytes.
  - SHA-256: `70a429d7bb632cbe02911c75b00da8dd6e241bf6b9b8bc41cf45a7680d3516ea`.
  - Identical to existing `apps/web/public/media/splash/gema-splash-mobile.mp4` -> Preserved without rewriting.

## Database & Persistence Architecture
- Technology: Existing PostgreSQL 16 (`DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5435/gema_payload`).
- Driver: `pg` (node-postgres).
- Schema: Dedicated non-CMS table `splash_media_config`:
  - `key` (VARCHAR(64) PRIMARY KEY / UNIQUE)
  - `media_type` (VARCHAR(32))
  - `variant` (VARCHAR(32))
  - `asset_path` (VARCHAR(255))
  - `mime_type` (VARCHAR(64))
  - `is_enabled` (BOOLEAN)
  - `created_at`, `updated_at` (TIMESTAMPTZ)
- Migration & Seed Script: `apps/web/scripts/migrate-splash-config.cjs`
- Server Loader: `apps/web/src/lib/splashConfig.ts` with `getSplashMediaConfig()`
- Layout Integration: `apps/web/src/app/(frontend)/[locale]/layout.tsx` fetches config during server render and passes `splashConfig` to `GatewayExperience`.
- CMS Isolation: Payload CMS collections, globals, and config are 100% untouched.

## Files to Modify
- `apps/web/src/app/(frontend)/[locale]/layout.tsx`: Fetch `splashConfig` and pass prop to `GatewayExperience`.
- `apps/web/src/components/motion/GatewayExperience.tsx`:
  - Consume `splashConfig` prop with safe fallback.
  - Remove hardcoded authoritative URLs.
  - Remove `LOADING...` and progress bar from sr-only, desktop overlay, and mobile overlay.
  - Add centered static gold hairline below subtitle on desktop (`data-splash-element="accent"`).
  - Rebalance Welcome group and bottom metadata vertical positions.
  - Remove `data-splash-element="loading"` and `data-splash-element="progress"`.
- `apps/web/scripts/qa-splash-006b.cjs` (or new `qa-splash-008.cjs`): Update assertions to verify absence of loading/progress elements, presence of static terminator, and DB-configured video paths.

## Files to Create
- `apps/web/scripts/migrate-splash-config.cjs` (already executed)
- `apps/web/src/lib/splashConfig.ts` (already created)
- `apps/web/scripts/qa-splash-008.cjs`

## Untouched Components
- `gema-dark.png` (unmodified)
- Payload CMS collections / globals / schema (unmodified)
- Homepage, Menu, Reservation pages (unmodified)

## Verification Contract
1. Code QA: `npm run typecheck` and `npm run build` must pass.
2. DB Verification: `splash_media_config` contains enabled records for desktop and mobile.
3. Network Video Verification: Video URL loaded in browser matches DB path `/media/splash/gema-splash-desktop.mp4` / `/media/splash/gema-splash-mobile.mp4`.
4. Absence of Loading UI: Zero `LOADING...` text and zero progress bar in DOM.
5. Presence of Decorative Terminator: Short static gold hairline present on both desktop and mobile.
6. Fullscreen & Visual Balance: 17 viewports tested with Playwright, contact sheets generated, zero collisions, zero letterboxing.
