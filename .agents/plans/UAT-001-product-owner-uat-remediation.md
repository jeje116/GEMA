# UAT-001: Product Owner UAT Remediation Plan

Approved: 2026-09-21
Status: IN_PROGRESS

---

## 1. Objective
Resolve concrete Product Owner UAT findings across:
1. **Gateway**: Full-load visibility on every browser document reload/refresh across all public frontend routes, while remaining hidden during client-side navigation within the document lifecycle. Audio preference (`gemaAudioPref`) preserved.
2. **Footer Social**: Remove leading `@` from visible social handles; destination URLs remain from `SiteSettings`.
3. **Menu UI & Media**: Remove all visible Signature indicators (legend, dot, badge); `MenuItem.signature` preserved as dormant/potentially dead; `PageMedia.menu.foodImage` and `beverageImage` verified as authoritative hero media.
4. **Experience Materials**: Extend `PageMedia.experience` with 4 optional image slots (`materialImage01`..`04`) with a transitional presentation fallback to existing color swatches until populated.
5. **Homepage Recognition Removal**: Remove `RecognitionPreview` from Homepage component flow; remove `recognitionIntro` from `Homepage` global schema, draft schema, and version schema.
6. **Journal as Layout Oracle & Shared Editorial Architecture**:
   - Refactor Journal and Recognition into shared components: `EditorialListingPage` and `EditorialDetailPage`.
   - Zero visual drift for Journal.
   - Single main image policy (`coverImage`) with localized `imageCaption` in `<figure>` / `<figcaption>`.
   - Lexical rich text body image insertion blocked.
7. **Recognition Detail & Publication Guard**:
   - Create `/[locale]/recognition/[slug]` dynamic route.
   - Publication-readiness guard on `Recognitions` collection blocking transition to `contentStatus = 'verified'` unless all required editorial fields are valid.
   - Dynamic route access without redeploy. Unverified records return 404.
8. **Committed Database Migration**:
   - Safely update `page_media`, `journal_posts`, `recognitions`, and `homepage` (including version tables) with reversible `down` migration.

---

## 2. In-Scope Files
- `apps/web/src/components/motion/GatewayExperience.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/src/components/menu/MenuClient.tsx`
- `apps/web/src/globals/PageMedia.ts`
- `apps/web/src/components/experience/ExperienceClient.tsx`
- `apps/web/src/app/(frontend)/[locale]/page.tsx`
- `apps/web/src/globals/Homepage.ts`
- `apps/web/src/globals/RecognitionPage.ts`
- `apps/web/src/collections/JournalPosts.ts`
- `apps/web/src/collections/Recognitions.ts`
- `apps/web/src/components/shared/EditorialListingPage.tsx`
- `apps/web/src/components/shared/EditorialDetailPage.tsx`
- `apps/web/src/components/journal/JournalClient.tsx`
- `apps/web/src/components/journal/JournalDetailClient.tsx`
- `apps/web/src/components/recognition/RecognitionClient.tsx`
- `apps/web/src/components/recognition/RecognitionDetailClient.tsx`
- `apps/web/src/app/(frontend)/[locale]/recognition/[slug]/page.tsx`
- `apps/web/src/content/provider.ts`
- `apps/web/src/content/types.ts`
- `apps/web/src/migrations/20260921_add_uat001_editorial_parity.ts`
- `apps/web/src/migrations/index.ts`
- `.agents/TASKS.md`
- `.agents/CONTEXT.md`
- `.agents/DECISIONS.md`

---

## 3. Out-of-Scope
- No changes to Payload Admin routing or global layout (`/admin` remains free of Gateway).
- No deletion of `MenuItem.signature`.
- No promotion of unverified Recognition records to verified.
- No arbitrary/placeholder media generation for Experience materials.
- No changes to audio architecture (`audioManager.ts`, `AudioControl.tsx`).

---

## 4. Verification Contract
- Full-refresh Gateway appears on `/en`, `/en/menu`, `/en/journal`, `/en/recognition`, etc.
- Client navigation preserves entered state.
- Locale switch behaves according to navigation model.
- Footer social handles display without leading `@`.
- Menu renders 0 visible Signature indicators.
- Experience materials render transitional color swatches when images are unpopulated; render CMS images when populated.
- Homepage flow has no Recognition section.
- Journal listing & detail retain pixel-perfect visual parity with oracle.
- Recognition listing & detail use shared editorial components matching Journal.
- Recognition detail resolves without redeploy for new verified records.
- Incomplete Recognition record cannot be saved as `verified`.
- Unverified Recognition detail returns 404.
- Build and typecheck pass with 0 errors.
