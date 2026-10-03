# GEMA-014A — Menu Outline Visual Revert Only

## Objective
Revert only the outline, border, and framing language of the Menu section (`MenuClient.tsx`) to the original Google AI Studio visual baseline. Restore simple straight horizontal hairlines underneath category headings, clean understated vertical navigation rail, and straight rectangular framing for the Food/Beverage switcher, while completely removing all later organic/physical-menu outline elements (SVG bezier curves, terracotta endpoint dots, Roman numeral headers, asymmetric corner radii, and decorative multi-line frames). All official menu data, category order, Food/Beverage switching logic, and responsive behavior remain 100% untouched.

---

## Files to Modify
- `apps/web/src/components/menu/MenuClient.tsx`
- `.agents/TASKS.md`

## Files to Create
None.

---

## In-Scope Revert Behavior
1. **Category Headers**:
   - Restore large serif category heading (`font-serif text-3xl md:text-5xl text-[var(--espresso-900)]`).
   - Restore simple 1px straight horizontal hairline underneath (`border-b border-[var(--espresso-900)]/20 pb-4 mb-8`).
   - Remove Roman numeral indicators above category titles.
   - Remove decorative SVG with bezier curves (`Q980,8 980,18 L992,18`), micro-traces, and terracotta dot endpoints.
2. **Section Notes**:
   - Render section note as an understated italic serif paragraph directly below the category header.
   - Remove curved top-left corner (`borderRadius: 16px 0 0 0`), secondary inset hairline, and terracotta dot endpoint.
3. **Sections Navigation (Desktop & Mobile)**:
   - Desktop: Simple vertical hairline rail (`border-l border-[var(--ivory-200)] pl-6`) with `SECTIONS` title and clean category buttons (`font-serif text-lg text-[var(--espresso-900)] hover:text-[var(--terracotta)]`).
   - Remove sculptural top terminal SVG with curve and terracotta circle.
   - Remove Roman numerals and active spine segments.
   - Mobile: Clean horizontal scroll links with active highlight, no box frames.
4. **Food / Beverage Switcher**:
   - Revert from asymmetric organic corners (`4px 20px 4px 10px`) and double inset hairlines (`3px 17px 3px 8px`) to clean, simple straight borders.
5. **Special Sections & Footnote**:
   - Chef's Cut: Keep text content, remove gradient fading line and terracotta dot.
   - Menu Footnote: Keep tax/service note, remove terracotta dot and gradient lines.

---

## Out-of-Scope / Untouched Systems
- NO change to official menu data (`apps/web/src/content/fixtures/menu.ts`), prices, descriptions, portions, variants, or notes.
- Food categories remain exactly 11; Beverage categories remain exactly 9.
- NO change to Food/Beverage switching logic or scroll-spy IntersectionObserver logic.
- NO change to Reservation, Navbar, Footer, Chef, Recognition, Maps, Audio, PageReveal, CMS, or routing.
- NO new external fonts or redesign of global design tokens.

---

## Test Contract
1. **Visual Parity**:
   - Category headers have simple straight horizontal hairlines.
   - Zero scalloped edges, zero curved decorative SVG lines, zero decorative dot endpoints.
   - Sections sidebar uses simple vertical rail without top sculptural terminal.
2. **Data Integrity**:
   - Food categories = 11.
   - Beverage categories = 9.
   - All items, prices, variants, notes rendered accurately.
3. **Functional Integrity**:
   - Food/Beverage switching works smoothly.
   - Sticky navigation jumps to target categories correctly.
4. **Build & Typecheck**:
   - `npm run typecheck` passes with 0 errors.
   - `npm run build` succeeds cleanly.
