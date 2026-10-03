# BUG-001: Runtime Issue Diagnosis + Homepage Post-Gateway Scroll Reset

Version: 1.1
Status: VERIFIED / PASS
Approved by: Product Owner

## 1. Empirical Diagnostic Findings (Captured Before Source Modification)

### Bug A: Next.js Development "1 Issue" Badge
- **Observed Indicator**: Next.js development overlay showed `"1 Issue"` badge on `https://localhost:3002/en`.
- **Exact Error Title**: `Console Error Server`
- **Exact Error Message**: `[CMS Media Error] Missing or invalid Payload Media relation: 32`
- **Exact Stack Trace**:
  ```
  resolveMedia src/lib/media.ts (26:15)
  <anonymous> src/content/provider.ts (849:50)
  Array.map <anonymous>
  Object.getJournalEntries src/content/provider.ts (819:25)
  Promise.all <anonymous>
  HomePage src/app/(frontend)/[locale]/page.tsx (54:71)
  HomePage <anonymous>
  ```
- **Owning Component / Source Files**:
  - `src/lib/media.ts`
  - `src/content/provider.ts` (`getJournalEntries`)
  - `src/app/(frontend)/[locale]/page.tsx` (`HomePage`)
- **Trigger**: Server-side rendering (SSR) of `HomePage` on `/en` and `/id` calls `contentProvider.getJournalEntries(locale)`.
- **Root Cause**:
  - Legacy Lexical content in post *"Inside GEMA's Fresh Pasta"* contained an upload node whose value was raw ID `32`.
  - In `getJournalEntries`, an `else if (blockType === 'upload')` branch attempted to transform it into an image block, passing raw ID `32` to `resolveMedia(32)`.
  - `resolveMedia` emitted `console.error('[CMS Media Error] Missing or invalid Payload Media relation: 32')`, which Next.js 16 surfaced as `"1 Issue"`.
- **Lexical Content Audit**:
  - Journal posts examined: 3
  - Posts with legacy upload nodes: 1 (`inside-gemas-fresh-pasta`, 2 nodes: 1 EN, 1 ID, referencing media ID `32`)
  - Recognitions examined: 6 (0 upload nodes found)

### Bug B: Homepage Post-Gateway Scroll Position
- **Observed Behavior (Pre-remediation)**:
  - Fresh Load (`/en`): `window.scrollY === 0`.
  - Previously Scrolled (`/en`, scrolled to 1200px -> refresh -> enter):
    - While Gateway was visible: `window.scrollY === 1200`.
    - After Gateway exited: `window.scrollY === 1200`.
  - Previously Scrolled (`/id`, scrolled to 1200px -> refresh -> enter):
    - While Gateway was visible: `window.scrollY === 1239`.
    - After Gateway exited: `window.scrollY === 1239`.
- **Root Cause**:
  - Browser native `history.scrollRestoration = 'auto'` restored scroll position beneath the Gateway overlay on reload.
  - `GatewayExperience` locked body overflow (`overflow = 'hidden'`) but did not normalize scroll to 0.
  - `main.focus()` was called without `{ preventScroll: true }`.

---

## 2. Remediation Applied

1. **Editorial Parity & Content Transformation**:
   - In `apps/web/src/content/provider.ts`: removed upload block transformation in `getJournalEntries`. Legacy upload nodes are treated as non-rendering content; text surrounding them continues to render normally. Preserves single-main-image editorial policy across Journal and Recognition.
2. **`resolveMedia` Hardening**:
   - In `apps/web/src/lib/media.ts`: `null / undefined` handled cleanly as empty media (no error, no warning). Malformed non-null relations emit `console.warn` in development instead of breaking Server Component SSR with `console.error`.
3. **Gateway Scroll Normalization**:
   - In `apps/web/src/components/motion/GatewayExperience.tsx`: scoped strictly to Homepage (`/en`, `/id`):
     - Temporarily sets `history.scrollRestoration = 'manual'` during Gateway display and normalizes scroll to 0.
     - Re-normalizes scroll to 0 upon `handleEnter()` before Gateway exits.
     - Uses `main.focus({ preventScroll: true })`.
     - Safely restores prior `scrollRestoration` value upon exit/cleanup.

---

## 3. Empirical Verification Results

- **Next.js Dev Issue Badge**:
  - `/en`: 0 Issues (Clean)
  - `/id`: 0 Issues (Clean)
- **Journal Editorial Parity (`inside-gemas-fresh-pasta`)**:
  - Total article images: 1 (main coverImage: `journal-fresh-pasta.jpg`)
  - Body embedded images: 0
  - Legacy media ID 32 public image: NOT RENDERED
  - Text surrounding upload node: PRESERVED (3 paragraphs)
  - Broken images: 0
- **Homepage Scroll Normalization**:
  - Fresh load: Gateway visible = 0, Exit = 0 (EN & ID)
  - Previously scrolled reload (1200px -> reload -> enter):
    - Gateway visible EN scrollY: 0
    - Gateway exit EN scrollY: 0
    - Gateway visible ID scrollY: 0
    - Gateway exit ID scrollY: 0
  - Mobile (390×844) previously scrolled reload:
    - Gateway visible scrollY: 0
    - Gateway exit scrollY: 0
  - Visible scroll jump: NONE
- **Non-Homepage & SPA Navigation Regression**:
  - Menu, Journal, Recognition scroll preserved
  - SPA navigation (Home -> Menu -> Home): Gateway does NOT reopen
- **ResDiary QA**:
  - Full inline interactive widget: PASS
  - Visible broken images: 0
  - Open / Close / Reopen: PASS
  - Production booking submitted: NO
- **Code QA**:
  - `npm run typecheck`: PASS
  - `npm run build`: PASS (47/47 pages generated)
