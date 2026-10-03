# GEMA-012 — Searchable Date & Time Picker Enhancement

## Executive Summary
This task enhances the existing custom Date and Time pickers in GEMA's reservation system with:
1. **Searchable & typeable Date entry** supporting multiple formats (`18 Sep 2026`, `18 September 2026`, `18/09/2026`, `18-09-2026`, `2026-09-18`), parsing in `Asia/Jakarta`, with subtle inline feedback for invalid or past dates.
2. **Structured Date selection** (YEAR → MONTH → DAY) with past years, past months, and past days properly disabled.
3. **Calendar browsing preserved** as an alternate view within the same custom Date popover.
4. **Searchable & typeable Time selection** with tolerant 12h/24h filtering that **strictly filters existing valid slots only** and never generates arbitrary times.
5. **Preservation of all GEMA reservation invariants**: locked field order, 13:00–21:00 operating hours, 15-minute slot intervals, same-day forward filtering, Date & Area dependent Time revalidation, clean single display values (no parentheses duplicate raw values), and WhatsApp new-tab behavior.

---

## 1. Architecture & Scope
### Target Files
- `apps/web/src/lib/reservationConfig.ts`:
  - `parseReservationDateInput(input: string, minDate: string, locale?: string)`: Tolerant multi-format date parser with leap-year and past-date validation.
  - `filterTimeSlots(slots: string[], query: string)`: Tolerant 12h/24h slot filter returning only matching elements from the valid `slots` array.
- `apps/web/src/i18n/translations.ts`:
  - Add localized strings for Date and Time search placeholders, error messages, empty states, and mode toggles in both English and Indonesian.
- `apps/web/src/components/shared/ReservationDatePicker.tsx`:
  - Enhance popover with:
    1. Search input for typed date entry with instant validation and selection.
    2. Understated view toggle between Calendar browsing and Structured (Year → Month → Day) selection.
    3. Three-stage structured picker (Year grid → Month grid → Day grid) with past period guards.
    4. Canonical date state updated identically across all three methods.
- `apps/web/src/components/shared/ReservationTimePicker.tsx`:
  - Enhance popover with:
    1. Search input at top for filtering valid time slots.
    2. Tolerant matching (`3`, `3:15`, `3:15 PM`, `15:15`, `8:45`).
    3. Empty state display when no matching valid slots exist.
    4. Single clean display value (`3:15 PM`), keyboard navigation (Arrow Up/Down, Enter, Escape).
- `apps/web/src/components/shared/ReservationOverlay.tsx`:
  - Pass `locale` to `ReservationTimePicker`.
  - Maintain existing Date/Area change -> Time revalidation logic.

### Untouched Components
- `ChefPreview.tsx`, `RecognitionPreview.tsx`, `VisitPreview.tsx`, `MenuClient.tsx`, audio components, layouts, footer.
- Database, CMS, authentication, backend (not applicable).

---

## 2. Test Plan & Verification
### A. Date Search Matrix
- `18/09/2026` -> selects 18 September 2026
- `18 Sep 2026` -> same date
- `18 September 2026` -> same date
- `2026-09-18` -> same date
- `18-09-2026` -> same date
- `31/02/2026` -> invalid calendar date error
- Past date (e.g. `2025-01-01` or earlier than today in Jakarta) -> past date error
- Year → Month → Day structured selection -> canonical date matches calendar selection

### B. Time Search Matrix
- Input `3` on valid slots (13:00–21:00) -> matches `3:00 PM`, `3:15 PM`, `3:30 PM`, `3:45 PM`
- Input `3:1` -> matches `3:15 PM`
- Input `3:15` -> matches `3:15 PM`
- Input `15:15` -> matches `3:15 PM`
- Input `8:45` -> matches `8:45 PM`
- Input `3:10` -> NO arbitrary slot created, displays "No matching reservation time." / "Tidak ada jam reservasi yang sesuai."
- Same-day filtering -> only valid slots matching search are returned
- Area change -> slots recomputed and filtered dynamically

### C. Build & Visual Verification
- `npm run typecheck`
- `npm run build`
- Browser validation at Desktop 1440px and Mobile 390px
