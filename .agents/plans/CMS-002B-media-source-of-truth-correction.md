# CMS-002B: Final Media Source-of-Truth Correction Implementation Contract

## 1. Objective
Establish Payload CMS as the exclusive runtime source of truth for all 40 active content media slots (39 photo slots, 1 video slot) across the public website. Remove all runtime fallback references to static photographic/video assets in components, adapters, and providers, ensuring that missing CMS media relations fail loudly in development and render controlled neutral states in production without silently displaying old static assets.

## 2. Scope & Blast Radius
- **In-Scope Behavior**:
  - `src/lib/media.ts`: Update `resolveMedia` and `resolveVideo` to normalize Payload Media relations only; remove fallback parameters; add development error logging.
  - `src/components/media/ResponsiveImage.tsx`: Controlled non-editorial placeholder rendering when `src` is missing; loud development warning.
  - `src/content/provider.ts`: Strip all fallback expressions (`|| entry.coverImage`, `|| event.coverImage`, `|| cat.image`, `|| evt.image`, `|| rawMenuItems...`) from content provider methods (`getJournalEntries`, `getEvents`, `getMenuItems`, `getOccasionCategories`, `getPastBrandEvents`).
  - Frontend visual components: Remove all runtime imports of `homeAssets` and `menuAssets` and all `|| staticPath` fallbacks:
    - `src/components/home/Hero.tsx`
    - `src/components/home/CuisineCategories.tsx`
    - `src/components/home/SignatureDishes.tsx`
    - `src/components/home/SpacePreview.tsx`
    - `src/components/home/ChefPreview.tsx`
    - `src/components/chef/ChefClient.tsx`
    - `src/components/menu/MenuClient.tsx`
    - `src/components/about/AboutClient.tsx`
    - `src/components/experience/ExperienceClient.tsx`
    - `src/components/occasions/OccasionsClient.tsx`
- **Out-of-Scope / Untouched**:
  - Original static asset files in `public/media/` remain untouched as rollback/oracle baselines.
  - Fixture files (`src/content/fixtures/*.ts`) and static asset registries (`src/content/media/*.ts`) remain untouched on disk as migration/oracle artifacts.
  - System assets (`/media/brand/...` logos and `/media/audio/...`) remain code-owned.
  - No public website redesign, no layout changes, no visual regressions.
- **Dependencies**: No new dependencies.

## 3. Implementation Steps
1. **Media Adapter Normalization (`src/lib/media.ts`)**:
   - Refactor `resolveMedia(media: any, context?: string)` to accept only Payload Media.
   - Refactor `resolveVideo(videoMedia: any, posterMedia: any, context?: string)`.
   - In development mode, log `[CMS Media Error]` when a required relation is null or missing.
2. **Safe Component Fallback & Placeholder (`src/components/media/ResponsiveImage.tsx`)**:
   - Gracefully handle empty `src` by rendering layout-stable neutral placeholder container `bg-[var(--ivory-200)]` without attempting image network request.
   - Log development warning when `src` is empty.
3. **Content Provider Decoupling (`src/content/provider.ts`)**:
   - In `getJournalEntries`: map `coverImage` strictly from `pageMedia.journal`; map body image blocks strictly from `pageMedia.journal`.
   - In `getEvents`: map `coverImage` strictly from `pageMedia.events`.
   - In `getMenuItems`: map signature `image` strictly from `hpMedia.signatureDishMedia`.
   - In `getOccasionCategories`: map category `image` strictly from `pageMedia.occasions`.
   - In `getPastBrandEvents`: map brand event `image` strictly from `pageMedia.occasions`.
4. **Component Fallback Removal**:
   - `Hero.tsx`: Remove `homeAssets` import; bind `heroSrc` and `heroAlt` strictly to `media`.
   - `CuisineCategories.tsx`: Remove `homeAssets` import; define category metadata fixture locally without image paths; match CMS items case-insensitively; bind images strictly to `categoriesMedia`.
   - `SignatureDishes.tsx`: Remove `homeAssets`, `authenticSignatureImages`, `demoImages`; bind dish images strictly to `signatureMediaMap`.
   - `SpacePreview.tsx`: Remove `homeAssets` import; bind `indoorSrc`, `patioSrc` strictly to `spaceMedia`.
   - `ChefPreview.tsx`: Remove `homeAssets` import; bind `videoSrc`, `videoPoster` strictly to `chefMedia.video`; fix `videoRef` check.
   - `ChefClient.tsx`: Bind `portraitSrc`, `portraitAlt` strictly to `chefMedia.portrait`.
   - `MenuClient.tsx`: Remove `menuAssets` import; bind `foodImage`, `beverageImage` strictly to `pageMedia.menu`.
   - `AboutClient.tsx`: Bind `originImage`, `philosophyImage`, `architectureImage` strictly to `pageMedia.about`.
   - `ExperienceClient.tsx`: Bind `heroImage`, `morningImage`, `eveningImage`, `detailsImage` strictly to `pageMedia.experience`.
   - `OccasionsClient.tsx`: Bind `heroImage` strictly to `pageMedia.occasions`.
5. **Static Media Reference Audit**:
   - Complete static references scan across `apps/web/src` and classify every occurrence into `SYSTEM_ASSET`, `ROLLBACK_ORACLE`, `MIGRATION_MANIFEST`, `TEST_REFERENCE`, or `DEAD_CODE`.
   - Confirm ZERO `ACTIVE_CONTENT_RUNTIME` references remain.
6. **Empirical Verification**:
   - Automated test suite: Missing relation test script (`scripts/test-cms-missing-media.ts`) to verify controlled error behavior without static image appearance.
   - Live edit verification: Homepage Hero and Chef Portrait swap tests.
   - Full browser smoke test across all 9 primary routes and detail routes.
   - Typecheck (`tsc --noEmit`) and production build (`next build`).
