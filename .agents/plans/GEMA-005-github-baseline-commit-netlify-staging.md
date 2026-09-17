# GEMA-005: GitHub Baseline Commit & Netlify Design Staging Deployment

## 1. Objective
Publish the CURRENT approved Next.js application (`apps/web`) to Netlify as a temporary DESIGN STAGING environment for external auditor review.
- Do NOT begin Payload CMS.
- Do NOT redesign the frontend.
- Do NOT modify product behavior unless a deployment-specific issue requires it.

## 2. Deployment Source & Monorepo Configuration
- Canonical application: `apps/web`
- Repository root: `GEMA/`
- Netlify builds only `apps/web`. Legacy `gema-restaurant-&-societiet/` remains untouched.
- `netlify.toml` configuration:
  ```toml
  [build]
    base = "apps/web"
    command = "npm run build"
    publish = ".next"

  [[plugins]]
    package = "@netlify/plugin-nextjs"
  ```
  Note: `@netlify/plugin-nextjs` (v5 OpenNext runtime adapter) is installed in `apps/web` as devDependency and declared in `netlify.toml` to ensure Next.js serverless functions and SSR routes are handled correctly on Netlify.

## 3. Git Audit & Exclusions
- Verify forbidden files are NOT tracked or staged:
  - `**/node_modules/`
  - `**/.next/`
  - `**/dist/`
  - `**/.vite/`
  - `drive-download-*/`
  - ~145MB original Chef master source video
  - `.env`, `.env.*`
  - Root duplicate media (`/GEMA_brand.png`, `/stillness-in-the-atrium_GEMA.mp3`)
- Verify required canonical deployed media in `apps/web/public/media/`:
  - `apps/web/public/media/brand/gema-logo-light.png` (35,247 bytes / 34.4 KB)
  - `apps/web/public/media/audio/stillness-in-the-atrium-gema.mp3` (2,522,427 bytes / 2.41 MB)
  - `apps/web/public/media/video/chef-home-loop.mp4` (7,096,264 bytes / 6.77 MB)

## 4. Local Release Verification
From `apps/web`:
- `npm run typecheck` (tsc --noEmit)
- `npm run build` (Next.js production Turbopack build)
- Smoke test production server locally on port 3001.

## 5. Commit & Push
- Commit message: `feat: prepare GEMA Next.js design staging`
- Push `main` to `origin/main` (`https://github.com/jeje116/GEMA.git`).

## 6. Netlify Post-Deployment QA
Verify live staging URL `https://gemta.netlify.app`:
- Routes: `/`, `/en`, `/id`, `/en/menu`, `/en/experience`, `/en/occasions`, `/en/events`, `/en/journal`, `/en/about`, `/en/chef/mandif-warokka`, `/en/recognition`, `/en/visit`
- Media: brand logo, ambient audio, chef video, widened blob
- Interactions: Gateway audio on click, AudioControl toggle, Chef audio ducking, ReservationOverlay, WhatsApp in new tab, original GEMA tab preserved, Google Maps embed
- Responsive: Desktop (1440px), Mobile (390px)
- Console: no hydration errors, no 404s on media

## 7. Execution & QA Evidence (Status: DONE)
- **Commit**: `2947012a0e0d228af4b60120b256029a41b87b9e` (`feat: prepare GEMA Next.js design staging`)
- **Remote**: Pushed to `origin/main` (`https://github.com/jeje116/GEMA.git`)
- **Netlify Build**: Completed automatically via OpenNext adapter (`@netlify/plugin-nextjs`).
- **Live Staging Verification (16/16 PASSED)**:
  - `✓ [308] /` (redirects to `/en`)
  - `✓ [200] /en`
  - `✓ [200] /id`
  - `✓ [200] /en/menu`
  - `✓ [200] /en/experience`
  - `✓ [200] /en/occasions`
  - `✓ [200] /en/events`
  - `✓ [200] /en/events/private-table-series`
  - `✓ [200] /en/journal`
  - `✓ [200] /en/about`
  - `✓ [200] /en/chef/mandif-warokka`
  - `✓ [200] /en/recognition`
  - `✓ [200] /en/visit`
  - `✓ [200] /media/brand/gema-logo-light.png`
  - `✓ [200] /media/audio/stillness-in-the-atrium-gema.mp3`
  - `✓ [200] /media/video/chef-home-loop.mp4`
  - Verified presence of widened blob clip-path `0.7725` in live HTML.

