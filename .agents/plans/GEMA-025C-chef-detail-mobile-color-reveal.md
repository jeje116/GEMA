# GEMA-025C — Chef Detail Page Mobile Color Reveal Correction

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-19
Scope: Focused visual refinement for the Chef Mandif Warokka portrait image on the Chef detail page (`/en/chef/mandif-warokka`) on mobile/touch devices.

---

## 1. Root-Cause Analysis
- **Previous Target**: Homepage Chef preview component (`apps/web/src/components/home/ChefPreview.tsx`) on route `/en`.
- **Intended Target**: Chef detail page component (`apps/web/src/components/chef/ChefClient.tsx`) on route `/en/chef/mandif-warokka`.
- **Correction**: Apply the approved mobile grayscale-to-color reveal behavior directly to the large Mandif Warokka portrait on `/en/chef/mandif-warokka`.

---

## 2. In-Scope Behavior
- Capability-based touch detection: `window.matchMedia('(hover: none), (pointer: coarse)')`.
- Initial state: Grayscale (~100%).
- Viewport trigger: Dedicated `IntersectionObserver` observing portrait container with threshold `[0, 0.30, 0.35, 0.5, 1.0]`. Triggers when `intersectionRatio >= 0.30`.
- Hold: Holds grayscale state for ~350ms.
- Transition: Smoothly transitions to full natural color (`grayscale(0%)`) over ~800ms ease-out (`transition: 'filter 800ms ease-out'`).
- Permanence: Runs once only. Disconnects observer immediately. Remains full color permanently on revisit.
- Desktop preservation: Preserves existing desktop `grayscale hover:grayscale-0 transition-all duration-1000` interaction.
- Reduced motion: Direct full color immediately (`grayscale-0`), zero delay, zero transition under `prefers-reduced-motion: reduce`.
- Asset: Single color asset only (`/media/chef/chef-mandif-warokka.jpg`).

---

## 3. Untouched Components & Out-of-Scope
- Portrait layout, dimensions (`aspect-[3/4]`), and crop.
- Page grid and spacing (`py-24 md:py-32`, `gap-12 lg:gap-24`).
- Headings, typography, Culinary Director label, biography copy, quote, border.
- Navbar, footer, audio controls.
- Homepage `ChefPreview.tsx` (isolated).
- `apps/cms`.

---

## 4. Verification Contract
1. `npm run typecheck` passes in `apps/web`.
2. `npm run build` passes in `apps/web`.
3. Browser QA executed on `http://localhost:3001/en/chef/mandif-warokka`:
   - Mobile 390×844: Initial grayscale, ~350ms hold, ~800ms mid-transition, final color (~1.4s), revisit permanence.
   - Mobile ~402px: Tested for viewport variance.
   - Reduced motion: Immediate full color.
   - Desktop 1280×800: Existing desktop behavior preserved.
   - Evidence screenshots captured from `/en/chef/mandif-warokka`.
