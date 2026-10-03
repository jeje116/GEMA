# GEMA-016 — Menu Navigation Refinement

## Objective
Implement the approved Menu navigation refinement in `MenuClient.tsx`:
1. **Food / Beverage Selector**: Restrain to a quiet luxury presentation featuring pure typography (`FOOD │ BEVERAGE`) with a static central hairline separator, no outer box, no card, no pill, no background fill, no shadow, and generous interactive hit areas.
2. **Desktop Sections Navigation**: Remove the continuous vertical rail. Introduce a short vertical terracotta indicator (~1.5-2px wide, ~18-24px tall) positioned exclusively beside the active category row, with active text in strong espresso and inactive text in readable muted espresso with visual stillness.
3. **Mobile Sections Navigation**: Text-only horizontal scrollable category navigation with an understated active underline, gentle auto-scroll into view, and no pills, boxes, or cards.
4. **Uppercase Presentation**: Apply presentation-level uppercase styling to all navigation category names and main content category headings without mutating authoritative data.

---

## Files to Modify
- `apps/web/src/components/menu/MenuClient.tsx`
- `.agents/TASKS.md`

## Files to Create
None.

---

## In-Scope Behavior
1. **Food / Beverage Selector**:
   - Pure typography sitting directly on page canvas.
   - 1px central vertical hairline (~26-34px tall, muted espresso ~25% opacity) between FOOD and BEVERAGE.
   - Active label: strong espresso (`text-[var(--espresso-900)]`), `font-semibold`.
   - Inactive label: muted espresso (`text-[var(--espresso-900)]/65`), `font-normal`, transitions to strong espresso on hover without layout shift.
   - Desktop spacing: ~28-36px padding per side, min height 44px, cursor pointer.
   - Mobile: compact responsive padding, min touch target 44px.
   - Semantic `<button type="button">`, `aria-pressed`, keyboard accessible.
2. **Desktop Sections Navigation**:
   - Long continuous vertical line removed.
   - Short terracotta vertical indicator (~2px wide, ~20px tall) shown only beside active item.
   - Exactly one active indicator visible at a time.
   - Active text: strong espresso (`text-[var(--espresso-900)]`), `font-semibold`.
   - Inactive text: muted espresso (`text-[var(--espresso-900)]/65`), transitions smoothly on hover without translation.
   - Visual gap: ~14-18px (`space-y-3.5`).
   - Sticky sidebar preserved without background/card/borders.
   - Scrollspy updates active category and indicator smoothly.
3. **Mobile Sections Navigation**:
   - Horizontal category strip with text-only buttons.
   - Active state: strong espresso/terracotta with subtle bottom hairline (`border-b-2 border-[var(--terracotta)]`).
   - Gentle `scrollIntoView({ block: 'nearest', inline: 'nearest' })` on active category change.
4. **Uppercase Display**:
   - Category names in sidebar navigation rendered in uppercase.
   - Main section headings in right-hand content rendered in uppercase.

---

## Out-of-Scope / Untouched Systems
- Menu data, prices, descriptions, portions, variants, notes: UNTOUCHED.
- Food categories = 11, Beverage categories = 9: UNTOUCHED.
- MenuItemRow layout, dotted leaders, price placement: UNTOUCHED.
- Reservation, Navbar, Footer, Chef, Recognition, Maps, Audio, CMS, routes: UNTOUCHED.

---

## Test Contract
1. **Visual Parity**:
   - FOOD / BEVERAGE: No outer box, no background fill, no underline, no dots. One subtle static vertical separator. Active label stronger than inactive.
   - Desktop Sections: No continuous vertical rail. One short active terracotta indicator. Active text in espresso. All names uppercase.
   - Mobile Sections: Horizontal scrollable text-only list with subtle active underline, no vertical indicator.
   - Content Headings: All headings display in uppercase with simple straight hairline.
2. **Data & Logic Integrity**:
   - Food categories = 11, Beverage categories = 9.
   - Food/Beverage in-page switching functional.
   - Category click smooth-scrolls to target.
   - Scrollspy updates active category accurately.
3. **Code Quality**:
   - `npm run typecheck` passes with 0 errors.
   - `npm run build` succeeds cleanly.
