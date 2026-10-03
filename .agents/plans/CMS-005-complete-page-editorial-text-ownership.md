# GEMA CMS-005: Complete Page Editorial Text Ownership Without Structural / Feature Editing

## 1. Objective
Extend Payload CMS ownership to all remaining public page editorial/content text across About, Experience, Occasions, Visit, and Recognition pages, while preserving 100% of website structure, layout, responsive design, animations, audio, and feature logic.

## 2. Product Owner Boundary
- **Payload controls**: PAGE CONTENT TEXT ("What the page says").
- **Code controls**: FEATURE TEXT, UI CONTROLS, APPLICATION BEHAVIOR, PAGE STRUCTURE ("How the website operates").
- **Reservation feature text**: 100% CODE-OWNED (out of scope).
- **CTA rules**:
  - Visit "Reserve a Table" button: CODE-OWNED (triggers Reservation modal).
  - Occasions "Inquire Now" button: CODE-OWNED (triggers Reservation modal).
  - Recognition "View Archive" link: CODE-OWNED (operates archive anchor navigation).

## 3. Fixed-Schema Globals (No Page Builder, No Structural Arrays)

### A. `about-page` (Global)
- `slug`: `about-page`
- `admin.group`: `'SITE'`
- `versions`: `{ drafts: true }`
- Fields:
  - `hero`:
    - `headline`: text, localized
    - `subtitle`: textarea, localized
  - `origin`:
    - `title`: text, localized
    - `body1`: textarea, localized
    - `body2`: textarea, localized
  - `philosophy`:
    - `title`: text, localized
    - `body1`: textarea, localized
    - `dietaryPrefix`: text, localized ("We adhere to a strict ")
    - `dietarySuffix`: textarea, localized (" policy, ensuring our culinary vision is accessible and respectful of our diverse community without ever compromising on flavor or technique.")
  - `architecture`:
    - `title`: text, localized
    - `body1`: textarea, localized
    - `body2`: textarea, localized

### B. `experience-page` (Global)
- `slug`: `experience-page`
- `admin.group`: `'SITE'`
- `versions`: `{ drafts: true }`
- Fields:
  - `hero`:
    - `kicker`: text, localized
    - `headline`: text, localized
  - `quote`: textarea, localized
  - `dayToNight`:
    - `heading`: text, localized
    - `subtitle`: text, localized
    - `morningHeading`: text, localized
    - `morningDescription`: textarea, localized
    - `transitionQuote`: textarea, localized
    - `eveningHeading`: text, localized
    - `eveningDescription`: textarea, localized
  - `materials`:
    - `heading`: text, localized
    - `body1`: textarea, localized
    - `body2`: textarea, localized

### C. `occasions-page` (Global)
- `slug`: `occasions-page`
- `admin.group`: `'SITE'`
- `versions`: `{ drafts: true }`
- Fields:
  - `hero`:
    - `subtitle`: textarea, localized
  - `privateDining`:
    - `title`: text, localized
    - `description`: textarea, localized
    - `feature1`: text, localized
    - `feature2`: text, localized
    - `feature3`: text, localized
  - `wedding`:
    - `title`: text, localized
    - `description`: textarea, localized
    - `feature1`: text, localized
    - `feature2`: text, localized
    - `feature3`: text, localized
  - `birthday`:
    - `title`: text, localized
    - `description`: textarea, localized
    - `feature1`: text, localized
    - `feature2`: text, localized
    - `feature3`: text, localized
  - `brandExclusives`:
    - `heading`: text, localized
    - `description`: textarea, localized
  - `brandEvents`:
    - `mondial`: group with `brand`: text, `title`: text, localized
    - `frankCo`: group with `brand`: text, `title`: text, localized
    - `maharva`: group with `brand`: text, `title`: text, localized

### D. `visit-page` (Global)
- `slug`: `visit-page`
- `admin.group`: `'SITE'`
- `versions`: `{ drafts: true }`
- Fields:
  - `reservationsNote`: textarea, localized
  - `dietaryPolicy`:
    - `heading`: text, localized
    - `description`: textarea, localized
  - `dressCodePolicy`:
    - `heading`: text, localized
    - `description`: textarea, localized
  - `parkingPolicy`:
    - `heading`: text, localized
    - `description`: textarea, localized

### E. `recognition-page` (Global)
- `slug`: `recognition-page`
- `admin.group`: `'SITE'`
- `versions`: `{ drafts: true }`
- Fields:
  - `kicker`: text, localized
  - `subtitle`: textarea, localized

## 4. Local Admin Password Reset Tool
- `apps/web/scripts/reset-admin-password.ts`
- Target: `admin@gemasurabaya.local`
- Interactive hidden prompt without echoing to terminal.
- Double-entry confirmation.
- Uses Payload auth API. Zero plaintext passwords in logs, git, or reports.

## 5. Blast Radius & Scope Containment
- **Files to Modify**:
  - `apps/web/src/payload.config.ts`
  - `apps/web/src/lib/revalidation.ts`
  - `apps/web/src/content/provider.ts`
  - `apps/web/src/globals/SiteSettings.ts`
  - `apps/web/src/components/about/AboutClient.tsx`
  - `apps/web/src/components/experience/ExperienceClient.tsx`
  - `apps/web/src/components/occasions/OccasionsClient.tsx`
  - `apps/web/src/components/visit/VisitClient.tsx`
  - `apps/web/src/components/recognition/RecognitionClient.tsx`
  - `apps/web/src/app/(frontend)/[locale]/about/page.tsx`
  - `apps/web/src/app/(frontend)/[locale]/experience/page.tsx`
  - `apps/web/src/app/(frontend)/[locale]/occasions/page.tsx`
  - `apps/web/src/app/(frontend)/[locale]/visit/page.tsx`
  - `apps/web/src/app/(frontend)/[locale]/recognition/page.tsx`
  - `apps/web/scripts/bootstrap-content.ts`
- **Files to Create**:
  - `apps/web/src/globals/AboutPage.ts`
  - `apps/web/src/globals/ExperiencePage.ts`
  - `apps/web/src/globals/OccasionsPage.ts`
  - `apps/web/src/globals/VisitPage.ts`
  - `apps/web/src/globals/RecognitionPage.ts`
  - `apps/web/scripts/reset-admin-password.ts`
  - `apps/web/scripts/seed-cms-005-pages.ts`
  - `apps/web/scripts/test-cms-005-qa.ts`
- **Untouched Components**:
  - `ReservationOverlay.tsx` (all reservation logic, fields, slots)
  - `SiteHeader.tsx`, `SiteFooter.tsx`, `AudioControl.tsx`
  - Navigation routing and layouts
  - All styling, animations, colors, fonts, image dimensions

## 6. Test Contract
- **Normal Case**: All 5 pages render identical approved text in EN and ID from Payload.
- **Direct Edit Test**: Reversible edits to About, Experience, Occasions, Visit, Recognition reflect on public pages without redeploy.
- **Structural Safety**: Editor cannot add/delete/reorder sections or features.
- **Zero Fallback**: Zero `Payload || fallback` in runtime code.
