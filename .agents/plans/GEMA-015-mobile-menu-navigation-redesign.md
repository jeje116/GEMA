# GEMA-015 Mobile Menu Navigation Redesign Implementation Plan

## Objective
Implement the approved mobile Menu navigation redesign:
1. **Top Mobile Selector**: A refined, non-sticky FOOD / BEVERAGE selector at the top of the mobile Menu page with equal tap zones, centered hairline separator, and subtle terracotta active underline.
2. **Compact Sticky Section Bar**: Appears below the header once scrolled past the top selector, displaying the active section name in uppercase serif with a subtle chevron dropdown indicator.
3. **Bottom Sheet Navigation**: Opens when the sticky bar is tapped. Contains the matching FOOD / BEVERAGE selector at the top, "SECTIONS" heading, and active section list. Toggling Food/Beverage updates the list immediately in-sheet while remaining open; selecting a section closes the sheet and smoothly scrolls to it.
4. **Desktop Safety**: Desktop Menu navigation remains 100% unchanged. Menu data and translations remain 100% untouched.

## Strict Scope
- **Files Modified**: `apps/web/src/components/menu/MenuClient.tsx`
- **Untouched Systems**:
  - Menu data, pricing, descriptions, portions, categories (`menu.ts`)
  - Desktop menu navigation layout and interaction
  - Reservation system
  - Header, Footer, Audio, and Homepage components

## Implementation Details
1. **Top Mobile Selector**:
   - Placed in `ref={topSelectorRef}` near the top of the mobile menu page.
   - Non-sticky layout (`lg:hidden mb-10 pt-2`).
   - Uses `MenuSwitcher` with `underlineActive={true}` to render a subtle terracotta active indicator (`w-8 h-[1.5px] bg-[var(--terracotta)] mt-1 rounded-full`).
2. **Compact Sticky Section Bar**:
   - Monitored via scroll listener checking `topSelectorRef.current.getBoundingClientRect().bottom < 80`.
   - Fixed below mobile header at `sticky top-20 z-30`.
   - Clean, quiet-luxury styling: ivory background, soft bottom border, uppercase active category name in serif typography, subtle chevron down indicator.
   - Tapping opens the bottom sheet.
3. **Bottom Sheet Navigation**:
   - Rendered using `framer-motion` (`AnimatePresence`).
   - Dimmed backdrop (`bg-[var(--espresso-900)]/40`) with tap-to-close.
   - Sheet modal slides up from bottom with spring animation (`rounded-t-2xl bg-[var(--ivory-100)]`).
   - Top drag handle and accessible close (`✕`) button.
   - Synchronized `MenuSwitcher` at top with `underlineActive={true}`.
   - Uppercase `SECTIONS` label.
   - Category list showing active item highlighted with terracotta indicator.
   - Switching FOOD / BEVERAGE updates category list immediately without closing sheet.
   - Tapping a category scrolls smoothly to the target section (`#<category-id>`) and closes the sheet.
4. **Accessibility & Usability**:
   - Body scroll lock (`overflow = 'hidden'`) while bottom sheet is open.
   - Escape key dismiss handler.
   - ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`).

## Verification Strategy
- Typecheck: `npm run typecheck` (zero errors).
- Build: `npm run build` (Turbopack static build).
- Empirical Browser QA at 390x844 viewport:
  - Initial state: Non-sticky top selector with terracotta underline.
  - Scroll state: Compact sticky section bar appears at `top-20` displaying active section.
  - Bottom sheet: Opens smoothly, displays synced selector and active category list.
  - In-sheet toggle: Switching to BEVERAGE updates category list to 9 beverage categories, sheet remains open.
  - Selection & scroll: Tapping `ICED TEA` closes sheet and scrolls smoothly to `#iced-tea`.
  - Desktop check: Desktop layout at 1440px remains identical to baseline.
