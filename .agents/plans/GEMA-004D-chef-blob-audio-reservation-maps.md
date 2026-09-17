# GEMA-004D — Chef Blob #2, Gateway Audio Reliability, Reservation-to-WhatsApp Flow, Real Google Maps Embed

Status: APPROVED
Approved: 2026-09-17

## Objective

Controlled frontend refinement before Netlify design staging. Fix audio reliability, integrate approved Blobmaker Shape #2 for Chef media, restore ReservationOverlay as primary reservation UX with direct WhatsApp submission, and embed real Google Maps without API key dependency.

## Scope

### Files to Modify
- `apps/web/src/components/home/ChefPreview.tsx`
- `apps/web/src/components/shared/ReservationOverlay.tsx`
- `apps/web/src/i18n/translations.ts`
- `apps/web/src/lib/audioManager.ts`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/home/Hero.tsx`
- `apps/web/src/components/shared/MobileReserveBar.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/components/visit/VisitClient.tsx`
- `apps/web/src/components/home/VisitPreview.tsx`
- `apps/web/src/components/events/EventDetailClient.tsx`
- `apps/web/src/components/occasions/OccasionsClient.tsx`

### Out of Scope
- Payload CMS, Netlify deployment, legacy Vite app
- Pages unrelated to audio/reservation/Chef/Visit
- Transition Logo Scale, Experience header

## Execution Contract

### 1. Chef Blob #2
- Replace clipPath with Blobmaker Shape #2 normalized to objectBoundingBox
- Portrait 9:16 container
- Same path for terracotta outline (original 200×200 viewBox)

### 2. Reservation Flow
- Remove success screen
- Valid submit → build locale-aware message → open WhatsApp → close overlay
- Popup-block fallback: window.location.href
- Form values survive until URL is constructed

### 3. CTA Restoration
- All 8 components: replace wa.me links with openReservation()

### 4. Google Maps
- No-API-key iframe: maps.google.com?q=...&output=embed
- Verify place resolves to GEMA location

### 5. Audio
- localStorage → sessionStorage
- Default userIntent = 'disabled'
- toggle() branches on isPlaying only
