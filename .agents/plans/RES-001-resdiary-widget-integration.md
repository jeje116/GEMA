# Implementation Plan — RES-001: ResDiary JavaScript Widget Integration

## Objective
Integrate the official ResDiary JavaScript Website Reservation Widget for GEMA Surabaya into the existing GEMA `ReservationOverlay` component, replacing the custom table reservation form with the official ResDiary booking interface while preserving GEMA's modal framing, styling aesthetics, and existing WhatsApp contact fallback.

---

## Technical Baseline & Audit

### 1. ResDiary Embed Configuration
- **Venue Path**: `GemaSurabaya/2025`
- **Widget URL**: `https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false`
- **Official Loader**: `https://booking.resdiary.com/bundles/WidgetV2Loader.js`
- **Widget Container**: `<div id="rd-widget-frame"></div>`
- **Hidden Config Input**: `<input type="hidden" id="rdwidgeturl" value="https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false" />`
- **Widget Behavior**: `WidgetV2Loader.js` dynamically loads jQuery and jQuery UI (if missing) and executes `$("#rd-widget-frame").load($("#rdwidgeturl").val())`.

### 2. Existing Reservation Architecture Audit
- **Modal Entry**: `UIContext.tsx` manages `isReservationOpen`, `openReservation()`, and `closeReservation()`.
- **Active Standard Reservation CTAs**:
  - `SiteHeader.tsx`: Desktop Header "Reserve a Table" button
  - `SiteFooter.tsx`: Footer "Reserve" button
  - `Hero.tsx`: Homepage Hero "Reserve a Table" button
  - `VisitPreview.tsx`: Homepage Visit section "Reserve a Table" button
  - `VisitClient.tsx`: Visit page "Reserve a Table" button
  - `MobileReserveBar.tsx`: Floating Mobile bar "Reserve a Table" button
  - `EventDetailClient.tsx`: Concluded/Active event "Request Reservation" button
- **Special Occasion Inquiry CTAs**:
  - `OccasionsClient.tsx`: Category "Inquire" buttons (Private Dining, Weddings, Celebrations).
  - *Decision*: Preserved without changes to special inquiry business logic.
- **WhatsApp Reservation Code Classification**:
  - **Class A (Replaced by ResDiary)**: Custom date picker, dining area radio buttons (Indoor/Garden), time slot search picker, party size selector, contact input fields, and "Send via WhatsApp" form submission for standard table bookings.
  - **Class B (Still Required by GEMA)**: `ReservationOverlay` modal shell, backdrop blur, slide-in drawer motion, close button (`X`), responsive padding, escape key dismissal, and `SiteSettings.whatsappNumber` integration.
  - **Class C (Legacy / Fallback)**: Kept in codebase; used as an immediate fallback card in the overlay if ResDiary fails to load or CDN is unreachable.

---

## Implementation Details

### Files to Create
1. [`apps/web/src/components/shared/ResDiaryWidget.tsx`](file:///Users/jasonsjanuard/Desktop/GEMA/apps/web/src/components/shared/ResDiaryWidget.tsx)
   - Client component responsible for:
     - Rendering `<div id="rd-widget-frame">` and hidden `<input id="rdwidgeturl">`.
     - Loading `WidgetV2Loader.js` in a Next.js-safe, browser-only manner.
     - Preventing duplicate script tag injection across modal open/close cycles.
     - Handling SPA lifecycle (invoking loader when `document.readyState === 'complete'`).
     - Displaying an elegant GEMA loading skeleton while the widget initializes.
     - Gracefully detecting load failure (timeout or script error) and rendering the GEMA WhatsApp fallback state.

### Files to Modify
1. [`apps/web/src/components/shared/ReservationOverlay.tsx`](file:///Users/jasonsjanuard/Desktop/GEMA/apps/web/src/components/shared/ReservationOverlay.tsx)
   - Replace the custom table booking form JSX with `<ResDiaryWidget locale={locale} whatsappNumber={whatsappNumber} />`.
   - Widen drawer on tablet/desktop to `md:w-[560px] lg:w-[600px]` to comfortably fit ResDiary's responsive layout without clipping.
   - Remove `hasEverOpened` guard so that required embed DOM (`#rd-widget-frame`, `#rdwidgeturl`) exists on initial public document render.
   - When closed, container applies `inert` and `aria-hidden` with `translate-x-full` and releases body scroll.
2. [`apps/web/src/app/(frontend)/[locale]/layout.tsx`](file:///Users/jasonsjanuard/Desktop/GEMA/apps/web/src/app/(frontend)/[locale]/layout.tsx)
   - Inject official loader using Next.js `<Script strategy="beforeInteractive">` scoped strictly to public frontend (never affecting `/admin` or `/api/*`).
   - Enables the browser's real natural `window.onload` event to execute `WidgetV2Loader.js` automatically without any synthetic event dispatching.

---

## Out-of-Scope & Invariants
- **NO Backend API / Webhook Integration**: Embed-only task as requested.
- **NO iFrame Primary Method**: JavaScript widget is the authoritative chosen method.
- **NO Third-Party Libraries / reverse-engineered endpoints**.
- **NO Changes to Special Occasion Business Logic**.
- **NO Disruption to Audio / Gateway / Homepage / Journal / Recognition / CMS**.

---

## Security (Content Security Policy)
- ResDiary assets originate from:
  - `https://booking.resdiary.com` (scripts, CSS, widget endpoint)
  - `https://widget-themes.resdiary.com` (custom venue CSS)
- If CSP headers are present, ensure `https://booking.resdiary.com` and `https://widget-themes.resdiary.com` are permitted in `script-src`, `style-src`, `connect-src`, and `frame-src`.

---

## Verification & QA Contract
1. **Desktop (1440x900) & Mobile (390x844)**:
   - Verify modal opens smoothly.
   - Verify ResDiary widget renders dates, times, party size, and availability.
   - Verify no horizontal overflow or scroll clipping.
   - Verify close button dismisses overlay.
2. **Lifecycle Stability**:
   - Open 1 → Loads cleanly.
   - Close → Dismisses cleanly.
   - Open 2 → Immediately visible, stable, zero duplicate loader scripts.
   - Close → Open 3 → Stable.
3. **Network & Console**:
   - Verify `WidgetV2Loader.js` returns HTTP 200.
   - Verify widget request to `https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false` returns HTTP 200.
   - Verify no duplicate loader requests on repeated open.
   - No severe console errors.
4. **Fallback Test**:
   - Simulate script failure (e.g. invalid loader URL or network block) and verify GEMA WhatsApp fallback card renders with authoritative `whatsappNumber`.
5. **Code QA**:
   - `npm run typecheck` passes with 0 errors.
   - `npm run build` passes with 47/47 pages generated.
