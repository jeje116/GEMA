# GEMA-013 — Reservation Area-Time Logic Correction + Mandatory Web QA

## Executive Summary
This task implements the authoritative reservation business rule and governance discipline:
1. **Authoritative Area Availability**:
   - **Indoor**: 11:00 AM to 9:00 PM in 15-minute intervals (41 slots on future date).
   - **Indoor Garden**: Represents the smoking area; only available starting from 9:00 PM. With a global closing of 9:00 PM, Indoor Garden has **exactly 1 valid slot: 9:00 PM** (`21:00`). Before 9:00 PM is **INVALID**.
   - Availability is derived dynamically from `areaConfig.openingTime` (`21:00`) to `areaConfig.lastReservationTime` (`21:00`).
2. **Explicit Area Availability in `reservationConfig.ts`**:
   - `indoor`: `openingTime: '11:00'`, `lastReservationTime: '21:00'`
   - `indoorGarden`: `openingTime: '21:00'`, `lastReservationTime: '21:00'`, `helper: { en: 'Smoking area available from 9 PM', id: 'Area smoking tersedia mulai pukul 9 malam' }`
3. **Area Change Revalidation**:
   - Switching from Indoor (e.g. `7:30 PM`) to Indoor Garden clears Time and lists only `9:00 PM`.
   - Switching from Indoor Garden (`9:00 PM`) to Indoor retains `9:00 PM` as it is valid for Indoor.
4. **Time Search Filtering**:
   - Searches only over the area's valid slots. In Indoor Garden, searching `8` yields zero results; searching `9` yields `9:00 PM`.
5. **Final Submission Validation**:
   - Independently recomputes `getAvailableReservationSlots({ date, area })` and rejects invalid combinations (e.g. Indoor Garden + 11:00 AM, 3:00 PM, 8:45 PM).
6. **Mandatory Web QA Discipline**:
   - Execute pure logic automated tests (A through J).
   - Re-attempt real browser execution via web QA workflow.
   - If CDP protocol error persists, report browser items as `NOT VERIFIED` with the exact error. Never claim browser `PASS` without browser execution.

---

## Target Files
- `apps/web/src/lib/reservationConfig.ts`: Set `indoorGarden.openingTime = '21:00'`, update helper copy.
- `apps/web/src/i18n/translations.ts`: Update helper translation strings.
- `apps/web/src/components/shared/ReservationOverlay.tsx`: Final submission revalidation check.
- `apps/web/scratch/test_gema013_matrix.ts`: Comprehensive automated logic suite (A through J).
