# GEMA-012A — Focused Reservation Date/Time Picker Correction & QA Verification Discipline

## Executive Summary
This focused correction task addresses three specific issues:
1. **WS1 — Date Picker Interaction Logic Correction**:
   - Align `ReservationDatePicker` to a single compact custom popover:
     - Search / typeable date input at the top.
     - Header containing: Year selector + Month selector + Prev/Next navigation arrows.
     - Standard month day-grid calendar below.
     - Past dates disabled based on restaurant timezone (`Asia/Jakarta`).
     - Selected date writes to canonical reservation date state (`YYYY-MM-DD`).
     - No browser-native date picker (`<input type="date">`).
     - Remove unnecessary multi-mode switcher/wizards.
2. **WS2 — Reservation Time Range Correction**:
   - Correct reservation opening time to **11:00 AM** (`11:00`).
   - Range: **11:00 AM through 9:00 PM** (`11:00`–`21:00`) in 15-minute intervals.
   - First valid slot: `11:00 AM`; Last valid slot: `9:00 PM` (total 41 slots).
   - Preserve same-day forward filtering, Date & Area dependent revalidation, searchable filtering without arbitrary time creation, and clean single display values.
3. **WS3 — QA & Web Test Discipline Correction**:
   - Re-attempt real browser verification.
   - If browser tooling encounters CDP/Playwright protocol limitations (`Browser context management is not supported`), strictly report browser items as `NOT VERIFIED` with explicit reason, without inflating verification claims.

---

## Target Scope
- `apps/web/src/lib/reservationConfig.ts`: Update `openingTime` to `'11:00'`.
- `apps/web/src/components/shared/ReservationDatePicker.tsx`: Streamline to single compact popover with integrated search, header Year/Month selectors and Prev/Next arrows, and standard month day grid.
- `apps/web/src/components/shared/ReservationTimePicker.tsx`: Ensure search filters 11:00–21:00 range cleanly.
- `apps/web/scratch/test_correction_matrix.ts`: Comprehensive automated tests for 11:00–21:00 hours, same-day filtering, date navigation, and search.
