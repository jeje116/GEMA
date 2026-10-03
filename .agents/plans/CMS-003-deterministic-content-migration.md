# GEMA CMS-003A: Deterministic Content Migration + Direct Payload Content Ownership (Approved Execution Contract)

## 1. Executive Summary
CMS-003A transitions approved textual and structured content for Menu (20 categories, 118 items), Journal (3 articles), Events (6 events), Homepage editorial copy, Chef editorial copy, Navigation, and Site Settings from static fixtures/translations into Payload CMS, establishing Payload Local API as the exclusive runtime source of truth.

All data integrity corrections mandated by CMS-003A have been incorporated:
- **Menu Taxonomy (Rule 2 & 3)**: Exactly 20 categories (11 Food, 9 Beverage) matching fixture IDs and titles 1:1. No inferred categories (no wines, spirits, coffee-tea).
- **Menu Items (Rule 4, 5, 6)**: Exactly 118 items (71 Food, 47 Beverage) seeded with character-level parity. `MenuItems` collection includes internal immutable `sourceKey` derived deterministically from fixture `id` (`item.id -> sourceKey`). No `menu-items.slug`.
- **Event Integrity (Rule 7, 8, 9)**: Exactly 6 events (`private-table-series`, `seasonal-tasting`, `sunday-society`, `an-evening-of-fresh-pasta`, `fire-and-flour`, `a-table-for-two`). Exact fixture timestamps seeded without artificial status manipulation. Timezone parity preserved.
- **Journal Parity (Rule 10, 11)**: Deterministic Lexical richText AST transformation for 3 articles with block-level structure, sequence, and media parity.
- **Menu Page Global (Rule 12, 13)**: Dedicated minimal Phase-1 Global `menu-page` for page-level editorial copy (`title`, `philosophy`, `taxServiceFootnote`). Exact tax & service wording preserved. `page-media` remains media-only.
- **Homepage Schema Audit (Rule 15, 16, 17)**: Complete audit of all editorial consumers (`Hero`, `Positioning`, `SignatureDishes`, `Space`, `ChefPreview`, `EventsIntro`, `JournalIntro`, `Visit`). Generic section titles vs factual claims separated. Reviews strictly on HOLD (unseeded).
- **Chef Editorial (Rule 18)**: Exact source migration for `name`, `role`, `biography`, `quote`, `ctaLabel`.
- **Navigation (Rule 19)**: Exact Header and Footer link definitions, destinations, orders, and localized labels.
- **Site Settings (Rule 20, 21, 22)**: Preserved operational facts with ADR-006 provenance. Unsupported opening hours and takeaway remain absent. `services` implemented as array/multiselect with default `['dine-in']`. Admin-only write access on sensitive operational fields.
- **Media Consolidation (Rule 23, 24)**: Existing 35 unique media records consolidated into direct domain document relationships. Temporary mappings retained until domain parity and runtime switch pass.
- **Domain-by-Domain Sequence (Rule 25, 26)**: Strict sequence (Menu -> Journal -> Events -> Chef -> Homepage -> Navigation -> Site Settings) with Stop-on-Domain-Failure rule.
- **Zero Fixture Fallbacks (Rule 30, 32, 34)**: Payload Local API (`overrideAccess: false`) is the sole runtime source; fixtures remain only as `SEED_SOURCE`, `ROLLBACK_ORACLE`, `TEST_REFERENCE`.

---

## 2. Complete Homepage & Menu Editorial Audit (Rule 15)

| Section / Key | String Content (EN / ID) | Classification | Destination |
|---|---|---|---|
| `home.hero.kicker` | "GEMA RESTAURANT & SOCIETIET" | CMS_EDITORIAL | `Homepage.hero.kicker` |
| `home.hero.headline` | "The Gateway to Taste" / "Gerbang Menuju Rasa" | CMS_EDITORIAL | `Homepage.hero.headline` |
| `home.hero.support` | "Italian classics, served with a touch of art." / "Klasik Italia..." | CMS_EDITORIAL | `Homepage.hero.support` |
| `home.hero.location` | "Surabaya, Indonesia" | CMS_EDITORIAL | `Homepage.hero.location` |
| `home.hero.cta.primary` | "Reserve a Table" / "Pesan Meja" | CMS_EDITORIAL | `Homepage.hero.ctaPrimary` |
| `home.hero.cta.secondary` | "Explore the Menu" / "Jelajahi Menu" | CMS_EDITORIAL | `Homepage.hero.ctaSecondary` |
| `home.positioning.text` | "A deep respect for ingredients..." | CMS_EDITORIAL | `Homepage.positioning.text` |
| `home.positioning.dietary` | "No Pork, No Lard" / "Tanpa Babi, Tanpa Lemak Babi" | CMS_EDITORIAL (ADR-006) | `Homepage.positioning.dietary` |
| `home.signature.title` | "Signature Dishes" / "Hidangan Khas" | CMS_EDITORIAL | `Homepage.signatureDishes.title` |
| `home.space.title` | "The Space" / "Ruang" | CMS_EDITORIAL | `Homepage.space.title` |
| `home.space.text` | "Where warm ivory meets lush greenery..." | CMS_EDITORIAL | `Homepage.space.text` |
| `home.space.cta` | "Discover the Experience" / "Temukan Pengalaman" | CMS_EDITORIAL | `Homepage.space.ctaLabel` |
| `home.chef.text` | "More than 20 years cooking across the world..." | CMS_EDITORIAL | `Chef.biographyPreview` or `Homepage.chefPreview.text` |
| `home.chef.cta` | "Meet Chef Mandif" / "Kenali Chef Mandif" | CMS_EDITORIAL | `Chef.ctaLabel` or `Homepage.chefPreview.ctaLabel` |
| `home.recognition.title` | "Recognition" / "Pengakuan" | CMS_EDITORIAL (Generic Title Only) | `Homepage.recognitionIntro.title` |
| `home.recognition.cta` | "View Archive" / "Lihat Arsip" | CMS_EDITORIAL (Generic CTA Only) | `Homepage.recognitionIntro.ctaLabel` |
| `home.events.now` | "Happening Now" / "Sedang Berlangsung" | CODE_UI | Retained in `translations.ts` |
| `home.events.upcoming` | "Upcoming at GEMA" / "Akan Datang di GEMA" | CODE_UI | Retained in `translations.ts` |
| `home.events.cta` | "View All Events" / "Lihat Semua Acara" | CMS_EDITORIAL | `Homepage.eventsIntro.ctaLabel` |
| `home.reviews.title` | "Selected guest words" | GOVERNANCE_HOLD | Unseeded / non-public |
| `home.reviews.note` | "Concept content" | GOVERNANCE_HOLD | Unseeded / non-public |
| `home.journal.title` | "Latest from GEMA" / "Terbaru dari GEMA" | CMS_EDITORIAL | `Homepage.journalIntro.title` |
| `home.journal.cta` | "Read All Journal Entries" / "Baca Semua Jurnal" | CMS_EDITORIAL | `Homepage.journalIntro.ctaLabel` |
| `menu.title` | "The Menu" / "Menu" | CMS_EDITORIAL | `MenuPage.title` |
| `menu.philosophy` | "Honest ingredients, prepared with precision and a touch of art." | CMS_EDITORIAL | `MenuPage.philosophy` |
| `menu.taxService` | "All prices are subject to 10% government tax and 10% service charges." | CMS_EDITORIAL | `MenuPage.taxServiceFootnote` |
| `menu.featured` / `menu.signature` / `menu.type.*` / `menu.sections` | UI filter controls | CODE_UI | Retained in `translations.ts` |

---

## 3. Implementation Sequence & Execution Details

### Domain 1: Menu
1. **Schema Updates**:
   - `apps/web/src/collections/MenuItems.ts`: Add `sourceKey` (`type: 'text'`, `unique: true`, `index: true`, `admin: { readOnly: true }`).
   - `apps/web/src/globals/MenuPage.ts` [NEW]: `title`, `philosophy`, `taxServiceFootnote` (localized). Register in `payload.config.ts`.
2. **Seed Script (`scripts/seed-menu.ts`)**:
   - Read `fixtures/menu.ts`.
   - Seed 20 categories (11 Food, 9 Beverage) using fixture IDs as slugs.
   - Seed 118 menu items (71 Food, 47 Beverage) using `sourceKey = item.id`.
   - Consolidate signature dish media: `woodfire-carne-1`, `dolci-1`, `pizzetta-1`, `pizzetta-2` -> `MenuItem.image`.
   - Seed `menu-page` Global (`title`, `philosophy`, `taxServiceFootnote`).
3. **Parity & Switch**:
   - Verify counts: 20 categories, 118 items, exact food/beverage counts and titles.
   - Update `provider.ts`: `getMenuCategories` and `getMenuItems` to query Payload Local API.
   - Update `MenuClient.tsx` to read `MenuPage` global.
   - Typecheck, browser QA, direct CMS edit test.

### Domain 2: Journal
1. **Seed Script (`scripts/seed-journal.ts`)**:
   - Read `fixtures/journal.ts`.
   - Seed 3 articles (`inside-gemas-fresh-pasta`, `from-dough-to-fire`, `a-table-for-two`) with deterministic Lexical JSON AST conversion.
   - Consolidate cover and body media relations.
2. **Parity & Switch**:
   - Verify 3 articles, block counts, block sequence, text parity.
   - Update `provider.ts`: `getJournalEntries`, `getJournalEntryBySlug` to Payload Local API.
   - Typecheck, browser QA, direct CMS edit test (draft vs published).

### Domain 3: Events
1. **Seed Script (`scripts/seed-events.ts`)**:
   - Read `fixtures/events.ts`.
   - Seed 6 events (`private-table-series`, `seasonal-tasting`, `sunday-society`, `an-evening-of-fresh-pasta`, `fire-and-flour`, `a-table-for-two`) with exact fixture timestamps (no artificial status manipulation).
   - Consolidate `coverImage` media relations.
2. **Parity & Switch**:
   - Print source slugs vs payload slugs (must match 1:1).
   - Update `provider.ts`: `getEvents`, `getEventBySlug` to Payload Local API.
   - Typecheck, browser QA, direct CMS edit test.

### Domain 4: Chef Editorial
1. **Seed Script (`scripts/seed-chef.ts`)**:
   - Seed `name`, `role`, `biography`, `quote`, `ctaLabel` into `Chef` Global across `en` and `id` locales.
2. **Parity & Switch**:
   - Update `ChefPreview.tsx` and `ChefClient.tsx` to read from Payload `Chef` Global.
   - Typecheck, browser QA, direct CMS edit test.

### Domain 5: Homepage Editorial
1. **Schema Updates (`apps/web/src/globals/Homepage.ts`)**:
   - Add fields for audited editorial copy (`positioning`, `signatureDishes`, `recognitionIntro`, `eventsIntro`, `journalIntro`, `visitIntro`).
2. **Seed Script (`scripts/seed-homepage.ts`)**:
   - Seed all audited editorial copy across `en` and `id` locales.
3. **Parity & Switch**:
   - Update homepage components (`Hero`, `Positioning`, `SignatureDishes`, `SpacePreview`, `RecognitionPreview`, `EventsPreview`, `JournalPreview`, `VisitPreview`) to read from Payload `Homepage` Global.
   - Typecheck, browser QA, direct CMS edit test.

### Domain 6: Navigation Global
1. **Seed Script (`scripts/seed-navigation.ts`)**:
   - Seed header and footer link definitions, destinations, and localized labels.
2. **Parity & Switch**:
   - Update `SiteHeader.tsx` and `SiteFooter.tsx` to read from Payload `Navigation` Global.
   - Typecheck, browser QA, direct CMS edit test.

### Domain 7: Site Settings Global
1. **Schema Updates (`apps/web/src/globals/SiteSettings.ts`)**:
   - Add `entitySubtitle`, `whatsapp`, `tiktok`, `services` (array with default `['dine-in']`).
   - Restrict updates with `isAdmin`.
2. **Seed Script (`scripts/seed-site-settings.ts`)**:
   - Seed ADR-006 operational facts. Unsupported opening hours and takeaway remain absent.
3. **Parity & Switch**:
   - Update `SiteFooter.tsx` and `VisitPreview.tsx` to read from Payload `SiteSettings` Global.
   - Typecheck, browser QA, direct CMS edit test.

---

## 4. Final Verification, Migration & Governance
1. Run master parity check: `scripts/test-cms-003-parity.ts`.
2. Generate committed Payload/Drizzle migrations.
3. Scan codebase for active runtime imports of fixtures (ensure they are only `SEED_SOURCE`, `TEST_REFERENCE`, or `ROLLBACK_ORACLE`).
4. Full typecheck and Next.js build.
5. Compile comprehensive CMS-003 execution report.
