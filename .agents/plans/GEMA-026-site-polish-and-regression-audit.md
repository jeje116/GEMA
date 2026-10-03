# GEMA-026: Site Polish & Regression Audit

## Objective
Restore intended behavior and visual consistency across four confirmed issues from Product Owner review (Route scroll offset, Google AI Studio motion in "The Space", unconfirmed operating hours provenance, and reservation control typography), plus a careful site-wide regression audit.

## Files to Modify
- `apps/web/src/styles/globals.css`
- `apps/web/src/app/[locale]/layout.tsx`
- `apps/web/src/components/home/SpacePreview.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/components/home/VisitPreview.tsx`
- `apps/web/src/components/visit/VisitClient.tsx`
- `apps/web/src/content/fixtures/site.ts`
- `apps/web/src/components/shared/ReservationOverlay.tsx`
- `apps/web/src/components/shared/ReservationDatePicker.tsx`
- `apps/web/src/components/shared/ReservationTimePicker.tsx`
- `apps/web/src/components/shared/ReservationSelect.tsx`
- `.agents/TASKS.md`

## Files to Create
- `apps/web/src/components/layout/RouteScrollReset.tsx`

## In-Scope Behavior
1. **Route Scroll Reset (Issue A)**:
   - Normal route changes start flush at `scrollY = 0`.
   - Navbar GEMA logo return to homepage starts at exact top.
   - Cross-route transitions between all pages reset scroll to top.
   - Same-page intentional smooth scrolling (e.g. Menu categories) is preserved.
2. **Google AI Studio Motion Restoration (Issue B)**:
   - Restore `ResponsiveImage` with `maskReveal` (`y: 0% -> -100%`) and subtle scale reveal on "The Space" section images.
   - Preserve authentic imagery assets.
   - Audit all homepage areas against Google AI Studio baseline.
   - Respect `prefers-reduced-motion: reduce`.
3. **Operating Hours Provenance & Fact Removal (Issue C)**:
   - Document that `Tue – Sun: 11:30 – 23:00 / Closed on Mondays` was unconfirmed staging copy, and `site.ts` opening hours were prototype demo data marked `needs-confirmation`.
   - Remove unsupported hours from Footer, VisitPreview, and VisitClient.
   - Audit other hard factual business statements.
4. **Reservation Field Typography (Issue D)**:
   - Realign all interactive reservation control text (values, placeholders, option dropdowns, time picker items, calendar days, area titles, inputs, textarea) to the GEMA sans family (`font-sans`), matching question labels.
   - Preserve all business logic (dates, areas, time slots, 15-min intervals, party size, validation, WhatsApp message payload).

## Out-of-Scope Behavior
- No redesign of homepage, menu, reservation modal, footer, chef pages, or recognition layout.
- No alteration of reservation business rules, area availability, or validation logic.
- No replacement of authentic photography.

## Test Contract
1. **Route Scroll Reset**: Playwright navigation from `/en/experience` (scrollY=800) to `/en` via logo click lands at `scrollY = 0`. Cross-route tests land at `scrollY = 0`. Same-page Menu category scroll smooth navigation works.
2. **Motion Verification**: The Space images show mask curtain slide in browser. Staggered text entrance verified. All 11 homepage sections audited against reference baseline.
3. **Hours Removal**: Verified absent from Footer, VisitPreview, and VisitClient.
4. **Reservation Typography**: Computed `font-family` on labels, inputs, values, placeholders, and pickers all resolve to GEMA sans.
5. **Code QA**: `npm --prefix apps/web run typecheck` and `npm --prefix apps/web run build` pass with 0 errors.
