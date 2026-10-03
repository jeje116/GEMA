# GEMA-025B — Chef Image Mobile Color Reveal

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-19
Scope: Focused visual refinement for the Chef image on the homepage on mobile/touch devices.

---

## 1. Objective
Implement a one-time viewport color reveal for the Chef image on the homepage for mobile/touch devices:
- Starts grayscale (~100%).
- Triggers when Chef image enters viewport (~35% visible).
- Holds grayscale for ~350ms.
- Smoothly transitions from grayscale to full color over ~800ms ease-out.
- Remains full color permanently for the session/view (never reverts on scroll).
- Preserves desktop scroll saturation and hover interaction.
- Direct full color for prefers-reduced-motion.

---

## 2. In-Scope Behavior
- Capability-based touch detection via `window.matchMedia('(hover: none), (pointer: coarse)')`.
- Dedicated `IntersectionObserver` on `mediaRef` with threshold ~0.35.
- Timer: 350ms hold, then `isMobileRevealed = true`.
- CSS filter transition: `transition: 'filter 800ms ease-out'`.
- Desktop pointer-based hover support via `onMouseEnter`/`onMouseLeave` preserving existing `saturation` transform.
- Reduced motion: full color immediately, zero transition.

---

## 3. Out-of-Scope & Untouched Components
- Chef section layout, grid, spacing, and typography.
- Chef image/video sources (`homeAssets.chefVideo.src`, `poster`).
- Terracotta outline SVG and blob shape clipPath.
- Ambient audio hysteresis observer and audioManager logic.
- Other homepage sections, navbar, footer.
- `apps/cms`.

---

## 4. Verification Contract
1. `npm run typecheck` passes in `apps/web`.
2. `npm run build` passes in `apps/web`.
3. Desktop browser QA:
   - Existing scroll saturation preserved.
   - Hover grayscale -> color verified.
   - No automatic mobile reveal overriding desktop hover.
4. Mobile browser QA (~390px viewport, touch enabled):
   - Starts grayscale when scrolled into view.
   - Holds ~350ms.
   - Transitions over ~800ms to full color.
   - Stays full color when scrolling away and back.
   - No re-triggering.
5. Reduced motion QA:
   - Shows full color immediately.
