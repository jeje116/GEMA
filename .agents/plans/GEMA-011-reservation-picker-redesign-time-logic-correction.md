# GEMA-011 — Reservation Picker Redesign & Time Logic Correction

## OBJECTIVE

Address two core issues in the GEMA reservation workflow:
1. **Time Logic Correction**: Correct operating hours from literal `01:00` (1:00 AM) to `13:00` (1:00 PM) through `21:00` (9:00 PM) in 15-minute intervals. Ensure same-day temporal forward filtering adheres to the exact forward-slot specification (`13:07 -> 13:15`, `13:15 -> 13:30`, `20:46 -> 21:00`, `>= 21:00 -> no slots`). Eliminate all AM slots and eliminate raw duplicate time representations like `1:15 PM (13:15)`.
2. **Custom GEMA Reservation Pickers**: Replace browser-native `<input type="date">` and native `<select>` controls with custom GEMA-styled popovers for Date, Time, and Party Size. Integrate warm ivory surfaces, espresso typography, thin hairlines, terracotta indicators, keyboard navigation, and robust viewport containment.

---

## FILES TO MODIFY

- `apps/web/src/lib/reservationConfig.ts`
- `apps/web/src/components/shared/ReservationOverlay.tsx`
- `.agents/TASKS.md`

## FILES TO CREATE

- `apps/web/src/components/shared/ReservationDatePicker.tsx` (Custom GEMA calendar popover)
- `apps/web/src/components/shared/ReservationTimePicker.tsx` (Custom GEMA time slot popover)
- `apps/web/src/components/shared/ReservationSelect.tsx` (Custom GEMA select for party size)

---

## IN-SCOPE BEHAVIOR

1. **Business Hours & Time Generation**:
   - Indoor & Indoor Garden opening: `13:00` (1:00 PM).
   - Last reservation time: `21:00` (9:00 PM).
   - Slot interval: 15 minutes.
   - Total configurable slots for future dates: 33 slots (`13:00`, `13:15`, `13:30`, `13:45`, ..., `20:45`, `21:00`). Zero AM slots.
   - Single clean formatted display value: `1:15 PM` (never `1:15 PM (13:15)`).

2. **Same-Day Temporal Forward Filtering**:
   - In `Asia/Jakarta` timezone, on today's date:
     - `13:07` -> first available slot `13:15`.
     - `13:15` (exact boundary) -> first available slot `13:30`.
     - `20:46` -> first available slot `21:00`.
     - `>= 21:00` -> zero slots available (displays no-slots helper).
     - Before opening (`< 13:00`) -> all 33 slots (`13:00`–`21:00`) available.

3. **Custom Date Picker**:
   - Closed state: GEMA bordered trigger showing locale-formatted date (e.g. `18 September 2026`) and calendar icon.
   - Open popover: GEMA styled calendar with month navigation (`← September 2026 →`), weekday header, past dates disabled with low opacity, today outlined, and selected date with terracotta outline & warm ivory fill.
   - Accessible keyboard controls (arrows/Enter/Space/Escape) and outside click closure.

4. **Custom Time Picker**:
   - Closed state: GEMA bordered trigger showing single formatted time (e.g. `1:15 PM`) and clock icon.
   - Disabled with explanatory helper when Date and Area are not yet selected or when 0 slots are available.
   - Open popover: compact scrollable list (max height ~240px, 5-7 slots before scroll) with terracotta indicator on selected item and warm hover states. No browser blue highlight.

5. **Form Style Consistency**:
   - Party Size converted from native select to matching GEMA custom select dropdown.
   - All selection controls share the same ivory, espresso, and terracotta visual vocabulary.

6. **Preserved WhatsApp Workflow**:
   - Message built as a request with Date, Time (`1:15 PM`), Area, Party Size, Contact, Occasion, and Notes.
   - Synchronous new tab opening in user gesture, keeping GEMA tab intact.

---

## OUT-OF-SCOPE BEHAVIOR

- Backend reservation engine or database inventory.
- Redesigning unrelated pages (Menu, Chef, Recognition, Home).
- Altering existing WhatsApp tab-opening architecture.

---

## UNTOUCHED COMPONENTS

- `apps/web/src/components/menu/*`
- `apps/web/src/components/home/*`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/content/fixtures/menu.ts`

---

## TEST CONTRACT & BENCHMARK MATRIX

- **CASE A**: Future date + Indoor -> exactly 33 slots (`13:00` to `21:00`). Zero AM slots.
- **CASE B**: Future date + Indoor Garden -> exactly 33 slots (`13:00` to `21:00`). Smoking helper active for `21:00`.
- **CASE C**: Today at `13:07` -> earliest available slot is `13:15`.
- **CASE D**: Today at `13:15` exactly -> earliest available slot is `13:30`.
- **CASE E**: Today at `20:46` -> only `21:00` remains.
- **CASE F**: Today at `21:00` -> zero slots available (no-slot state displayed).
- **CASE G**: Past dates disabled and non-selectable.
- **CASE H**: Stale time clears upon date/area change if time is no longer available.
- **CASE I**: Indoor Garden at `20:45` displays non-smoking notice; at `21:00` displays smoking permitted notice.
- **CASE J**: Custom Date picker, Time picker, and Party Size select open/close properly without native browser UI.
- **CASE K**: `npm run typecheck` and `npm run build` pass with zero errors.
