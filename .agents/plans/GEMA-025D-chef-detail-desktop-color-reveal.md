# GEMA-025D: Chef Detail Page Desktop Color Reveal

## Objective
Apply the approved color-reveal behavior to the **Desktop** version of the Chef detail page (`/en/chef/mandif-warokka`) portrait, creating consistent editorial behavior across both mobile and desktop.

## Files to Modify
- `apps/web/src/components/chef/ChefClient.tsx`

## Files to Create
- None

## In-Scope Behavior
- When `/en/chef/mandif-warokka` loads on desktop:
  1. The large portrait of Mandif Warokka renders initially in grayscale (`grayscale(100%)`).
  2. After the entrance curtain clears and viewport visibility criteria are met (>= 30%), holds grayscale for ~350ms.
  3. Transitions smoothly to full natural color (`grayscale(0%)`) over ~800ms ease-out.
  4. Remains in full natural color permanently for the session (no reset on scroll away, no replay on revisit).
  5. If `prefers-reduced-motion: reduce` is active, renders in full color immediately with zero hold and zero transition.
- Mobile behavior remains active and regression-free.

## Out-of-Scope Behavior
- Homepage (`ChefPreview.tsx`) remains untouched.
- No changes to copy, layout, typography, quote, navbar, audio button, or page structure.
- No new image assets (uses the existing `/media/chef/chef-mandif-warokka.jpg`).

## Test Contract
1. **Desktop Initial Grayscale**: Computed `filter: grayscale(1)`.
2. **Desktop Mid-transition**: Computed `filter` interpolating towards color (~`grayscale(0.3-0.5)`).
3. **Desktop Final Color**: Computed `filter: grayscale(0)`.
4. **Desktop Revisit**: Scroll away and return; computed `filter: grayscale(0)`.
5. **Desktop Reduced Motion**: Computed `filter: grayscale(0)` immediately.
6. **Mobile Regression**: Verified that 390x844 mobile reveal continues to work identically.
7. **Typecheck & Build**: PASS with 0 errors.
