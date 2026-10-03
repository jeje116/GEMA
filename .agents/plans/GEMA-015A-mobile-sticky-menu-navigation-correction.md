# GEMA-015A Mobile Sticky Menu Navigation Correction Plan

## Objective
Fix the mobile sticky menu navigation bar disappearance bug where the sticky bar vanished upon scrolling past the top container or when selecting a section (such as COCKTAIL):
1. **Root-Cause Resolution**:
   - Container bounding constraint: The sticky bar was formerly rendered inside `<div className="lg:w-64 flex-shrink-0">`, which is only ~130px tall on mobile (`flex-col`). In CSS, a `position: sticky` element is strictly bounded by its containing block and scrolls off when the containing block leaves the viewport.
   - Containing block transform: `PageReveal` wrapper has `matrix(1, 0, 0, 1, 0, 0)` transform from Framer Motion, which trapped any `position: fixed` element inside `PageReveal` instead of anchoring it to the browser viewport.
   - Inaccurate offset: Programmatic scrolling used a hardcoded 160px offset that placed `#cocktail` down with the top selector still partially visible above it, preventing the sticky threshold from triggering and slightly clipping the section content.
2. **Corrective Architecture**:
   - Render the Mobile Compact Sticky Section Bar directly into `document.body` via `createPortal`.
   - Render the Mobile Bottom Sheet Modal directly into `document.body` via `createPortal`.
   - Position the sticky bar with `fixed left-0 right-0 z-[35]` at `top: ${headerHeight}px` where `headerHeight` is derived dynamically from `document.querySelector('header')` (fallback 80px).
   - Set smooth scroll offset to `headerHeight + 48 + 24 = 152px`, ensuring the section heading (e.g. `COCKTAIL`) clears the sticky bar with 24px of editorial margin.
   - Implement deterministic scrollspy tracking on scroll checking each category's bounding box.
3. **Strict Constraints**:
   - Zero changes to Menu data, categories, prices, portions, or descriptions.
   - Desktop Menu navigation remains completely untouched.
