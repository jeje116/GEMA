# Advanced QA & Benchmark Engineering Strategies

This document defines technical methodologies and assertion standards for the `autonomous_qa_engineer` skill within the web development domain.

---

## 1. Universal Test Oracle & Ground Truth Design

A Test Oracle determines whether observed execution matches specification without circular reasoning. Never assert output against the function under test.

### Oracle Classifications
1. **Analytical / Canonical Oracle**: Ground truth computed via independent specifications, RFC standards, or official business rules.
2. **Reference / Parity Baseline**: Comparing newly refactored, optimized, or migrated functions against frozen golden datasets or approved baseline snapshots (100% behavioral parity required).
3. **Metamorphic Oracle**: Verifying known input-output relational transformations when exact analytical outputs are hard to pre-calculate (e.g., scaling input collection size X must scale pagination bounds proportionally).

---

## 2. Web Engineering Assertion Standards & Tolerances

| Target Dimension | Assertion Standard | Tolerance / Rule | Safe Handling |
| :--- | :--- | :--- | :--- |
| **HTTP Responses** | Exact Status & Schema | `status_code in [200, 201]` | Validate JSON schema fields; verify strict payload types and error payloads. |
| **State / Store Mutation** | Immutability & Isolation | `prev_state !== next_state` | Verify untouched store slices remain bitwise identical; preserve reference equality for unchanged nodes. |
| **React Lifecycle & UI** | Mount / Remount Safety | Zero memory leaks | Verify components survive `React.StrictMode` double-invocation without duplicate effects or dangling listeners. |
| **Runtime & Console** | Zero Exception Policy | `error_count == 0` | Trap uncaught `ReferenceError`, unhandled promise rejections, and runtime DOM crashes. |
| **Database & Persistence** | Atomicity & Invariants | Rollback on failure | Ensure zero dangling state, orphaned foreign keys, or dirty reads across failed mutations. |
| **CMS Publication Boundary** | Draft vs. Public Isolation | Strict access separation | Assert draft content returns 404/empty to public queries; enforce slug uniqueness and idempotent edits. |
| **Authentication & Session** | Token & Cookie Integrity | Deterministic 401/403 | Verify session expiration, token revocation, and secure cookie attributes (`HttpOnly`, `Secure`, `SameSite`). |
| **Media Upload Integrity** | Magic Bytes & Storage Sync | Transactional cleanup | Validate MIME types via file headers, sanitize paths against traversal, and delete staged files on DB write failure. |
| **Responsive & Viewport** | Layout Stability | Zero overflow clipping | Verify rendering across mobile (390px) and desktop (1280px+) without layout shift (CLS). |
| **Accessibility (a11y)** | Keyboard & Focus Control | Zero focus trapping | Verify keyboard tab order, accessible labels (`aria-*`), and focus restoration upon modal close. |
| **Blast Radius Guard** | Zero Neighbor Drift | Signature preserved | Existing upstream/downstream callers and untouched components must pass existing test suites 100%. |

---

## 3. Web Performance & Latency Profiling

Applied when testing high-frequency rendering, heavy lists, data transformations, or API endpoints:

### Performance Metrics
1. **API Latency Budgets**: Assert P50 < 100ms, P95 < 250ms under standard payload conditions.
2. **Render Cycles**: Verify virtualized lists render strictly the visible window plus configured buffer, preventing unneeded DOM node allocations.
3. **Memory Leaks**: Profile heap delta across 100 mount/unmount cycles; ensure event listeners, timers, and abort controllers are cleaned up on unmount.
4. **Bundle Footprint**: Ensure new modules stay within budget and avoid importing large monolithic libraries when tree-shaken alternatives exist.

---

## 4. Universal Adversarial & Boundary Catalog

Every test matrix must evaluate the following failure surfaces:

1. **Structural & Payload Extremes**:
   - Empty collections (`[]`, `{}`, empty strings `""`).
   - Missing, null, `undefined`, or unexpected extra keys in API requests/responses.
   - Single-element arrays, maximum payload sizes, duplicate elements.
2. **Numeric & Input Extremes**:
   - Zero values (`0`, `0.0`), negative numbers where positive are expected.
   - Boundary dates, leap years, timezone offsets (UTC vs. local browser time).
   - Malformed strings, special Unicode characters, potential XSS strings (`<script>`, `javascript:`).
3. **Temporal & Stateful Boundaries**:
   - Cold-start states (uninitialized cache, empty database table).
   - Asynchronous race conditions (out-of-order network responses, slow network simulation).
   - Rapid repeated actions (double submit on buttons, rapid route switching).
4. **Upload Boundaries**:
   - 0-byte file, file exceeding max size boundary, unsupported MIME disguised by file extension.

---

## 5. Discrepancy Analysis & Remediation Workflow

When Actual Output diverges from Expected Output:
1. **Isolate First Divergence Point**: Pinpoint the exact line, state slice, or API field where drift begins.
2. **Classify Divergence Cause**:
   - *State Pollution / Blast Radius Leak*: Shared mutable objects altering neighboring components.
   - *Schema Drift*: Mismatched property names, missing null-checks, or changed response envelopes.
   - *Lifecycle / Async Race*: Missing cleanup in `useEffect` or unhandled promise resolution order.
3. **In-Scope Remediation**:
   - Deliver a surgical fix modifying ONLY the declared scope in `FILES TO MODIFY`.
   - Preserve all existing API signatures and system invariants.
   - Never change the expected test oracle to mask an implementation failure. If the contract itself is flawed, report `TEST CONTRACT CONFLICT`.