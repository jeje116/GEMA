# GEMA-004E: Chef Blob Geometry Refinement & WhatsApp Double-Navigation Fix

## 1. Overview & Scope
Narrow frontend refinement following GEMA-004D:
- **Workstream 1**: Chef Blob Geometry Refinement — widen horizontal usable area using approved updated Blobmaker geometry while retaining organic editorial character, 9:16 portrait proportion, and subtle terracotta outline.
- **Workstream 2**: Fix WhatsApp Double-Navigation Bug — prevent original GEMA tab from redirecting to WhatsApp upon reservation form submission.

### Boundaries (STRICT)
- DO NOT modify: audio behavior, Google Maps, navbar, page transitions, unrelated pages, Payload CMS.
- ONLY modify:
  - `apps/web/src/components/home/ChefPreview.tsx`
  - `apps/web/src/components/shared/ReservationOverlay.tsx`

## 2. Workstream 1: Chef Blob Geometry Refinement
- **Source Geometry**:
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"> <path d="M54.5,-57.9C72.3,-47,89.6,-36.7,91.9,-24.3C94.1,-11.9,81.4,2.5,74.3,18.1C67.3,33.8,66.1,50.7,54.6,58.8C43.2,67,21.6,66.3,2.1,64C-17.3,61.8,-34.6,57.9,-44.7,49.5C-55,41.1,-58.3,28.1,-56.5,17.4C-54.6,6.7,-47.8,-1.7,-47,-14.1C-46.2,-26.5,-51.6,-42.9,-44.7,-56.5C-37.9,-70.1,-19,-80.9,-0.3,-80.6C18.3,-80.3,36.7,-68.9,54.5,-57.9Z" transform="translate(100 100)" /> </svg>`
- **Normalization for `clipPathUnits="objectBoundingBox"`**:
  Every (x, y) coordinate mapped via `normX = (x + 100) / 200`, `normY = (y + 100) / 200`:
  `d="M0.7725,0.2105 C0.8615,0.265 0.948,0.3165 0.9595,0.3785 C0.9705,0.4405 0.907,0.5125 0.8715,0.5905 C0.8365,0.669 0.8305,0.7535 0.773,0.794 C0.716,0.835 0.608,0.8315 0.5105,0.82 C0.4135,0.809 0.327,0.7895 0.2765,0.7475 C0.225,0.7055 0.2085,0.6405 0.2175,0.587 C0.227,0.5335 0.261,0.4915 0.265,0.4295 C0.269,0.3675 0.242,0.2855 0.2765,0.2175 C0.3105,0.1495 0.405,0.0955 0.4985,0.097 C0.5915,0.0985 0.6835,0.1555 0.7725,0.2105 Z"`
- **Decorative Outline**:
  Retains `viewBox="0 0 200 200"` with the raw path and `transform="translate(100 100)"`, `stroke="var(--terracotta)"`, `strokeWidth="1.2"`, `strokeOpacity="0.5"`.
- **Media Presentation**:
  `aspect-[9/16]`, `object-fit: cover`, `object-position: center center`.

## 3. Workstream 2: Reservation WhatsApp Navigation Fix
- **Root Cause**:
  `window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')` returns `null` in standard browsers when `noopener` is in features, even though the new tab opened successfully. The fallback `if (!popup) { window.location.href = whatsAppUrl }` was incorrectly firing.
- **Approved Solution Pattern**:
  ```ts
  const whatsappWindow = window.open('', '_blank');
  if (whatsappWindow) {
    whatsappWindow.opener = null;
    whatsappWindow.location.href = whatsAppUrl;
    closeReservation();
  } else {
    // True fallback only if popup actually blocked
    window.location.assign(whatsAppUrl);
  }
  ```
- **Order of Operations**:
  1. Validate form.
  2. Build locale-aware reservation message from alive state.
  3. Encode message and construct `https://wa.me/6281252200049?text=...`.
  4. Synchronously open new tab window (`window.open('', '_blank')`).
  5. If tab handle returned: set `opener = null`, assign URL to new tab, call `closeReservation()`.
  6. Else: fallback to `window.location.assign(whatsAppUrl)`.
  7. Reset form state after overlay closes.

## 4. Verification Strategy
1. `npm run typecheck` & `npm run build`
2. Browser QA on Desktop (1440px) and Mobile (390px)
3. Reservation submit test in EN and ID locales: verify original GEMA tab URL unchanged, new tab navigates to WhatsApp URL.
