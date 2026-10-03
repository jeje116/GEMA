# GEMA-015: Reservation Control Typography Parity

## Objective
Restore and enforce strict typography parity for user-facing values, selectable option titles, and control text inside the GEMA Reservation form. All selectable control values (Preferred Date, Dining Area titles, Preferred Time, Party Size, and Occasion) must render using GEMA's authentic editorial serif token (`--font-serif` / Cormorant Garamond), while preserving field labels in strong sans, helper/validation copy in muted sans, and all reservation business rules intact.

---

## Root Cause Diagnosis
1. **Netlify Staging vs Localhost Discrepancy**:
   - Netlify staging (`https://gemta.netlify.app`) was previously deployed at commit `5146a7e` (GEMA-005), which had native HTML `<select>` and `<input type="date">` elements that fell back to OS-native sans-serif fonts.
   - On localhost, while `ReservationDatePicker` and Dining Area titles had `font-serif`, `ReservationTimePicker` trigger and option items had no `font-serif` (explicitly used `font-sans`), `ReservationSelect` (Party Size) trigger and option items had no `font-serif` (explicitly used `font-sans`), and `res-occasion` lacked `font-serif`.
   - Furthermore, `ReservationDatePicker` explicitly used `placeholder:font-sans`, causing empty placeholders to regress to sans.
2. **Production Font Pipeline Verification**:
   - Inspected `https://gemta.netlify.app`: Webfonts (`Cormorant Garamond` woff2) are actively preloaded (`<link rel="preload" href="...woff2" as="font">`).
   - `<html>` carries class `cormorant_garamond_a77aba11-module__0ptQqG__variable` which binds `--font-serif-cormorant`.
   - Tailwind v4 `@theme` maps `--font-serif: var(--font-serif-cormorant), "Cormorant Garamond", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`.
   - `.font-serif` utility properly applies `font-family: var(--font-serif)`.
   - No production font network loading failure was found; the issue was localized to missing/conflicting font utility classes on the reservation controls.

---

## Files to Modify
1. `apps/web/src/components/shared/ReservationTimePicker.tsx`
   - Apply `font-serif` to the closed-state trigger display text (`displayText`).
   - Apply `font-serif` to the dropdown slot option labels (replacing `font-sans`).
2. `apps/web/src/components/shared/ReservationSelect.tsx`
   - Apply `font-serif` to the trigger selected label.
   - Apply `font-serif` to dropdown option labels (replacing `font-sans`).
3. `apps/web/src/components/shared/ReservationDatePicker.tsx`
   - Change `placeholder:font-sans` to `placeholder:font-serif` on the main typeable date input.
4. `apps/web/src/components/shared/ReservationOverlay.tsx`
   - Apply `font-serif` and `placeholder:font-serif` to the `res-occasion` input field.
   - Confirm Dining Area option titles maintain `font-serif` and area helper remains muted `font-sans`.
   - Confirm all field labels remain strong sans (`font-medium text-[var(--espresso-800)]`).
5. `.agents/TASKS.md`
   - Register `GEMA-015` in the task registry.

---

## Files to Create
None.

---

## In-Scope Behavior
- Preferred Date: User-entered date and placeholder rendered in editorial serif (`font-serif`).
- Dining Area: "Indoor" and "Indoor Garden" option titles rendered in editorial serif (`font-serif`); smoking helper remains muted sans (`font-sans text-[var(--muted)]`).
- Preferred Time: Closed trigger selected value rendered in editorial serif (`font-serif`); dropdown options rendered in editorial serif (`font-serif`).
- Party Size: Closed trigger selected value rendered in editorial serif (`font-serif`); dropdown options rendered in editorial serif (`font-serif`).
- Occasion: Value and placeholder rendered in editorial serif (`font-serif`).
- Field Labels: All labels remain strong sans (`font-medium text-[var(--espresso-800)]`).

---

## Out-of-Scope Behavior / Untouched Components
- No redesign of the reservation form or modal structure.
- No changes to date calculation, parsing, or calendar popover logic.
- No changes to area availability rules (Indoor 11:00 AM–9:00 PM, Indoor Garden 9:00 PM only).
- No changes to WhatsApp payload generator or submission logic.
- No importing of new external webfonts or modification of `@theme` font tokens.

---

## Test Contract
1. **Visual Parity**:
   - Selected values for Date, Area, Time, Party Size, and Occasion visually match GEMA's Cormorant Garamond editorial serif.
   - Dining Area helper text remains muted sans.
   - Field labels remain strong sans.
2. **Regression Safety**:
   - Date selection via manual typing and popover calendar works identically.
   - Area selection updates available time slots identically.
   - Time selection and filtering work identically.
   - WhatsApp message formatting is unchanged.
3. **Build and Typecheck**:
   - `npm run typecheck` passes with zero errors.
   - `npm run build` succeeds cleanly.
