# GEMA-017 — Menu Page Authentic Media Integration

## Objective
Implement a restrained authentic-media treatment for the Menu page (`/menu`) without redesigning the menu, modifying menu data, or compromising text-first scanability. Add exactly ONE contextual editorial media panel in the main menu content area that smoothly transitions according to the active menu type (`FOOD` ↔ `BEVERAGE`).

---

## Media Mapping & Assets
1. **Food Mode**:
   - **Source**: `FNR03012.jpg` (Overhead table spread with sliced steak, visible pesto pasta, antipasti, fish, tableware)
   - **Target Web Asset**: `apps/web/public/media/menu/menu-food-overview.jpg`
   - **Visual**: Authentic dining table overview representing the breadth of GEMA's food offering without association with one specific dish.
   - **Alt Text**:
     - EN: `"A selection of dishes served at GEMA"`
     - ID: `"Pilihan hidangan yang disajikan di GEMA"`

2. **Beverage Mode**:
   - **Source**: `QAR04031.jpg` (Cocktail craft/preparation with shaker, strainer, stream, coupe glass, bartender hands)
   - **Target Web Asset**: `apps/web/public/media/menu/menu-beverage-cocktail.jpg`
   - **Visual**: Bartender preparing and straining a cocktail into a coupe glass, reading immediately as craft/bar/beverage.
   - **Alt Text**:
     - EN: `"A cocktail being prepared at GEMA"`
     - ID: `"Koktail sedang disiapkan di GEMA"`

---

## Files to Create
- `apps/web/public/media/menu/menu-food-overview.jpg` (optimized progressive JPEG, ~1920px width, quality ~86)
- `apps/web/public/media/menu/menu-beverage-cocktail.jpg` (optimized progressive JPEG, ~1920px width, quality ~86)
- `apps/web/src/content/media/menuAssets.ts` (type-safe asset manifest and metadata)

## Files to Modify
- `apps/web/src/components/menu/MenuClient.tsx` (replace old Unsplash hero banner with the single contextual editorial media panel in the menu content area, subtle crossfade transition, localized alt text)
- `.agents/TASKS.md` (task status registration)

---

## In-Scope Behavior
1. **Contextual Media Panel**:
   - Placement: At the top of the main menu content column, immediately preceding the first menu category.
   - Desktop visual treatment: Full width of the main content column (`w-full`), restrained height (`h-[240px] md:h-[280px]`), `object-fit: cover`, no rounded card, no heavy shadow, no text overlay, no CTA.
   - Mobile visual treatment: Full width of menu content (`w-full`), restrained height (`h-[180px] sm:h-[200px]`), `object-fit: cover`.
   - Scroll behavior: Non-sticky; naturally scrolls away as user explores categories.
2. **Media Switching & Transition**:
   - Switches between `menu-food-overview.jpg` and `menu-beverage-cocktail.jpg` when `activeType` changes.
   - Restrained opacity crossfade (~300ms easeInOut), no dramatic zoom, no parallax, no carousel controls.
   - Respects `prefers-reduced-motion` (`useReducedMotionSafe`).
3. **Old Unsplash Hero Replacement**:
   - Remove the old external Unsplash stock hero banner (`photo-1551183053-bf91a1d81141`) and parallax scroll hook to satisfy the single authentic media panel constraint.
4. **Desktop Navigation Safety**:
   - Left sidebar (`lg:w-64`) with `FOOD | BEVERAGE` switcher and `SECTIONS` navigation remains untouched and sticky.
   - Menu item grid, typography, price leaders, and category layout remain untouched.
5. **Mobile Navigation Safety**:
   - Mobile top selector (`topSelectorRef`) remains at top of the section.
   - Compact sticky section bar continues to trigger reliably when scrolling past `topSelectorRef`.
   - Bottom-sheet category selection and Food/Beverage switching remain fully functional.

---

## Out-of-Scope / Untouched Systems
- Menu taxonomy, categories, dish names, descriptions, prices, portions, dietary notes, translations: UNTOUCHED.
- No dish thumbnails or category thumbnails.
- Homepage, Events, Journal, Reservations, Chef, Recognition, Visit, Footer, Navbar: UNTOUCHED.

---

## Test Contract
1. **Desktop Verification (1440x900)**:
   - Food mode displays `menu-food-overview.jpg` with table-spread composition.
   - Switching to Beverage crossfades cleanly to `menu-beverage-cocktail.jpg`.
   - Sidebar remains sticky and scrollspy functions as expected.
2. **Mobile Verification (390x844 & 402px)**:
   - Image panel does not dominate viewport and scrolls away naturally.
   - Sticky section bar appears upon scrolling past top selector.
   - Bottom sheet opens, switches category, and closes cleanly.
   - Zero horizontal overflow or layout shift.
3. **Code Quality**:
   - `npm run typecheck` passes with 0 errors.
   - `npm run build` succeeds cleanly.
