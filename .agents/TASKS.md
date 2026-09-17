# GEMA Task Registry

Status values:

- TODO
- PLANNING
- AWAITING_APPROVAL
- APPROVED
- IN_PROGRESS
- QA
- BLOCKED
- DONE
- CANCELLED

| ID | Task | Status | Approved Plan | Notes |
|---|---|---|---|---|
| GEMA-001 | Existing Application Baseline Audit | DONE | N/A | Completed read-only baseline audit of existing Google AI Studio prototype |
| GEMA-002 | Runnable Baseline & Prototype Stabilization | DONE | .agents/plans/GEMA-002-runnable-baseline-stabilization.md | Environment restored, 8 consumer defects repaired, build + runtime verified |
| GEMA-003A | GitHub Repo Init & Project Migration Baseline | DONE | N/A | Initialized Git at workspace root, created .gitignore, committed baseline, configured remote https://github.com/jeje116/GEMA.git, pushed main |
| GEMA-003 | Next.js Migration Baseline Implementation | DONE | .agents/plans/GEMA-003-nextjs-migration-baseline.md | Reconcile Source A & B, build Next.js 16.3.3 App Router in apps/web, preserve GEMA-002 repairs, 38/38 QA tests passed |
| GEMA-004A | Homepage Brand, Chef Video & Backsound Integration | DONE | .agents/plans/GEMA-004A-homepage-brand-chef-video-backsound-integration.md | Light brand logo integrated, chef video staging manifest/blob treatment applied, real backsound integrated with route continuity |
| GEMA-004B | Homepage Audio Choreography, Brand Scale & Chef Media Refinement | DONE | .agents/plans/GEMA-004B-homepage-audio-choreography-brand-scale-chef-refinement.md | Audio ducking, user intent preservation, hysteresis IntersectionObserver, navbar logo scale, multi-lobed organic blob verified |
| GEMA-004C | Audio Regression, Header Theme Fix, Transition Brand Scale, Chef Video Staging, Google Maps & Direct WhatsApp Reservation | DONE | .agents/plans/GEMA-004C-audio-regression-header-transition-video-maps-whatsapp.md | Audio reliability, Experience navbar contrast, transition logo scale, chef video staging, Google Maps embed, direct WhatsApp CTAs verified |
| GEMA-004D | Chef Blob #2, Gateway Audio Reliability, Reservation-to-WhatsApp Flow, Real Google Maps Embed | DONE | .agents/plans/GEMA-004D-chef-blob-audio-reservation-maps.md | Blobmaker Shape #2, sessionStorage audio intent, interactive WhatsApp reservation overlay, and zero-key Google Maps embed verified |

Rules:

- Do not invent tasks merely to populate the table.
- Add tasks only when they actually exist.
- Material implementation tasks should reference their persisted plan.
- Do not mark a material task DONE until required QA completes.
