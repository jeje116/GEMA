# CMS-002: Core CMS Schema + Complete Media Migration + Direct Frontend Media Wiring Implementation Contract

## 1. Objective
Implement the complete CMS-002 media architecture:
1. Define approved Phase-1 CMS schemas (Collections: `media`, `menu-categories`, `menu-items`, `events`, `journal-posts`, `recognitions`, `users`; Globals: `homepage`, `chef`, `page-media`, `site-settings`, `navigation`).
2. Add internal `sourceKey` technical field to `media` for deterministic, deduplicated asset seeding.
3. Migrate and programmatically download/import all 40 active content media slots (39 photo slots, 1 video slot) into local filesystem storage (`public/media/cms/`), deduplicated by underlying asset identity into unique Media records.
4. Establish temporary media-mapping routing (`homepage.signatureDishMedia`, `page-media.events`, `page-media.journal`, `page-media` for About/Experience/Occasions/Menu) so that ALL active photo and video slots resolve from Payload CMS without prematurely migrating textual data (which remains in CMS-003).
5. Implement direct frontend media wiring through `contentProvider` and a normalized `resolveMedia` adapter, with on-demand `revalidatePath` hooks and reference-checked delete protection.
6. Verify live CMS editability (image swap updates website without code edits, draft exposure prevented) and execute complete media parity and regression testing.

## 2. Invariants & Scope Boundaries
- **Strictly Preserved**:
  - No public website redesign, no altered layouts, aspect ratios, crops, animation wrappers, or sound behavior.
  - Old static files in `/public/media/...` remain untouched as oracle/rollback baselines.
  - No textual fixture migration for Menu, Events, or Journal; text continues reading from fixtures.
  - Recognitions remain `contentStatus: 'needs-confirmation'` / HOLD; no unverified recognitions seeded.
  - Guest Reviews remain HOLD.
  - ADR-006 operational site facts remain locked to Admin.
  - Storage is local filesystem (`public/media/cms/`) for local development; future R2 readiness via normalized media URLs.
  - Public Local API queries use `overrideAccess: false`.

## 3. Media Slots vs Unique Assets Deduplication
- **Total Active Slots**: 40 (39 photo slots + 1 video slot).
- **Deduplication Mechanism**:
  - Unique technical `sourceKey` on Media documents.
  - Where the identical asset is reused across components (e.g. shared Unsplash images), a single Media document is created and referenced by multiple slots.
- **Deduplicated Asset Audit**:
  - `home.hero.open-kitchen` (`/media/hero/home-hero-open-kitchen.jpg`)
  - `home.teaser.antipasti` (`/media/teaser/home-menu-teaser-antipasti.jpg`)
  - `home.teaser.pasta` (`/media/teaser/home-menu-teaser-pasta.jpg`)
  - `home.teaser.grill` (`/media/teaser/home-menu-teaser-grill.jpg`)
  - `home.teaser.dolci` (`/media/teaser/home-menu-teaser-dolci.jpg`)
  - `home.signature.steak` (`/media/signature/home-signature-steak.jpg`)
  - `home.signature.tiramisu` (`/media/signature/home-signature-tiramisu.jpg`)
  - `home.space.indoor` (`/media/experience/home-experience-indoor.jpg`)
  - `home.space.patio` (`/media/experience/home-experience-patio.jpg`)
  - `chef.mandif.portrait` (`/media/chef/chef-mandif-warokka.jpg`)
  - `chef.mandif.home-video` (`/media/video/chef-home-loop.mp4`)
  - `chef.mandif.home-video-poster` (Google Drive still)
  - `menu.panel.food` (`/media/menu/menu-food-overview.jpg`)
  - `menu.panel.beverage` (`/media/menu/menu-beverage-cocktail.jpg`)
  - `about.origin` (`/media/about/about-origin.jpg`)
  - `about.philosophy` (`/media/about/about-philosophy.jpg`)
  - `about.architecture` (`/media/about/about-architecture.jpg`)
  - `experience.hero` (`/media/experience/experience-hero.jpg`)
  - `experience.morning` (`/media/experience/experience-day-morning.jpg`)
  - `experience.evening` (Unsplash `photo-1514933651103-005eec06c04b`)
  - `experience.details` (`/media/experience/experience-culinary-details.jpg`)
  - `occasions.hero` (`/media/occasions/occasions-hero.jpg`)
  - `occasions.private-dining` (`/media/occasions/occasions-private-dining.jpg`)
  - `occasions.wedding` (Unsplash `photo-1511795409834-ef04bbd61622`)
  - `occasions.birthday` (Unsplash `photo-1530103862676-de8892bc6cb4`)
  - `occasions.brand.mondial` (Unsplash `photo-1601121141461-9d6647bca1ed`)
  - `occasions.brand.frank-co` (Unsplash `photo-1599643478524-fb524b7a1493`)
  - `occasions.brand.maharva` (Unsplash `photo-1611085583191-a3b181a88401`)
  - `events.private-table-series` (Unsplash `photo-1559339352-11d035aa65de`)
  - `events.seasonal-tasting` (Unsplash `photo-1514326640560-7d063ef2aed5`)
  - `events.sunday-society` (Unsplash `photo-1544148103-0773bf10d330`)
  - `shared.unsplash.1551183053-bf91a1d81141` (used in Signature pizzetta-1, Event wine-discovery, Journal jrn-1 body)
  - `shared.unsplash.1513104890138-7c749659a591` (used in Signature pizzetta-2, Event pasta-masterclass, Journal jrn-2 cover)
  - `shared.unsplash.1517248135467-4c7edcad34c4` (used in Event aperitivo-hour, Journal jrn-3 cover)
  - `journal.fresh-pasta.cover` (Unsplash `photo-1621996346565-e3dbc646d9a9`)

## 4. Implementation Steps
1. **Schema Definitions in `apps/web/src/`**:
   - `collections/Media.ts`: `upload: { staticDir: 'public/media/cms' }`, `alt` (localized), `caption` (localized), `sourceKey` (unique, admin hidden), `beforeDelete` hook checking references across globals/collections.
   - `collections/MenuCategories.ts`: `name`, `slug`, `menuType`, `sortOrder`, `isActive`, `sectionNote`.
   - `collections/MenuItems.ts`: `category`, `name`, `description`, `priceLabel`, `portion`, `priceVariants`, `subhead`, `subheadNote`, `additionalNotes`, `isIntroBlock`, `featured`, `signature`, `isAvailable`, `sortOrder`, `image`.
   - `collections/Events.ts`: `title`, `slug`, `eyebrow`, `shortDescription`, `fullDescription`, `startDateTime`, `endDateTime`, `priceLabel`, `coverImage`, `featured`, native drafts.
   - `collections/JournalPosts.ts`: `title`, `slug`, `category`, `excerpt`, `coverImage`, `content`, `publishDate`, `authorLabel`, `seo`, native drafts.
   - `collections/Recognitions.ts`: `year`, `title`, `awardingBody`, `scope`, `contentStatus`.
   - `globals/Homepage.ts`: `hero.image`, `cuisineTeaser[].image`, `space.imagePrimary`, `space.imageSecondary`, `signatureDishMedia[]` (`itemKey`, `image`), plus approved editorial fields. Revalidation hook.
   - `globals/Chef.ts`: `portrait`, `videoPoster`, `videoFile`, `name`, `role`, `biography`, `quote`, `ctaLabel`. Revalidation hook.
   - `globals/PageMedia.ts`: `menu` (`foodImage`, `beverageImage`), `about` (`originImage`, `philosophyImage`, `architectureImage`), `experience` (`heroImage`, `morningImage`, `eveningImage`, `detailsImage`), `occasions` (`heroImage`, `privateDiningImage`, `weddingImage`, `birthdayImage`, `brandMondialImage`, `brandFrankCoImage`, `brandMaharvaImage`), `events[]` (`eventKey`, `coverImage`), `journal[]` (`journalKey`, `coverImage`, `bodyImage`). Revalidation hook.
   - `globals/SiteSettings.ts`: ADR-006 fields (admin only).
   - `globals/Navigation.ts`: Header/footer navigation structure.
   - Update `payload.config.ts`: register all collections and globals, localization (`en`, `id`, fallback: `en`).
2. **Deterministic Seeding Script**:
   - `apps/web/scripts/seed-media.ts`:
     Downloads external assets with exact transformation query intact into `public/media/cms/`.
     Reads local files and seeds Media records with stable `sourceKey`.
     Populates `homepage`, `chef`, and `page-media` relationships.
3. **Frontend Media Adapter & Provider Integration**:
   - `apps/web/src/lib/media.ts`: `resolveMedia` helper converting Payload Media into `{ src, alt, width, height }`.
   - Update `apps/web/src/content/provider.ts`: add `getHomepageMedia(locale)`, `getChefMedia(locale)`, `getPageMedia(locale)` via Payload Local API (`overrideAccess: false`).
   - Wire presentation components:
     - `Hero.tsx`, `CuisineCategories.tsx`, `SignatureDishes.tsx`, `SpacePreview.tsx`, `ChefPreview.tsx`.
     - `ChefClient.tsx`, `MenuClient.tsx`, `AboutClient.tsx`, `ExperienceClient.tsx`, `OccasionsClient.tsx`.
     - `EventsClient.tsx`, `EventDetailClient.tsx`, `JournalClient.tsx`, `JournalDetailClient.tsx`.
4. **Automated & Browser Verification**:
   - Run typecheck, build, automated parity test.
   - Run browser subagent for live swap test (Homepage Hero, Chef Portrait) and full route check.
