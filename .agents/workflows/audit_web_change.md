---
description: Audit an implementation against its approved plan without changing application source code.
---

1. Read `.agents/AGENTS.md`.

2. Read the approved implementation plan.

3. Inspect repository diff.

4. Compare implementation against:

   - approved objective,
   - files-to-modify list,
   - files-to-create list,
   - in-scope behavior,
   - untouched scope,
   - oracle contract.

5. Identify:

   - unauthorized file changes,
   - semantic drift,
   - scope creep,
   - missing validation,
   - regression risk,
   - security risk,
   - unnecessary complexity,
   - undocumented dependency changes.

6. Run or invoke approved QA verification where appropriate.

7. Do NOT silently fix findings.

8. Report:

   PASSED
   FAILED
   WARNING

9. For every discrepancy provide:

   Expected:
   Actual:
   Evidence:
   Impact:
   Recommended action:
