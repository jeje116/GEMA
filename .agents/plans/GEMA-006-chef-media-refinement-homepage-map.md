# GEMA-006: Chef Media Refinement (Blob & Audio) & Homepage Map Integration

## 1. Overview & Objective
Implement focused refinements for:
1. **Chef Blob Refinement**: Widen the organic blob horizontally by ~25% (usable width ~94.5%), center vertically within the Chef segment, and ensure matching terracotta outline and unclipped portrait framing.
2. **Chef Video Audio Behavior**: Deterministic audio ownership where Chef video becomes primary audio (unmuted) when entering viewport, while background ambience pauses/mutes fully; ambience restores on exit only if user had it active.
3. **Homepage Map Integration**: Replace the placeholder map on homepage (`VisitPreview.tsx`) with the live Google Maps embed used on the Visit page (`VisitClient.tsx`), preserving the Visit page map without regression.

## 2. Workstream 1: Chef Blob Refinement
- **Geometry**:
  Transform approved multi-lobed editorial geometry with `scale_x = 1.24`, `shift_x = -17.0`, `shift_y = 7.0`:
  - Span increases from 152.4 to 189.0 (+24.0% wider).
  - Horizontal bounds in `objectBoundingBox`: min = 0.033, max = 0.978 (center = 0.5055).
  - Vertical bounds in `objectBoundingBox`: min = 0.1305, max = 0.8700 (center = 0.5002).
- **Paths**:
  - `clipPath id="chef-blob-shape2"`:
    `d="M 0.7325,0.2455 C 0.843,0.3 0.95,0.3515 0.9645,0.4135 C 0.978,0.4755 0.8995,0.5475 0.8555,0.6255 C 0.812,0.704 0.8045,0.7885 0.733,0.829 C 0.6625,0.87 0.5285,0.8665 0.4075,0.855 C 0.2875,0.844 0.18,0.8245 0.1175,0.7825 C 0.0535,0.7405 0.033,0.6755 0.0445,0.622 C 0.056,0.5685 0.098,0.5265 0.103,0.4645 C 0.108,0.4025 0.0745,0.3205 0.1175,0.2525 C 0.1595,0.1845 0.277,0.1305 0.3925,0.132 C 0.508,0.1335 0.622,0.1905 0.7325,0.2455 Z"`
  - Decorative outline in `viewBox="0 0 200 200"`:
    `d="M46.5,-50.9C68.6,-40.0,90.0,-29.7,92.9,-17.3C95.6,-4.9,79.9,9.5,71.1,25.1C62.4,40.8,60.9,57.7,46.6,65.8C32.5,74.0,5.7,73.3,-18.5,71.0C-42.5,68.8,-64.0,64.9,-76.5,56.5C-89.3,48.1,-93.4,35.1,-91.1,24.4C-88.8,13.7,-80.4,5.3,-79.4,-7.1C-78.4,-19.5,-85.1,-35.9,-76.5,-49.5C-68.1,-63.1,-44.6,-73.9,-21.5,-73.6C1.6,-73.3,24.4,-61.9,46.5,-50.9Z"`
    with `transform="translate(100 100)"`.
- **Layout & Centering**:
  Container styled with `max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] max-h-[82vh]` and centered vertically via flexbox in `ChefPreview.tsx`.

## 3. Workstream 2: Chef Video Audio Behavior
- **AudioManager additions**:
  - `handleChefEnter()`: pauses background ambience, records `wasPlayingBeforeChef = true` if audio was active.
  - `handleChefExit()`: restores background ambience if `wasPlayingBeforeChef && userIntent === 'enabled'`.
- **ChefPreview playback**:
  - On active: un-mutes video (`muted = false`, `volume = 1.0`) and plays.
  - On inactive: pauses and mutes video.
  - On user intent disabled: mutes video immediately.

## 4. Workstream 3: Homepage Map Segment
- In `apps/web/src/components/home/VisitPreview.tsx`:
  - Replace static placeholder graphics with iframe embed:
    `src="https://maps.google.com/maps?q=Gema+Restaurant+Societiet+Jl+Musi+32+Surabaya&z=16&output=embed"`
  - Retain "Open in Google Maps" external link.
  - Leave `VisitClient.tsx` intact.

## 5. Verification
- Desktop (1440px) & Mobile (390px)
- Chef blob width & vertical centering
- Video unmuted playback & ambience suppression
- Homepage & Visit page maps
- Typecheck & build
