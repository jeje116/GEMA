---
name: web_test_strategy
description: Designs a risk-based, minimal-sufficient testing strategy for web development tasks before implementation begins. Determines test layers, failure modes, ground truth oracles, and regression boundaries, then hands off execution to autonomous_qa_engineer.
---

# Web Test Strategy

A proactive test-planning engine that establishes a **risk-based, minimal-sufficient testing strategy** before code implementation begins.

This skill is a **test planner**, not an executor. It decides **WHAT** must be tested and **WHY**, establishes independent ground truth oracles, defines regression boundaries, and hands off the execution contract to `/autonomous_qa_engineer`.

---

## Core Principle: Proportionality vs. Test Theatre

Testing must be strictly proportional to actual failure risk.
- **Do not create tests merely to satisfy coverage metrics.**
- Choose the smallest set of tests capable of detecting realistic failure modes.
- Avoid "test theatre": an isolated CSS adjustment does not need a component unit test; a database mutation or auth change demands rigorous verification.

---

## 5-Step Planning Protocol

```
[1. Profile & Classify Risk] 
       │
       ▼
[2. Analyze Failure Surfaces & Select Layers] 
       │
       ▼
[3. Define Ground Truth Oracles & Mocking Policy] 
       │
       ▼
[4. Audit Baseline Capability & Detect Gaps] 
       │
       ▼
[5. Emit Strategy & Handoff to QA]
```

### Step 1: Task Profiling & Risk Classification
Classify the task into exactly one risk level:
- **LOW**: Copy changes, image replacement, isolated visual styling, static content adjustment.
- **MEDIUM**: Component state, interactive UI, navigation, filtering, client-side validation, reusable component behavior.
- **HIGH**: API mutation, CMS behavior, authentication, authorization, file/media upload, database writes, publication workflows, external integrations.
- **CRITICAL**: Destructive database migrations, production data mutation, payment flows, security-sensitive credential handling, irreversible operations.

### Step 2: Failure Surface Analysis & Layer Selection
Evaluate which of the 13 verification layers are strictly necessary (omit non-applicable layers):
1. **Static Verification**: TypeScript check, ESLint, compiler checks.
2. **Unit Test**: Deterministic business logic, transformations, validators, parsers, state reducers.
3. **Component Test**: Meaningful UI interaction, conditional rendering, forms, internal component state.
4. **Integration Test**: Multi-layer boundaries (UI -> API, API -> DB, CMS -> DB, storage -> DB metadata, auth -> authz).
5. **API Contract Test**: HTTP status, request/response schema, server validation, auth checks, error payloads.
6. **Database Test**: Persistence, uniqueness constraints, transactions, rollback, state invariants (never against production databases).
7. **End-to-End Test**: Critical multi-step user journeys only. Do not use E2E if a lower-level test can verify the behavior cheaper and more reliably.
8. **Browser Smoke Test**: Page load, routing, uncaught runtime exceptions, console errors, primary interaction.
9. **Responsive Verification**: Mobile (390px), Tablet (768px when relevant), Desktop (1280px+).
10. **Accessibility Verification**: Keyboard navigation, ARIA labels, focus trapping/restoration, semantic HTML.
11. **Visual Regression**: Visual fidelity is the explicit requirement. Do not replace behavioral tests with screenshots.
12. **Security Verification**: Authentication, authorization, file upload integrity, input sanitization, admin endpoints, secrets.
13. **Performance Verification**: Tasks materially affecting bundle size, large lists, media loading, expensive rendering, or API latency.

> Consult the full decision table in [references/web_test_matrix.md](./references/web_test_matrix.md) for category-specific failure modes, minimum layers, and anti-patterns.

### Step 3: Ground Truth Oracles & Mocking Policy
- **Independent Expected Output**: Reference values must be derived strictly from specifications, business rules, RFCs, fixed fixtures, or approved baselines. **Never invoke the code under test to generate expected values.**
- **Mocking Policy**: Mock external boundaries (third-party APIs, SMTP, payment gateways), not internal application code. Avoid excessive mocking that only asserts mocks return mock values.

### Step 4: Baseline Audit & Gap Detection
Inspect the project environment (`package.json`, existing test files, test runners, `tsconfig.json`).
- If a required test layer lacks tooling, report `TEST INFRASTRUCTURE GAP`.
- Recommend the minimal development package with rationale, confirming whether an alternative using existing dependencies exists. **Do not install dependencies automatically.**

### Step 5: Formulate Strategy & QA Handoff
Format the test strategy using the mandatory output block below. The output directly acts as the execution contract for `/autonomous_qa_engineer`.

---

## Output Template

Every invocation must generate the following structured block:

```markdown
[WEB TEST STRATEGY]

Task:
[task being evaluated]

Risk Level:
[LOW / MEDIUM / HIGH / CRITICAL]

Primary Failure Modes:
[concise summary of realistic failure risks]

Required Test Layers:
[only layers strictly required for this task]

TEST MATRIX

| Scenario | Layer | Input / Action | Independent Expected Result | Regression Protected |
| -------- | ----- | -------------- | --------------------------- | -------------------- |

Browser / Runtime Verification:
[required checks or N/A]

Responsive Verification:
[required viewports/checks or N/A]

Accessibility Verification:
[checks or N/A]

Security Verification:
[checks or N/A]

Performance Verification:
[checks or N/A]

Test Infrastructure Gap:
[None OR missing infrastructure with recommended package]

Minimum Verification Commands:
[commands appropriate to the detected project]

Regression Boundary:
[features, routes, or stores that must remain untouched and pass existing tests]

QA Handoff:
[precise contract instructing `/autonomous_qa_engineer` on what harness to run and verify]

[/WEB TEST STRATEGY]
```

---

## Integration with Autonomous QA Engineer

Division of responsibilities:
- `/web_test_strategy` (This Skill): Decides **WHAT** to test, **WHY**, which layers to invoke, the expected oracle, and the blast radius boundary.
- `/autonomous_qa_engineer`: Implements or configures the test harness, **EXECUTES** verification, compares actual vs. expected results, diagnoses root causes, and produces the QA audit report.

Do not write application code, execute tests, or duplicate the QA execution cycle within this skill.
