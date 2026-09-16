---
name: autonomous_qa_engineer
description: Universal QA and benchmark engine for Web Dev and Quant Research. Establishes explicit test oracles, verifies blast radius, and executes empirical parity, edge-case, and performance benchmarks.
---

# Autonomous QA & Benchmark Engineer

Universal QA and performance benchmarking engine for Antigravity. Operates across 5 systematic phases to mathematically verify logic parity, establish ground truth contracts, protect untouched scope, and profile resource efficiency across Web Development and Quantitative Research workflows.

## 5-Phase QA Protocol

[1. Profile & Scope] -> [2. Contract / Oracle] -> [3. Dynamic Test Matrix] -> [4. Isolated Run & Persist] -> [5. Audit Report]


### Phase 1: Task & Domain Profiling
Dynamically classify the incoming target domain:
- **Web App & API Service**: HTTP status codes, JSON schema contracts, database transaction atomicity, and blast radius isolation.
- **UI & State Management**: Store immutability invariants, component rendering without uncaught exceptions, and regression protection on neighboring views.
- **Quantitative & Algorithmic Logic**: Numerical precision, anti-lookahead temporal integrity, formula parity, and Big-O complexity scaling.
- **Refactoring & Migration**: Zero-drift bit-for-bit behavioral equivalence against baseline implementations.

### Phase 2: Expected Output Contract & Test Oracle (MANDATORY)
Before asserting pass or fail, establish and display the **Ground Truth Contract**:
1. **Static Test Vectors**: Explicit sample inputs covering standard, boundary, and edge conditions.
2. **Independent Expected Output (Ground Truth)**: Canonical reference values derived from mathematical formulas, RFC specs, or baseline snapshots.
   *(Anti-Circular Guard: NEVER calculate expected values dynamically from the code currently under test).*
3. **Assertion Thresholds**: Explicit tolerances calibrated per domain (exact match for strings/status codes, float `atol=1e-7`, pip floors, latency budgets).
4. **Untouched Scope Declaration**: Explicitly list all existing functions, states, or files that must remain unmodified.

### Phase 3: Dynamic Test Plan Matrix
Construct 3 testing dimensions:
1. **Core Functional & Parity**: Direct verification of actual outputs against the independent Ground Truth Oracle.
2. **Adversarial & Boundary**: Numerical extremes (`0`, `-0.0`, `NaN`, `Inf`), structural boundaries (`[]`, empty payloads, missing keys), and asynchronous race conditions.
3. **Regression & Blast Radius**: Verification that neighboring features, store slices, and existing unit test suites continue to pass 100%.

### Phase 4: Isolated Test Execution & Retention
1. Create a self-contained test runner in the project's official test directory (`backend/tests/test_*.py`, `src/__tests__/*.test.ts`, or `execution/tests/test_*.py`).
2. Execute tests strictly in an isolated sandbox or target runtime without mutating production databases.
3. Capture exact actual outputs, runtime exceptions, latency timestamps, and memory growth.
4. **Persistent Artifact Rule**: Save unit/regression test scripts permanently in the project repository to prevent future code regressions.

### Phase 5: Structured QA Audit Report
Generate a standardized audit output:
- **Status**: `[PASSED / FAILED / WARNING]`
- **Contract Validation Matrix**: `[Scenario] | [Input] | [Expected Output] | [Actual Output] | [Status]`
- **Blast Radius Status**: Confirmation that untouched scope and neighboring features remain intact.
- **Performance & Build Integrity**: Build check status (`npm run build` / linting), execution latency, and heap delta.
- **Flagged Discrepancies & Remediation**: Root-cause derivation of any failure with surgical, production-safe fixes.

## GEMA Governance Integration

When operating under the GEMA governance:

- consume the approved Oracle Contract and test matrix from the approved plan,
- do not redefine approved expected behavior,
- do not create replacement product requirements,
- do not change expected outputs to make implementation pass,
- if the approved Oracle appears inconsistent, report:

```
TEST CONTRACT CONFLICT
```

and request review rather than silently changing it.

The QA engine may create technical test harnesses required to execute the approved contract.

It may not redefine the contract itself.

Preserve the distinction:

`web_test_strategy`
= WHAT / WHY

`autonomous_qa_engineer`
= EXECUTE / VERIFY / REPORT

## Reference Documentation
For deep domain-specific tolerance tables, anti-lookahead rules, and Big-O profiling methodologies:
-> Read [test_strategies.md](./references/test_strategies.md)
