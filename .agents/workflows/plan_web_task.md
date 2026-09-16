---
description: Analyze and plan a web development task without modifying application source code.
---

# Web Task Planning Workflow

Use this workflow to analyze and plan web tasks in **DISCUSSION** mode before implementation authorization.

Do NOT modify application source code during this workflow.

---

## 1. Load Engineering Governance

Read:
1. `.agents/AGENTS.md`
2. `.agents/CONTEXT.md`
3. `.agents/DECISIONS.md`
4. `.agents/TASKS.md`

Adhere strictly to the source-of-truth hierarchy defined in `AGENTS.md`.

---

## 2. Inspect Application State

1. Inspect relevant application source files in `gema-restaurant-&-societiet/`.
2. Inspect `package.json` for installed frameworks, dependencies, and scripts.
3. Remain strictly in **DISCUSSION** mode.

---

## 3. Scope & Blast Radius Definition

Determine and document:
- **Objective**: Exactly what problem is being solved or what capability is being added.
- **Verified Problem**: Ground-truth root cause (separated from symptoms or hypotheses).
- **Assumptions & Unknowns**: Explicitly declare unverified items.
- **Files to Modify**: Exact file paths requiring changes.
- **Files to Create**: Exact new file paths or `None`.
- **In-Scope Behavior**: Required observable functionality.
- **Out-of-Scope Behavior**: Explicit boundaries.
- **Untouched Components**: Neighboring files/modules that must remain unaltered.
- **Dependencies**: Any proposed package (with justification) or `None`.
- **Database / CMS Impact**: Migrations, schema changes, or invariants.
- **Risks**: Functional, security, regression, or data integrity risks.

---

## 4. Web Test Strategy Formulation (BEFORE Approval)

For material behavioral changes, invoke or follow `/web_test_strategy` **BEFORE** presenting the final plan:

1. Classify task risk (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
2. Evaluate required test layers from the 13 verification layers.
3. Formulate the **Oracle Contract** with independent ground-truth expected outputs:
   - **Normal Case**: Expected valid behavior and status codes.
   - **Boundary Case**: Extremes, empty payloads, limits.
   - **Error Case**: Graceful rejection and error states.
   - **Regression Case**: Untouched features confirmed green.
4. Define browser runtime, responsive, accessibility, security, and performance verification requirements.
5. Identify any `TEST INFRASTRUCTURE GAP` and recommend minimum necessary tooling.
6. Formulate the precise **QA Handoff** contract for `/autonomous_qa_engineer`.

---

## 5. Produce Proposed Implementation Plan

Draft the comprehensive proposed plan using `.agents/plans/_TEMPLATE.md`.

The plan must synthesize:
- Objective and reason,
- Scope and blast radius declarations,
- Complete **Oracle Contract** (Normal, Boundary, Error, Regression),
- Required verification layers from `web_test_strategy`,
- QA Handoff directive.

---

## 6. Request User Approval Gate

Present the proposed implementation plan to the user for explicit review.

User approval explicitly approves:
1. Objective and scope,
2. Files to modify and untouched components,
3. Behavioral contract,
4. **Oracle Contract** (independent expected results),
5. Regression boundaries,
6. Required verification layers and QA handoff.

Do NOT write or modify application source code until explicit user approval is granted.
