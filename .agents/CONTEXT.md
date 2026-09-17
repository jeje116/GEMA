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

## 2. Current Frontend Baseline

Current known stack:

- React 19
- TypeScript
- Vite 6.4.3
- React Router
- motion/react (Framer Motion)
- react-markdown

Package management:

- npm with package-lock.json (lockfileVersion 3) is the verified reproducible install method.
- bun.lock exists from the original Google AI Studio export and is preserved but unused.

Initial frontend design/source:

Google AI Studio generated frontend.

Existing implementation is the current visual baseline until explicitly revised.

Known pre-existing issues:

- GatewayExperience.tsx line 89: TS2367 type-narrowing error (pre-existing, not introduced by GEMA-002).
- Vite build emits a chunk-size warning for the main JS bundle (>500 kB). Not a failure.


---

## 3. Repository & Application Directory

Repository root:

`D:\Projects\GEMA` (Git initialized, tracked on branch `main`)

Remote origin:

`https://github.com/jeje116/GEMA.git`

Current application source:

`gema-restaurant-&-societiet/`

Original source archive may remain preserved separately as an immutable baseline.


---

## 4. Current Content State

Current event/content implementation includes static TypeScript data.

Known event data location:

`src/data/events.ts`

Content is not yet backed by a production CMS.


---

## 5. Backend Status

Current status:

- Production backend architecture: NOT SELECTED
- Production database: NOT SELECTED
- CMS architecture: NOT SELECTED
- Admin authentication: NOT SELECTED
- Media storage: NOT SELECTED


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
Local development environment

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
- **Direct WhatsApp Reservation**: All primary reservation CTAs across header, hero, footer, mobile reserve bar, visit, occasions, and events route directly to `https://wa.me/6281252200049`.
