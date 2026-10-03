# GEMA-009 — Approved Editorial Organic Menu Design Transplant

## OBJECTIVE

Transplant the approved editorial organic visual system into the existing GEMA Next.js Menu implementation (`apps/web/src/components/menu/MenuClient.tsx`) without altering Next.js App Router architecture, routing, locale behavior, official menu datasets, pricing, portions, or unrelated components.

Design principle: **80% Editorial Luxury, 20% Restrained Organic Premium** — "A premium printed GEMA menu whose structure has been gently shaped by hand."

---

## FILES TO MODIFY

- `apps/web/src/components/menu/MenuClient.tsx`
- `.agents/TASKS.md`

## FILES TO CREATE

None (all Menu presentation logic encapsulated cleanly in `MenuClient.tsx` without unnecessary component fragmentation).

---

## IN-SCOPE BEHAVIOR

1. **Food / Beverage Switcher**:
   - Asymmetric shared outer border (`borderRadius: 4px 20px 4px 10px`).
   - Subtle inset hairline following matching asymmetric geometry (`borderRadius: 3px 18px 3px 8px`).
   - Active surface: Warm ivory/light tonal active surface only (`bg-[#FAF6F0]` / `bg-[var(--ivory-100)]`), no dark espresso active fill.
   - Active outlines & terracotta baseline trace.
   - Food active geometry: `borderRadius: 3px 4px 3px 8px`.
   - Beverage active geometry: `borderRadius: 4px 16px 4px 4px`.
   - Mobile touch targets >= 44px.

2. **Desktop Sections Navigation**:
   - Sticky desktop navigation with `Sections` label.
   - Thin vertical espresso spine with small sculptural top terminal and terracotta endpoint circle.
   - Roman numerals (I through XI for Food, I through IX for Beverage) for each category.
   - Active category tracking: 2px terracotta segment on spine, terracotta Roman numeral, stronger espresso category label, ~1-2px horizontal translation.
   - Inactive: muted espresso with subtle hover translation.
   - No cards, no category counts, no "Menu System" copy.

3. **Mobile Category Navigation**:
   - Sticky horizontal scroll container below navbar.
   - Roman numerals + real category names.
   - Terracotta active indication, min touch target ~44px.
   - No category counts ("11 Categories", "9 Categories"), no bottom sheet.

4. **Category Header**:
   - Roman numeral indicator in terracotta.
   - Delicate editorial hairline accent.
   - Large serif category name.
   - Signature open contour line below: long horizontal hairline curving down near the right and terminating in a terracotta endpoint circle (`M0,8 L940,8 Q975,8 975,18 L992,18`), with small secondary micro-trace at the beginning. Stays open, never encloses heading.

5. **Menu Item Rows**:
   - Flat layout (no cards, no background boxes, no shadows, no price pill frames).
   - Desktop hierarchy: `Dish Name (portion) ................ Price` with dotted leader.
   - Description underneath in muted tone.
   - Hover micro-interaction (200-300ms): 1-2px title translation, small terracotta indicator appears, leader line subtly strengthens.

6. **Portions and Price Variants**:
   - Single portion: `Dish Name (portion) ........ Price`.
   - Multiple variants: Dish Name on first line, followed by subtle left structural hairline indent:
     `portion/label ........ Price`
     `portion/label ........ Price` with dotted leaders.

7. **Section Notes**:
   - Open annotation treatment sitting directly on page background (no filled card background).
   - Top & left border, open right & bottom.
   - Rounded top-left corner (`outer 16px`, `inner 13px`).
   - Small terracotta endpoint accent.
   - Italic serif note text.

8. **Woodfire & Grill Subsections & Chef's Cut**:
   - Chef's Cut: open editorial moment with serif heading, italic description, generous whitespace, fine horizontal rule fading right with terracotta endpoint. No cards, no background panel, no "Feature Selection" copy.
   - CARNE, SIDES ADD, SAUCES: restrained structural left border accent (`border-l-2 border-[var(--terracotta)]`) with uppercase condensed subhead.

9. **Menu Footnote**:
   - Centered fine hairlines with central terracotta point.
   - Muted italic serif text with official tax/service note (`menu.taxService`).

---

## OUT-OF-SCOPE BEHAVIOR

- Google AI Studio Vite architecture transplantation.
- Replacing Next.js App Router or locale infrastructure.
- Modifying menu data, categories, items, prices, portions, or price variants.
- Adding unapproved content (`Feature Selection`, `Menu System`, `11 Categories`, `9 Categories`, invented dietary badges, origins, wine pairings).
- Modifying SiteHeader, Footer, Reservation, Audio, Chef, Maps, Recognition, or CMS.

---

## UNTOUCHED COMPONENTS

- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/components/shared/ReservationOverlay.tsx`
- `apps/web/src/components/layout/AudioControl.tsx`
- `apps/web/src/components/home/ChefPreview.tsx`
- `apps/web/src/components/recognition/*`
- `apps/web/src/content/fixtures/menu.ts`
- `apps/web/src/content/types.ts`
- `apps/web/src/i18n/*`

---

## DEPENDENCIES

None. Zero new dependencies. Uses existing Tailwind CSS, Next.js fonts (`Cormorant_Garamond`, `Inter`, `Roboto_Condensed`), and Motion.

---

## RISKS & MITIGATION

1. **Risk**: Asymmetric corner geometry breaking across mobile viewports.
   - **Mitigation**: Responsive CSS styles ensuring touch targets >= 44px with robust flex wrapping and overflow clipping.
2. **Risk**: Long dish names colliding with price leaders.
   - **Mitigation**: Flex layout with `flex-shrink` on leader (`min-w-[16px]`), `flex-shrink-0` on prices, and word-break wrapping for long titles.
3. **Risk**: Category header SVG distortion on narrow viewports.
   - **Mitigation**: Responsive SVG with `preserveAspectRatio="none"` or `vector-effect="non-scaling-stroke"` ensuring the stroke width remains 1px and the curve scales naturally.

---

## TEST CONTRACT

### Normal Cases:
- Food / Beverage switcher toggles 11 Food categories and 9 Beverage categories.
- Active switcher surface is light ivory (`#FAF6F0`), NOT dark espresso fill.
- Desktop sidebar displays Roman numerals I through XI (Food) or I through IX (Beverage) with thin spine, top terminal, and terracotta active segment.
- Category headers render serif titles with open contour line and terracotta endpoint.
- Menu items render flat with dotted leaders connecting titles to prices.
- Multi-price items (steaks, gelato) render with subtle left hairline variant list.
- Section notes render directly on background with open top/left border and rounded corner.
- Woodfire & Grill displays Chef's Cut as an open composition without cards or "Feature Selection".
- Footnote displays tax & service charge centered with fine hairlines.

### Regression Cases:
- Official menu content count: 70 priced items + 1 Chef's Cut structural block in Food, 47 in Beverage.
- `Patatine` transcription fix and `Ragù di Manzo, Béchamel` diacritics preserved.
- Editorial normalizations (`Stracciatella`, `Pomodorini`, `Basilico Verde`, `Chantilly`, `focaccia`, `government`) preserved.
- `npm run typecheck` and `npm run build` pass with zero errors.
