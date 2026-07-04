---
name: spec-driven-development
description: "Use when planning or implementing features with specification-first workflow, technical design, task tracking, and spec drift detection. Enforces /specifications structure with SPEC.md, DESIGN.md, and TASK.md."
argument-hint: "Feature name or scope (for example: recurring-reminders)"
user-invocable: true
---

# Spec-Driven Development

Use this skill when defining or delivering any feature that should be built from an explicit specification.

## Required Structure

All work must live under `/specifications`.

Default (canonical) location for active work:

- `/specifications/SPEC.md`
- `/specifications/DESIGN.md`
- `/specifications/TASK.md`

Do not create nested duplicate paths such as `/specifications/architecture-baseline/` unless the user explicitly requests per-feature folders.

Only when explicitly requested, use per-feature folders with lowercase kebab-case:

- `/specifications/<feature-name>/SPEC.md`
- `/specifications/<feature-name>/DESIGN.md`
- `/specifications/<feature-name>/TASK.md`

## File Responsibilities

`SPEC.md`:

- Product behavior and user-visible outcomes.
- Scope, constraints, and acceptance criteria.
- Non-goals to prevent accidental scope creep.

`DESIGN.md`:

- Technical approach and architecture.
- Data model and API/contract changes.
- Tradeoffs, risks, and rollout considerations.

`TASK.md`:

- Ordered implementation checklist.
- Validation tasks (tests, manual verification, migration checks).
- Spec drift log for deviations discovered during implementation.

## Standard Workflow

1. Create `/specifications`.
2. Draft `SPEC.md` and get alignment before implementation.
3. Draft `DESIGN.md` to map spec requirements to technical decisions.
4. Create `TASK.md` with checkboxes and delivery order.
5. Implement in small slices; update `TASK.md` as work progresses.
6. If implementation diverges from spec, log drift immediately in `TASK.md`.
7. Resolve drift by either:

- Updating implementation to match the current spec, or
- Updating `SPEC.md` and `DESIGN.md` with an explicit rationale.

8. Close the feature only when acceptance criteria in `SPEC.md` are satisfied and all items in `TASK.md` are complete.

## Spec Drift Tracking (in TASK.md)

Add a `## Spec Drift Log` section with entries like:

- Date:
- Area:
- Expected (from SPEC/DESIGN):
- Actual:
- Reason:
- Resolution:
- Follow-up task:

Every drift entry must map to either:

- A code fix task, or
- A documentation update task.

## Suggested Templates

`SPEC.md`:

```md
# <Feature Name> Specification

## Problem

## Goals

## Non-Goals

## User Stories

## Functional Requirements

## Acceptance Criteria

## Open Questions
```

`DESIGN.md`:

```md
# <Feature Name> Design

## Overview

## Architecture

## Data Model Changes

## API / Contract Changes

## Migration / Rollout Plan

## Risks and Tradeoffs

## Test Strategy
```

`TASK.md`:

```md
# <Feature Name> Tasks

## Implementation Tasks

- [ ]

## Validation Tasks

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual verification

## Spec Drift Log

- Date:
  Area:
  Expected:
  Actual:
  Reason:
  Resolution:
  Follow-up task:
```
