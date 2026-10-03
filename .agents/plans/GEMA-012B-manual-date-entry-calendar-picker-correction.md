# GEMA-012B — Manual Date Entry + Calendar Picker Logic Correction

## Executive Summary
This focused correction aligns the Preferred Date field with the requested UX:
1. **Manual Date Entry directly in the Main Date Field**:
   - The visible main field is a typeable text input accepting formats: `18/09/2026`, `18-09-2026`, `18 Sep 2026`, `18 September 2026`, `2026-09-18`.
   - Remove the internal search bar from the calendar popover.
   - Remove "search" terminology from date entry.
   - Parsing validates against real calendar dates, `Asia/Jakarta` timezone, and past dates.
   - Subtle inline error on blur/Enter: "Enter a valid reservation date." / "Past dates are not available."
2. **Unified Compact Calendar Popover**:
   - Toggled via the calendar icon on the main date field.
   - Top row: Previous Month arrow + Month selector + Year selector + Next Month arrow.
   - Standard month day grid below with weekday headers and real days per month.
   - Past dates disabled in `Asia/Jakarta`.
   - Bidirectional sync: manual entry syncs calendar view & selection; clicking a calendar day updates main field text and canonical state (`YYYY-MM-DD`).
3. **Preserve Corrected Reservation Time Window**:
   - Window remains 11:00 AM through 9:00 PM (`11:00`–`21:00`) in 15-minute intervals (41 slots).
   - Searchable time picker preserved (`Search time` / `Cari jam`), filters valid slots only, never creates arbitrary times.
4. **Indoor Garden Policy Copy Correction**:
   - Area option copy: "Smoking permitted from 9 PM" / "Smoking diperbolehkan mulai pukul 9 malam".
   - Remove the warning-like message below the Time field ("Indoor Garden is non-smoking at this time.").
   - Indoor Garden reservations before 9 PM remain completely valid with NO warning.
5. **QA Discipline**:
   - Follow web-test governance. Attempt real browser testing; if CDP tooling fails, mark browser items as `NOT VERIFIED` with explanation.

---

## Target Files
- `apps/web/src/components/shared/ReservationDatePicker.tsx`: Main field typeable input, remove popover search input, add Month/Year selector header, day grid, bidirectional sync.
- `apps/web/src/components/shared/ReservationOverlay.tsx`: Remove non-smoking warning below Time; update date field placeholder and error integration.
- `apps/web/src/lib/reservationConfig.ts`: Update Indoor Garden helper copy.
- `apps/web/src/i18n/translations.ts`: Update date placeholder and indoorGardenHelper translations.
- `apps/web/scratch/test_gema012b_matrix.ts`: Test matrix verifying all requirements A through N.
