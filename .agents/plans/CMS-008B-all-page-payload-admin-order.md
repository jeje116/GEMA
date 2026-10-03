# CMS-008B: Exact All-Page Payload Admin Order Alignment

## 1. Objective
Align the editing order of fields and groups in Payload Admin across **every CMS-managed public page** to strictly mirror the top-to-bottom visual content order of the public website.

### Core Principle
**WEBSITE VISUAL / CONTENT ORDER == PAYLOAD ADMIN EDITING ORDER**

This is an **Admin UX alignment task**:
- **NO website frontend component reordering** (the website is the oracle).
- **NO database schema migration** (pure configuration/presentation reordering).
- **NO changes to field keys, types, localization flags, or validation semantics**.
- **NO changes to content ownership boundaries**.

---

## 2. Three Types of Admin Content
For page-oriented Admin forms, entries are classified as:
- **A. EDITABLE PAGE CONTENT**: Real Payload field mapped to CMS-owned editorial content.
- **B. NON-EDITABLE PAGE LANDMARK**: Presentational-only Admin marker orienting the editor where sections are code-owned, governance-held, or sourced from another Global (no database storage).
- **C. TECHNICAL / SYSTEM DATA**: Technical fields placed after page-visible content or in the system area (e.g. `sourceKey`, `slug`, flags).

---

## 3. Exact Page-by-Page Admin Order Specification

### 3.1 Homepage (`Homepage.ts`)
**Website Visual Order (`page.tsx`):**
1. Hero
2. Positioning
3. Cuisine / Menu Teaser
4. Signature Dishes
5. The Space
6. Chef
7. Recognition
8. Events
9. Reviews *(Code-owned / Governance hold)*
10. Journal
11. Visit

**Payload Admin Sequence:**
1. `01 — Hero` (`hero` group)
2. `02 — Positioning` (`positioning` group)
3. `03 — Cuisine / Menu Teaser` (`cuisineTeaser` group)
4. `04 — Signature Dishes` (`signatureDishes` group)
5. `05 — The Space` (`space` group)
6. `06 — Chef` (`chefPreview` group)
7. `07 — Recognition` (`recognitionIntro` group)
8. `08 — Events` (`eventsIntro` group)
9. `09 — Reviews — Code-owned / Governance Hold` *(Presentational-only Landmark)*
   - Description: "Reviews are not editable in CMS because verified review provenance has not been approved."
10. `10 — Journal` (`journalIntro` group)
11. `11 — Visit` (`visitIntro` group)

---

### 3.2 About Page (`AboutPage.ts`)
**Website Visual Order (`AboutClient.tsx`):**
1. Hero
2. Section 1: The Origin
3. Section 2: The Philosophy
4. Section 3: The Architecture

**Payload Admin Sequence:**
1. `01 — Hero` (`hero` group)
2. `02 — The Origin` (`origin` group)
3. `03 — The Philosophy` (`philosophy` group)
4. `04 — The Architecture` (`architecture` group)

---

### 3.3 Experience Page (`ExperiencePage.ts`)
**Website Visual Order (`ExperienceClient.tsx`):**
1. Hero (`hero.kicker`, `hero.headline`)
2. Editorial Introduction / Quote (`quote`)
3. Day to Night Masonry (`dayToNight` group: `heading`, `subtitle`, `morningHeading`, `morningDescription`, `transitionQuote`, `eveningHeading`, `eveningDescription`)
4. Materials (`materials` group: `heading`, `body1`, `body2`)

**Payload Admin Sequence:**
1. `01 — Hero` (`hero` group)
2. `02 — Introduction / Quote` (`quote`)
3. `03 — Day to Night` (`dayToNight` group, preserving visual sequence)
4. `04 — Materials` (`materials` group)

---

### 3.4 Occasions Page (`OccasionsPage.ts`)
**Website Visual Order (`OccasionsClient.tsx`):**
1. Hero (`hero.subtitle`)
2. Private Dining (`privateDining` group: `title`, `description`, `feature1..3`)
3. Wedding (`wedding` group: `title`, `description`, `feature1..3`)
4. Birthday (`birthday` group: `title`, `description`, `feature1..3`)
5. Brand Exclusives Overview (`brandExclusives` group: `heading`, `description`)
6. Brand Events (`brandEvents` group: `mondial`, `frankCo`, `maharva`)
7. Landmark: Inquire Now / Reservation Modal *(Code-owned feature CTA)*

**Payload Admin Sequence:**
1. `01 — Hero` (`hero` group)
2. `02 — Private Dining` (`privateDining` group)
3. `03 — Wedding` (`wedding` group)
4. `04 — Birthday` (`birthday` group)
5. `05 — Brand Exclusives (Overview)` (`brandExclusives` group)
6. `06 — Brand Exclusives (Events)` (`brandEvents` group)
7. `07 — Inquire / Reservation CTA — Code-owned` *(Presentational-only Landmark)*

---

### 3.5 Menu Page Global (`MenuPage.ts`)
**Website Visual Order (`MenuClient.tsx`):**
1. Page Header (Title, Philosophy)
2. Menu Content *(Edited under CONTENT → Menu Categories & Menu Items)*
3. Footer / Tax & Service Note

**Payload Admin Sequence:**
1. `01 — Page Header` (`title`, `philosophy`)
2. `02 — Menu Content — Managed in Collections` *(Presentational-only Landmark)*
   - Description: "Menu categories and items are edited under CONTENT → Menu Categories and Menu Items."
3. `03 — Footer / Tax & Service` (`taxServiceFootnote`)

---

### 3.6 Menu Categories Collection (`MenuCategories.ts`)
**Website Visible Order:**
1. Category Name (`name`)
2. Section Note (`sectionNote`)

**Payload Admin Sequence:**
- **Page Content:**
  1. `name`
  2. `sectionNote`
- **Classification & System:**
  3. `menuType`
  4. `sortOrder`
  5. `isActive`
  6. `slug`

---

### 3.7 Menu Items Collection (`MenuItems.ts`)
**Website Visible Order (`MenuClient.tsx`):**
1. Name (`name`)
2. Description (`description`)
3. Price (`priceLabel`)
4. Portion (`portion`) / Price Variants (`priceVariants`)
5. Editorial subhead & notes: `subhead`, `subheadNote`, `additionalNotes`
6. Image (`image` - rendered in Homepage Signature Dishes carousel)

**Payload Admin Sequence:**
- **Page Content:**
  1. `name`
  2. `description`
  3. `priceLabel`
  4. `portion`
  5. `priceVariants`
  6. `subhead`
  7. `subheadNote`
  8. `additionalNotes`
  9. `image`
- **Classification & Display Flags:**
  10. `category`
  11. `isIntroBlock`
  12. `featured`
  13. `signature`
  14. `isAvailable`
  15. `sortOrder`
- **System:**
  16. `sourceKey` (read-only)

---

### 3.8 Chef Global (`Chef.ts`)
**Website Visual Order (`ChefClient.tsx`):**
1. Sticky Portrait / Hero Media (`portrait` with color reveal)
2. Name (`name`)
3. Role (`role`)
4. Biography (`biography`)
5. Quote (`quote`)
6. Supporting Video (`videoFile`, `videoPoster` - used on Homepage Chef Preview blob)

**Payload Admin Sequence:**
1. `01 — Portrait / Hero Media` (`portrait`)
2. `02 — Chef Identity` (`name`, `role`)
3. `03 — Biography` (`biography`)
4. `04 — Quote` (`quote`)
5. `05 — Homepage Supporting Video` (`videoFile`, `videoPoster`)
6. `06 — System / Legacy Preview Fields` (`ctaLabel`, `previewText` - marked POTENTIALLY DEAD)

---

### 3.9 Visit Page Global (`VisitPage.ts`)
**Website Visual Order (`VisitClient.tsx`):**
1. Visit Header (Code-owned)
2. Map & Contact (Managed in Site Settings)
3. Reservations Note (`reservationsNote`)
4. Dietary Policy (`dietaryPolicy`)
5. Dress Code Policy (`dressCodePolicy`)
6. Parking Policy (`parkingPolicy`)

**Payload Admin Sequence:**
1. `01 — Visit Header — Code-owned` *(Presentational Landmark)*
2. `02 — Map & Contact — Managed in Site Settings` *(Presentational Landmark)*
3. `03 — Reservations Note` (`reservationsNote`)
4. `04 — Dietary Policy` (`dietaryPolicy` group)
5. `05 — Dress Code Policy` (`dressCodePolicy` group)
6. `06 — Parking Policy` (`parkingPolicy` group)

---

### 3.10 Recognition Page Global (`RecognitionPage.ts`) & Collection (`Recognitions.ts`)
**Website Visual Order (`RecognitionClient.tsx`):**
1. Header: Kicker (`kicker`), Title (Code-owned), Subtitle (`subtitle`), Archive CTA (Code-owned)
2. List: Recognition records

**Payload Admin Sequence (`RecognitionPage.ts`):**
1. `01 — Kicker` (`kicker`)
2. `02 — Title — Code-owned` *(Presentational Landmark)*
3. `03 — Subtitle` (`subtitle`)
4. `04 — View Archive Link — Code-owned` *(Presentational Landmark)*
5. `05 — Recognition Records — Managed in Collections` *(Presentational Landmark)*

**Payload Admin Sequence (`Recognitions.ts`):**
1. `year`
2. `title`
3. `awardingBody`
4. `scope`
5. `contentStatus`

---

### 3.11 Events Collection (`Events.ts`)
**Website Detail Order (`EventDetailClient.tsx`):**
1. Hero: `coverImage`, `eyebrow`, `title`
2. Meta: `startDateTime`, `endDateTime`, `priceLabel`
3. Body: `fullDescription`
4. Listing / Card Content: `shortDescription`, `featured`
5. Technical: `slug`

**Payload Admin Sequence:**
- **Hero & Header:**
  1. `coverImage`
  2. `eyebrow`
  3. `title`
- **Event Schedule & Meta:**
  4. `startDateTime`
  5. `endDateTime`
  6. `priceLabel`
- **Event Body:**
  7. `fullDescription`
- **Listing & Card Content:**
  8. `shortDescription`
  9. `featured`
- **Technical:**
  10. `slug`

---

### 3.12 Journal Posts Collection (`JournalPosts.ts`)
**Website Detail Order (`JournalPostClient.tsx`):**
1. Article Header: `category`, `title`, `publishDate`, `authorLabel`
2. Hero: `coverImage`
3. Introduction: `excerpt`
4. Article Body: `content`
5. SEO: `seo` (`metaTitle`, `metaDescription`)
6. Technical: `slug`

**Payload Admin Sequence:**
1. `category`
2. `title`
3. `publishDate`
4. `authorLabel`
5. `coverImage`
6. `excerpt`
7. `content`
8. `seo`
9. `slug`

---

### 3.13 Site Settings (`SiteSettings.ts`)
**Operational Groups (including all active fields):**
1. `01 — Identity`: `restaurantName`
2. `02 — Contact`: `phone`, `whatsappNumber`, `email`
3. `03 — Social`: `instagramUrl`, `tiktokUrl`
4. `04 — Location & Map`: `fullAddress`, `mapUrl`
5. `05 — Dietary & Services`: `dietaryPolicy`, `services`

---

### 3.14 Page Media (`PageMedia.ts`)
**Top-Level Group Order (Public Navigation Order: Menu → About → Experience → Occasions):**
1. `01 — Menu Page Media` (`foodImage`, `beverageImage`)
2. `02 — About Page Media` (`originImage`, `philosophyImage`, `architectureImage`)
3. `03 — Experience Page Media` (`heroImage`, `morningImage`, `eveningImage`, `detailsImage`)
4. `04 — Occasions Page Media` (`heroImage`, `privateDiningImage`, `weddingImage`, `birthdayImage`, `brandMondialImage`, `brandFrankCoImage`, `brandMaharvaImage`)

---

### 3.15 Navigation (`Navigation.ts`)
1. `01 — Header Navigation` (`headerLinks` in display order)
2. `02 — Footer Navigation` (`footerLinks` in display order)

---

## 4. Confusing / Potentially Dead Field Audit
- `homepage.hero.ctaLabel`: DUPLICATE-LOOKING (In `Hero.tsx`, `ctaPrimary` and `ctaLabel` both exist. Preserved for compatibility).
- `chef.previewText`: POTENTIALLY DEAD (Homepage reads `homepage.chefPreview.text`. Preserved for compatibility).
- `chef.ctaLabel`: POTENTIALLY DEAD (Homepage reads `homepage.chefPreview.ctaLabel`. Preserved for compatibility).

---

## 5. Verification Plan
1. `npx payload generate:types` and `npx payload generate:importmap`
2. `npm run typecheck` (`tsc --noEmit`)
3. `npm run build` (Next.js Turbopack)
4. Data preservation assertion script.
5. Browser QA via `browser_subagent` inspecting all 15 Admin forms in EN and ID, and verifying zero frontend visual differences.
