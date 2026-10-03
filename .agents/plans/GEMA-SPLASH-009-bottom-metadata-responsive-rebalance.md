# Implementation Plan: GEMA-SPLASH-009 Bottom Metadata Responsive Rebalance

## Objective
Refine the bottom metadata area of the splash screen so that the bottom-right text block (`A TASTE OF ITALY ALWAYS`) never collides with or is visually crossed by the decorative gold line in the background video/poster. Update the bottom-left copy from "EST. 2020" to "EST. 2026".

## Critical Invariants & Constraints
- **NO Background Modification**: Strictly do NOT modify, redraw, hide, fake, or reposition the background decorative line on the right side; it is intrinsic to the video/poster assets. The fix is achieved solely by repositioning the DOM metadata text blocks.
- **Copy Invariants**:
  - Bottom-left: "EST. 2026" (updated from "EST. 2020").
  - Bottom-right: "A TASTE" / "OF ITALY" / "ALWAYS" (strictly unchanged).
  - Screen reader & DOM landmarks: Update "EST. 2020" to "EST. 2026".
- **Visual Composition**:
  - Left and right metadata must share a visually harmonious baseline relationship as one unified system.
  - Generous intentional breathing room between text and background decorative lines / corner foliage.
  - Zero collision between bottom metadata and the Welcome group / decorative accent hairline above.
  - Fullscreen media cover-crop and responsive content architecture preserved.
  - Zero CMS modifications; zero changes to other site pages.

## Layout Analysis & Mathematical Geometry

### 1. Background Video Decorative Line Positions
- **Desktop (16:9 media / `splash-screen-desktop.mp4`)**:
  - The decorative gold horizontal baseline sits at **4.81% to 4.86%** from the bottom edge (~35px on 720p, ~37px on 768p, ~43px on 900p, ~52px on 1080p).
  - Previous bottom metadata position was `bottom-[4.5%]` (~32px on 720p, ~48px on 1080p), which caused the bottom text line ("ALWAYS") to directly intersect or fall underneath the decorative line.
  - Elevating bottom metadata to `bottom-[6.8%]` to `bottom-[7.2%]` (e.g. `bottom: clamp(3.2rem, 6.8%, 4.5rem)`) places the bottom of "ALWAYS" at ~49px on 720p, ~55px on 768p, ~65px on 900p, ~78px on 1080p, providing **14px to 26px of clean vertical breathing room** above the line.
  - To maintain comfortable negative space between the Welcome group and the elevated bottom metadata, the Desktop Welcome group (`welcome`, `good-food`, `accent`) is shifted upward slightly:
    - `welcome`: `top-[73.5%]` (from `75.5%`)
    - `good-food`: `top-[81.5%]` (from `84.5%`)
    - `accent`: `top-[84.5%]` (from `88%`)
    - This provides ~50px to 80px clearance between the accent hairline and the metadata top edge.

### 2. Mobile Responsive Bands & Aspect Ratio Overrides
- **Mobile Background Line (9:16 media / `splash-screen-mobile.mp4`)**:
  - The decorative horizontal baseline sits at **~3.0%** from the bottom edge (~21px on 700h, ~24px on 800h, ~28px on 932h).
- **Responsive Bands**:
  - **Band A (Mobile Small / Normal: 360px <= width < 430px)**:
    - Standard mobile layout.
    - Bottom padding: `clamp(3.2rem, 7.5dvh, 4.2rem)` (~54px - 68px).
    - Horizontal padding: `clamp(1.8rem, 7dvw, 2.8rem)`.
    - Clearance above background line: **~30px to 45px**.
  - **Band B (Mobile Wide / Short-Wide: 430px <= width < 768px)**:
    - When mobile viewport width reaches 430px–540px, the 9:16 background video is cropped vertically by `object-fit: cover`, which draws the right-side decorative arch and foliage closer toward the center.
    - Bottom padding is increased to `clamp(4.2rem, 9.5dvh, 5.2rem)` (~72px - 85px).
    - Right padding is increased to `clamp(2.4rem, 8.5dvw, 3.4rem)`.
    - Left padding is proportionally matched for system balance.
  - **Band C & D (Tablet & Desktop: width >= 768px)**:
    - Desktop-style layout inside aspect container or full viewport.
    - Bottom position: `bottom: clamp(3.2rem, 6.8%, 4.5rem)`.
    - Left & right insets: `5.5%` to maintain generous margin from sides.
  - **Override 1 (Short / Wide Mobile: width >= 430px AND aspect ratio >= 0.56)**:
    - In short-wide mobile viewports (e.g. 430x760 with aspect ratio 0.566, 480x800 with aspect ratio 0.60), vertical space is compressed while cover crop zooms in.
    - Handled cleanly via responsive styling / dynamic viewport detection ensuring `paddingBottom` is at least 4.5rem (~72px) and right inset has extra breathing room.
  - **Override 2 (Short Desktop: width >= 1280px AND height <= 800px)**:
    - In short desktop viewports (e.g. 1280x720, 1366x768), raise bottom metadata slightly higher (`bottom: clamp(3.4rem, 7.2%, 4.5rem)` or CSS media query `@media (min-width: 1280px) and (max-height: 800px)`).

## Files to Modify
- `apps/web/src/components/motion/GatewayExperience.tsx`:
  - Update `EST. 2020` -> `EST. 2026` across sr-only landmark, desktop overlay, mobile overlay, and comments.
  - Refine Desktop overlay:
    - Welcome group vertical positioning (`top-[73.5%]`, `top-[81.5%]`, `top-[84.5%]`).
    - Bottom metadata positioning (`bottom-[6.8%]` with short-desktop query / responsive clamp, `left-[5.5%]`, `right-[5.5%]`).
  - Refine Mobile overlay:
    - Apply Band A, Band B, and Override 1 responsive padding logic for bottom metadata.
    - Ensure visual harmony and clearance.

## Files to Create
- `apps/web/scripts/qa-splash-009.cjs`: Comprehensive empirical verification script testing all 17 target viewports, computing bounding boxes, clearances, verifying copy "EST. 2026", and capturing debug screenshots.

## Verification Matrix (17 Viewports)
- Mobile Small / Normal:
  - 360x800
  - 375x812
  - 390x700
  - 390x780
  - 390x844
  - 390x900
  - 402x874
  - 412x915
- Mobile Wide / Short-Wide:
  - 430x760 (Override 1)
  - 430x850
  - 430x932
  - 480x800 (Override 1)
  - 540x960 (Override 1)
- Desktop / Short Desktop:
  - 1280x720 (Override 2)
  - 1366x768 (Override 2)
  - 1440x900
  - 1920x1080

## Verification Contract
1. Copy check: `EST. 2026` is present in DOM; `EST. 2020` is absent.
2. Bottom clearance check: Bottom-right text block ("ALWAYS") has positive clearance above the decorative line across all 17 viewports.
3. Top clearance check: No collision between bottom metadata and Welcome group / accent hairline.
4. Visual balance: Left ("EST. 2026") and right ("A TASTE OF ITALY ALWAYS") sit along a harmonious shared baseline.
5. Code QA: `npm run typecheck` and `npm run build` pass cleanly.
