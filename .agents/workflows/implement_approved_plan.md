---
description: Execute an explicitly approved implementation plan with strict scope containment and empirical verification.
---

# Approved Plan Execution Workflow

Use this workflow only after the user has explicitly authorized implementation of an approved plan.

The user is not responsible for manually creating the persisted plan file.

---

## Phase 1 - Load Governance & Approved Contract

Read:
1. `.agents/AGENTS.md`
2. `.agents/CONTEXT.md`
3. `.agents/DECISIONS.md`
4. `.agents/TASKS.md`

Identify the final implementation plan explicitly approved by the user.
The approved plan contains:
- Objective and scope boundaries,
- `FILES TO MODIFY` and `UNTOUCHED SCOPE`,
- Approved **Oracle Contract** (independent expected results),
- Approved **Test Strategy** and verification layers (established before approval),
- QA Handoff directive for `/autonomous_qa_engineer`.

Do NOT redefine expected behavior or create a new test strategy post-implementation. Consume the approved contract as immutable.

Do not infer approval from discussion, brainstorming, analysis, or draft proposals. Explicit implementation authorization must exist.

---

## Phase 2 - Persist Material Plan

For a material implementation task, persist the already-approved plan as:

`.agents/plans/GEMA-XXX-task-name.md`

The persisted file must faithfully preserve the approved semantics, scope, and Oracle Contract.

Do not:
- improve it,
- reinterpret it,
- broaden scope,
- add functionality,
- change semantics,
- alter the test contract.

This administrative persistence does not require a second approval.

---

## Phase 3 - Pre-Change Baseline

Before modifying application source:
1. Inspect repository status (`git status`).
2. Record pre-existing modified files.
3. Record pre-existing untracked files.
4. Do not discard user changes.
5. Inspect available project scripts (`package.json`).
6. Run reasonable existing baseline checks (build, lint, existing tests).

Record pre-existing failures separately. Do not attribute them to the new change.

---

## Phase 4 - Verify Scope Boundaries

Confirm before writing code:
- **OBJECTIVE**: Confirmed.
- **FILES TO MODIFY**: Confirmed exact list.
- **FILES TO CREATE**: Confirmed exact list or None.
- **UNTOUCHED SCOPE**: Confirmed protected modules.
- **DEPENDENCY CHANGES**: Approved or None.
- **DATABASE CHANGES**: Approved or None.
- **ORACLE CONTRACT**: Pre-approved and locked.

If additional material scope becomes necessary:

```
SCOPE EXPANSION REQUIRED

Reason:
Additional scope:
Files affected:
Behavior impact:
Risk:
```

STOP and request approval before touching any out-of-scope file.

---

## Phase 5 - Scoped Implementation

Implement strictly the approved contract.

Do not:
- modify unrelated scope,
- opportunistically refactor,
- redesign UI outside approved scope,
- install unapproved dependencies,
- change database architecture without approval,
- change validation semantics,
- add unapproved fallback behavior.

If implementation cannot safely continue without changing the contract:

```
PLAN DEVIATION DETECTED

Approved behavior:
Required deviation:
Reason:
Evidence:
Files affected:
Behavior impact:
Risk:
Recommended action:
```

STOP and wait for user approval.

---

## Phase 6 - Empirical QA (Consume Approved Contract)

After implementation, execute verification against the **pre-approved** test strategy and Oracle Contract.

Invoke `/autonomous_qa_engineer` to:
1. Execute the verification layers defined in the approved plan.
2. Compare actual outputs against the independent expected outputs from the approved Oracle Contract.
3. Verify that untouched components and existing regression baselines remain intact.
4. Report empirical evidence and output the structured QA Audit Report.

Do NOT allow post-implementation redefinition of expected behavior or test matrices.

---

## Phase 7 - Test Failure Handling

If verification fails:

```
FAIL
-> ISOLATE
-> DIAGNOSE
-> DETERMINE FIRST DIVERGENCE
-> APPLY OR PROPOSE IN-SCOPE FIX
-> RE-RUN
```

An in-scope correction may proceed without new approval only if:
- approved semantics remain unchanged,
- scope remains unchanged,
- no new dependency is introduced,
- architecture does not change,
- the approved test contract does not change.

Never modify expected results merely to force a failing test to pass.
If the test contract itself appears flawed, report `TEST CONTRACT CONFLICT` and stop.

---

## Phase 8 - Final Diff Audit

Inspect the final git diff and verify:
- **APPROVED FILES CHANGED**: Yes / No
- **UNAUTHORIZED FILES CHANGED**: None or list
- **UNTOUCHED COMPONENTS PRESERVED**: Yes / No
- **NEW DEPENDENCIES**: None or approved list
- **DATABASE CHANGE**: None or approved change
- **SEMANTIC DEVIATION**: None or explanation

---

## Phase 9 - Documentation Update

1. Update `CONTEXT.md` only if verified system facts changed.
2. Update `DECISIONS.md` only for actually approved durable decisions.
3. Update `TASKS.md` to reflect actual task state.
   - Do NOT mark a material task `DONE` before required QA completes.

---

## Phase 10 - Implementation Audit Report

Produce the final audit report:

```markdown
[IMPLEMENTATION AUDIT REPORT]

Task:
GEMA-XXX

Status:
PASSED / FAILED / WARNING

Approved Objective:

Files Modified:

Files Created:

Scope Compliance:
PASS / FAIL

Build:
PASS / FAIL / N/A

Typecheck:
PASS / FAIL / N/A

Lint:
PASS / FAIL / N/A

Automated Tests:
PASS / FAIL / N/A

Browser Runtime:
PASS / FAIL / N/A

Regression Verification:
PASS / FAIL / N/A

Security Verification:
PASS / FAIL / N/A

Expected vs Actual:

Unauthorized Changes:
None or explanation

Plan Deviation:
None or explanation

Known Remaining Risks:

Documentation Updated:
Yes / No / N/A

[/IMPLEMENTATION AUDIT REPORT]
```

---

# Authoritative Execution Flow

```
LOAD APPROVED CONTRACT
       │
       ▼
PERSIST MATERIAL PLAN (Administrative)
       │
       ▼
PRE-CHANGE BASELINE
       │
       ▼
VERIFY SCOPE BOUNDARIES
       │
       ▼
SCOPED IMPLEMENTATION
       │
       ▼
EMPIRICAL QA (Consume Approved Contract)
       │
       ▼
FINAL DIFF AUDIT
       │
       ▼
DOCUMENTATION UPDATE & REPORT
       │
       ▼
USER REVIEW
```

The executor does not replace the planner.
The executor does not redefine the approved plan.
Its job is to implement the approved contract accurately and provide empirical evidence that implementation matches it.