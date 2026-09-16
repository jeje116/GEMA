# GEMA Agent Infrastructure

This directory contains engineering governance for AI-assisted development.


## Responsibility Map

### AGENTS.md

Defines agent authority, scope rules, approval gates, and engineering behavior.


### CONTEXT.md

Describes verified facts about the current system.


### DECISIONS.md

Stores approved durable decisions.

Locked ADRs cannot be silently changed.


### TASKS.md

Tracks current work.


### plans/

Stores approved task-specific implementation contracts.


### skills/

Stores reusable engineering methodologies.


### workflows/

Stores explicit Antigravity workflow entry points.


---

# Operating Flow

DISCUSSION

-> SPECIFICATION

-> IMPLEMENTATION PLAN

-> USER APPROVAL

-> IMPLEMENTATION

-> TESTING

-> QA

-> USER REVIEW

-> COMPLETE


---

# Separation of Responsibility

Product truth:
User + approved specifications

Architecture truth:
DECISIONS.md + CONTEXT.md

Task truth:
Approved plan

Testing strategy:
web_test_strategy

Empirical verification:
autonomous_qa_engineer

Implementation:
Scoped coding agent


---

# Principle

Do not add governance complexity unless it materially reduces:

- hallucination,
- unauthorized execution,
- scope creep,
- plan drift.
