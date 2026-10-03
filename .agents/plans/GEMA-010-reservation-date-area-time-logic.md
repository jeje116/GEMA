# GEMA-010 — Reservation Date, Area & Time Logic

## OBJECTIVE

Extend the existing Reservation → WhatsApp workflow in `ReservationOverlay.tsx` with dependent date, area, and time logic:
1. Centralized reservation configuration with restaurant timezone (`Asia/Jakarta`).
2. Programmatic 15-minute slot generation across operating hours (`01:00` to `21:00`).
3. Area selection (`Indoor` vs. `Indoor Garden`) positioned directly after Date.
4. Area-dependent and same-day temporal slot filtering (past intervals removed on today's date).
5. Automatic clearing of stale invalid times upon Date or Area changes.
6. Indoor Garden smoking policy helper messages (informational only; slots before 21:00 remain available).
7. Updated WhatsApp message payload including selected Area while preserving new-tab behavior and request semantics.

---

## FILES TO MODIFY

- `apps/web/src/components/shared/ReservationOverlay.tsx`
- `apps/web/src/i18n/translations.ts`
- `.agents/TASKS.md`

## FILES TO CREATE

- `apps/web/src/lib/reservationConfig.ts` (centralized reservation configuration, timezone, slot generation, and date/time helpers).

---

## IN-SCOPE BEHAVIOR

1. **Field Order**:
   `DATE` → `AREA` → `TIME` → `PARTY SIZE` → `NAME / CONTACT` → `OCCASION` → `NOTES` → `CONTINUE TO WHATSAPP`.

2. **Area Options & UI**:
   - `indoor`: "Indoor"
   - `indoorGarden`: "Indoor Garden" with helper "Smoking from 9 PM only" / "Smoking mulai pukul 9 malam".
   - Rendered as two elegant radio-card-like rows with proper radio semantics (`role="radiogroup"`, `role="radio"`, `aria-checked`), terracotta active border/pip, and warm ivory active surface.

3. **Time Generation & Rules**:
   - Programmatically derived from area config: `01:00` to `21:00` in 15-minute increments (81 slots for future dates).
   - Same-day time logic in `Asia/Jakarta`: current local time rounded forward to the next valid 15-minute interval; all earlier slots removed.
   - If current time is after `21:00` for today, zero slots remain and a clear no-availability state is displayed.
   - Time is disabled until both Date and Area are selected (`Select a date and area first`).

4. **Revalidation on Change**:
   - Area change recomputes slots; if currently selected time is invalid under the new area, time is cleared.
   - Date change recomputes slots; if currently selected time is invalid for the new date, time is cleared.

5. **Indoor Garden Smoking Policy**:
   - Informational helper only; slots before 21:00 remain fully available.
   - When selected time < 21:00: displays non-smoking notice.
   - When selected time >= 21:00: displays smoking permitted notice.

6. **Final Validation & WhatsApp Submission**:
   - Revalidates full combination against available slots before submission.
   - Builds locale-aware reservation request message with Area included.
   - Opens WhatsApp in a new tab with blank-window user gesture preserved.
   - Keeps original GEMA tab intact and closes overlay cleanly.

---

## OUT-OF-SCOPE BEHAVIOR

- Backend reservation engine or database inventory.
- Real-time table locking or confirmation claims (remains a reservation request).
- Redesigning unrelated pages or components.

---

## UNTOUCHED COMPONENTS

- `apps/web/src/components/menu/*`
- `apps/web/src/components/home/*`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/content/fixtures/menu.ts`

---

## TEST CONTRACT & BENCHMARK MATRIX

- **CASE A**: Future date, Indoor -> full 81 slots (`01:00`–`21:00`).
- **CASE B**: Future date, Indoor Garden -> full 81 slots (`01:00`–`21:00`), smoking helper toggles at `21:00`.
- **CASE C**: Today date, Indoor -> past slots removed based on forward-rounded 15-minute boundary.
- **CASE D**: Today date, Indoor Garden -> past slots removed + smoking helper active.
- **CASE E**: Area change clears time if time becomes invalid under new area.
- **CASE F**: Date change to today clears previously selected time if that time has already passed.
- **CASE G**: Today date after 21:00 -> 0 slots, no-availability message shown.
- **CASE H**: Past date -> disabled in date picker and rejected in validation.
- **CASE I**: Valid reservation -> WhatsApp opens in new tab with Area in message payload.
