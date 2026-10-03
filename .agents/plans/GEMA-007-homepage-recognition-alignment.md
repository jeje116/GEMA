# GEMA-007 — Homepage Recognition Design Alignment

Harmonize the homepage Recognition section (`RecognitionPreview.tsx`) with the approved editorial design established on the full Recognition page (`RecognitionClient.tsx`).

## Scope & Boundaries
- Primary target: `apps/web/src/components/home/RecognitionPreview.tsx`
- Untouched: `RecognitionClient.tsx`, audio, Chef section, Google Maps, reservation flow, navbar, footer, PageReveal timing, CMS, fixtures.

## Key Directives
1. **Row Navigation**: All homepage recognition rows navigate internally to `/${locale}/recognition`. Do NOT open `externalUrl` directly from the homepage.
2. **Item Count**: Exactly 3 items (`recognitions.slice(0, 3)`).
3. **Header**: Minimal editorial header.
   - Section heading: `home.recognition.title` (`Recognition` / `Pengakuan`).
   - View Archive CTA: `home.recognition.cta` (`View Archive` / `Lihat Arsip`) linking to `/${locale}/recognition` with inline SVG arrow that shifts on hover.
   - Do NOT add new unapproved kickers (`GEMA Honors`) or paragraph subtitles.
4. **Design Parity & Visual Hierarchy**:
   - Container width: `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`.
   - Top and bottom dividers: `border-t border-[var(--ivory-200)]` on list container, `border-b border-[var(--ivory-200)]` on each row.
   - Year column: `font-condensed tracking-widest text-xs md:text-sm text-[var(--muted)] w-full md:w-28 lg:w-32 flex-shrink-0`.
   - Title: `font-serif text-2xl sm:text-2xl md:text-3xl text-[var(--espresso-900)] leading-snug mb-1.5 md:mb-2 transition-colors duration-300 ease-out group-hover:text-[var(--terracotta)] group-focus-visible:text-[var(--terracotta)]`.
   - Metadata: `rec.awardingBody` + conditional `rec.scope` (`Chef` / `Restaurant`) only if defined.
   - Interactive arrow: SVG arrow in resting inset `right-[20px] md:right-[28px]`, hover/focus inset `group-hover:right-[12px] md:group-hover:right-[16px]`, color transition to terracotta.
   - Row interaction: `-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-8 py-7 md:py-9`, `hover:bg-[var(--ivory-100)]/80`, `focus-visible:ring-1 focus-visible:ring-[var(--terracotta)]`.
5. **Motion**: Subtle row reveal, text shift `md:group-hover:translate-x-1`, arrow translation. Respect `prefers-reduced-motion` via `useReducedMotionSafe()`.

## Verification Plan
1. `npm run typecheck` in `apps/web`
2. `npm run build` in `apps/web`
3. Browser verification on desktop (1440px) and mobile (390px)
4. Interaction verification (resting vs hover arrow positions, link destinations)
