# GEMA — CMS-009A Execution Plan: Full-Site Content Ownership Remediation

Version: 1.0
Status: APPROVED (Execution Contract)

## 1. Objectives

Remediate all material content-ownership gaps discovered during the CMS-009 full-site audit:
1. **P0 Public Content Risks**:
   - P0-A: `/visit` SEO metadata stale address &rarr; derive canonically from `SiteSettings.fullAddress`.
   - P0-B: Homepage Reviews prototype concept quotes &rarr; create `Reviews` Collection, Homepage curation with `verified`+`active` filter, hide section when 0 verified reviews exist.
   - P0-C: Recognition public runtime &rarr; remove fallback to `fixtures/recognition.ts`, query Payload `Recognitions` collection with `contentStatus = 'verified'`, hide award claims if 0 verified records exist.
2. **Operational Single Source (SiteSettings)**:
   - Homepage Visit map iframe &rarr; derive query from `SiteSettings.fullAddress`.
   - Footer Social links &rarr; wire to `siteData.instagramUrl` and `siteData.tiktokUrl`.
   - Footer Dietary policy &rarr; wire to `siteData.dietaryPolicy`.
   - Footer Location label &rarr; add `locationLabel` presentation field to `SiteSettings` (default: `'Surabaya, Indonesia'`).
3. **Editorial CMS Ownership**:
   - `OccasionsPage`: add localized `title`.
   - `VisitPage`: add localized `title`, `contactHeading`, `reservationsHeading`.
   - `Homepage.visitIntro`: add localized `locationHeading` and `servicesHeading`.
   - `EventsPage` Global: create fixed-schema Global for listing framing (`title`, `subtitle`).
   - `JournalPage` Global: create fixed-schema Global for listing framing (`title`, `subtitle`).
4. **Code UI Localization**:
   - Move all hardcoded English UI strings into `translations.ts` (Occasions CTA, Visit map/reserve labels, Event detail sidebar labels, Journal filter/navigation, Footer "Navigation" label, 404 page).
5. **SEO Metadata**:
   - Derive metadata from editable page Globals instead of hardcoded strings.
6. **Committed Migration & Governance**:
   - Committed Payload migration for schema changes.
   - ADR-009 in `DECISIONS.md`.

---

## 2. Scope & Blast Radius

### Files to Create
- `apps/web/src/collections/Reviews.ts`
- `apps/web/src/globals/EventsPage.ts`
- `apps/web/src/globals/JournalPage.ts`
- `apps/web/src/migrations/20260920_XXXXXX_cms_009a_full_site_remediation.ts` (and `.json`)

### Files to Modify
- `apps/web/src/payload.config.ts` (register `Reviews`, `EventsPage`, `JournalPage`)
- `apps/web/src/globals/Homepage.ts` (replace landmark 09 with `reviews` group, add `visitIntro.locationHeading`, `servicesHeading`)
- `apps/web/src/globals/OccasionsPage.ts` (add localized `title`)
- `apps/web/src/globals/VisitPage.ts` (add localized `title`, `contactHeading`, `reservationsHeading`)
- `apps/web/src/globals/SiteSettings.ts` (add `locationLabel` under 04 — Location)
- `apps/web/src/content/provider.ts` (update `getHomepageData`, `getOccasionsPageData`, `getVisitPageData`, add `getEventsPageData`, `getJournalPageData`, update `getRecognitions` to query Payload Local API with `contentStatus = 'verified'`)
- `apps/web/src/i18n/translations.ts` (add missing UI translations)
- `apps/web/src/components/home/ReviewsPreview.tsx` (accept props, hide if empty, remove fixture import)
- `apps/web/src/components/home/RecognitionPreview.tsx` (query or accept verified records, hide if empty)
- `apps/web/src/components/home/VisitPreview.tsx` (use CMS headings and canonical map query)
- `apps/web/src/components/occasions/OccasionsClient.tsx` (use CMS title and translated CTA)
- `apps/web/src/components/visit/VisitClient.tsx` (use CMS headings and translated labels)
- `apps/web/src/components/events/EventsClient.tsx` (use `EventsPage` title/subtitle)
- `apps/web/src/components/events/EventDetailClient.tsx` (use translated sidebar labels)
- `apps/web/src/components/journal/JournalClient.tsx` (use `JournalPage` title/subtitle and translated filter/CTA)
- `apps/web/src/components/journal/JournalDetailClient.tsx` (use translated navigation links)
- `apps/web/src/components/layout/SiteFooter.tsx` (wire social URLs, dietary, locationLabel, translated header)
- `apps/web/src/app/(frontend)/[locale]/not-found.tsx` (use `translations.ts` keys)
- `apps/web/src/app/(frontend)/[locale]/page.tsx` (pass reviews and verified recognitions)
- `apps/web/src/app/(frontend)/[locale]/events/page.tsx` (fetch `EventsPage` data)
- `apps/web/src/app/(frontend)/[locale]/journal/page.tsx` (fetch `JournalPage` data)
- `apps/web/src/app/(frontend)/[locale]/visit/page.tsx` (derive metadata from `SiteSettings`)
- `apps/web/src/app/(frontend)/[locale]/about/page.tsx` (derive metadata from `AboutPage`)
- `apps/web/src/app/(frontend)/[locale]/experience/page.tsx` (derive metadata from `ExperiencePage`)
- `apps/web/src/app/(frontend)/[locale]/occasions/page.tsx` (derive metadata from `OccasionsPage`)
- `apps/web/src/app/(frontend)/[locale]/chef/mandif-warokka/page.tsx` (derive metadata from `Chef`)
- `apps/web/src/app/(frontend)/[locale]/recognition/page.tsx` (derive metadata from `RecognitionPage`)
- `.agents/DECISIONS.md` (ADR-009)
- `.agents/TASKS.md` (CMS-009A)
- `.agents/CONTEXT.md` (update state)

---

## 3. Test Contract

1. **P0-A (Visit SEO Address)**: Generated metadata for `/en/visit` and `/id/visit` reflects `SiteSettings.fullAddress` and contains NO reference to `Jl. Musi No. 21, Tegalsari`.
2. **P0-B (Reviews Provenance & Empty State)**: With 0 verified reviews, Homepage Reviews section is completely hidden. Concept quotes in `fixtures/reviews.ts` are never read. Unverified reviews in Payload cannot be selected on Homepage.
3. **P0-C (Recognition Provenance)**: Homepage Recognition Preview and `/recognition` page query Payload with `contentStatus = 'verified'`. With 0 verified records, no awards claims appear publicly. `fixtures/recognition.ts` is never read by public runtime.
4. **SiteSettings Single Source**: Footer social links, dietary policy, and location label react dynamically to `SiteSettings`. Homepage map embed derives from `SiteSettings.fullAddress`.
5. **Editorial CMS Ownership**: Occasions title, Visit title/headings, Homepage visit headings, Events listing title/subtitle, Journal listing title/subtitle are editable in Payload Admin.
6. **Code UI Localization**: All audited English UI strings (e.g. "Inquire Now", "Open in Google Maps", "Request Reservation", "Read Story", "All") render properly in English and Indonesian.
7. **Regression**: Zero build errors, zero typecheck errors, Turbopack passes cleanly.
