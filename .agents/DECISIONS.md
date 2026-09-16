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
