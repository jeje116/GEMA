# GEMA — Decisions

This file contains APPROVED and LOCKED project decisions.

Do not change an existing LOCKED decision without explicit user approval.

Use ADR identifiers for durable decisions.


---

# ADR-001 — Google AI Studio Frontend Is the Visual Baseline

Status:

LOCKED

Decision:

The existing frontend generated from Google AI Studio is the starting visual specification for GEMA.

Implications:

- Do not independently redesign approved pages.
- Preserve visual hierarchy.
- Preserve navigation semantics.
- Preserve intended responsive behavior.
- Backend convenience is not sufficient reason to change frontend UX.
- Material visual changes require explicit approval.


---

# ADR-002 — Human-Governed Agentic Development

Status:

LOCKED

Decision:

GEMA uses human-governed agentic development.

The user retains authority over:

- product behavior,
- architecture,
- material UX changes,
- business logic,
- API contracts,
- database structure,
- security model,
- material implementation scope.

The coding agent may analyze, plan, implement approved scope, test, debug, and document.

Discussion is not execution authorization.


---

# ADR-003 — Prefer Small, Robust, Reversible Changes

Status:

LOCKED

Decision:

When multiple implementations satisfy the approved requirement, prefer the approach with:

- smaller blast radius,
- higher reversibility,
- fewer dependencies,
- lower operational complexity,
- better testability,
- adequate maintainability.

Do not optimize prematurely for hypothetical scale.


---

# ADR-004 — Official Menu Authority & Editorial Normalization Policy

Status:

LOCKED

Decision:

PDF source documents are authoritative for menu substance, items, categories, pricing, portions, and variants.

Obvious source-document typographical errors may be normalized for public website copy without changing meaning (e.g., Stracciatella, Pomodorini, Basilico Verde, Chantilly, focaccia, government).

Implications:

- Meaning, pricing, and ingredient identity must remain unchanged.
- Transcription errors introduced during integration must be corrected to match authoritative source (e.g., Patatine).
- Intended source diacritics should be preserved (e.g., Ragù di Manzo, Béchamel).
- PDF icons without verified semantic legend remain unmapped.


---

# ADR-005 — Menu Authentic Media Policy

Status:

LOCKED

Decision:

The Menu page uses photography only for orientation and atmosphere, not as a dish-by-dish catalog.

Implications:

- Keep the menu page text-first, editorial, scan-friendly, fast, and functional.
- Do not add photography to every dish or every category.
- Use exactly ONE contextual editorial media panel near the top that updates according to active menu mode (Food overview: FNR03012.jpg table spread / Beverage craft: QAR04031.jpg cocktail preparation).
- Media panel must not be sticky and must scroll away naturally.
- Switching between Food and Beverage uses a subtle opacity crossfade (250-400ms) with zero parallax or dramatic zoom.
- Do not identify general overview assets as specific named menu items or cocktails.


---

# Pending Decisions

The following are NOT YET DECIDED:

- CMS platform / custom CMS strategy
- backend architecture
- database
- admin authentication
- authorization model
- media storage
- deployment architecture
- timezone policy
- test framework

Do not treat any candidate solution as approved until explicitly decided.
