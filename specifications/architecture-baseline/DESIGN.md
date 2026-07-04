# Architecture Baseline Design

## Overview

This design defines Kando as a simple Kanban todo application using packages already included in package.json. The first release is intentionally constrained to one board, with explicit extension points for tags and multi-board support.

## Package-Driven Architecture

| Concern                          | Primary Packages                                                                                 | Design Decision                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| App runtime and build            | `@tanstack/react-start`, `vite`, `@vitejs/plugin-react`                                          | Use TanStack Start app model with Vite as the build/dev runtime.                  |
| Routing                          | `@tanstack/react-router`, `@tanstack/router-plugin`                                              | Route-first architecture with generated route tree and typed navigation.          |
| Route data and SSR query support | `@tanstack/react-router-ssr-query`                                                               | Keep route loaders/actions as source of truth for route-level data concerns.      |
| UI primitives and components     | `@base-ui/react`, `shadcn`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` | Compose accessible primitives with reusable UI components in `src/components/ui`. |
| Styling system                   | `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css`, fontsource packages                        | Utility-first styling with consistent variants and animation utilities.           |
| Data and persistence             | `drizzle-orm`, `drizzle-kit`, `postgres`, `@paralleldrive/cuid2`                                 | Drizzle schema-driven SQL access on Postgres with CUID2 IDs.                      |
| Testing                          | `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`                              | Unit and component testing with DOM simulation in jsdom.                          |
| Code quality                     | `eslint`, `@tanstack/eslint-config`, `prettier`, Tailwind/import plugins                         | Enforce deterministic formatting and linting in CI/local scripts.                 |

## Architecture

1. Presentation layer:

- Routes in `src/routes` define entry points and route composition.
- Shared UI components in `src/components/ui` provide consistent interaction patterns.
- Main board view renders four status columns: todo, in_progress, blocked, done.
- Sidebar presents filters for overdue and today, plus optional filters listed below.

2. Application layer:

- Route loaders/actions and server functions in `src/server/functions` implement business behavior.
- Utility helpers remain in `src/lib`.
- Drag-and-drop interactions are handled in the board UI and call server functions to persist status and ordering.

3. Data layer:

- Schema and DB setup live in `src/server/db`.
- Access to Postgres flows through Drizzle and typed schema definitions.

## Schema Alignment (Current)

Current todo fields from `src/server/db/schema.ts`:

- title (required)
- description (optional)
- status (todo | in_progress | blocked | done)
- dueDate (optional date)
- position (optional integer)

Design implications:

- Column placement is derived from status.
- Card ordering within a column uses position.
- Overdue and today filters are derived from dueDate.

## Board and Scope Model

- v1 supports a single board only.
- No boardId field is required for v1.
- Multi-board support is a planned extension and should be introduced with a board entity and todo-to-board relationship in a future spec.

## Tag Model (Planned)

- Tags are not implemented in v1.
- Planned future model: tags table and join table between todos and tags.
- Filtering and visual chips for tags should be introduced only after schema support exists.

## Filter Design

Required filters:

- Overdue: dueDate is before today and status is not done.
- Today: dueDate equals today.

Suggested additional filters:

- By status (quick toggles per column)
- No due date
- Blocked only
- Completed today or recently completed

Filter behavior:

- Filters should combine predictably (AND semantics by default).
- Empty filter state shows all tasks.

## Drag-and-Drop Design

- Use native drag-and-drop browser APIs in v1 to avoid introducing additional dependencies.
- Dropping a card into a new column changes status and recalculates position.
- Persist updates through server functions and reflect optimistic UI updates where practical.

## Data Model Changes

No schema change is required for v1 Kanban behavior because current todo fields are sufficient. Future schema changes are expected for tags and multi-board support.

## API / Contract Changes

No external API contract changes are required. Internal contract guidance:

- Keep server function return shapes stable and typed.
- Ensure route-facing data contracts are explicit and minimal.
- Include mutation endpoints/functions for drag-drop status and position updates.
- Keep filter query contract explicit for overdue and today behavior.

## Migration / Rollout Plan

1. Implement single-board Kanban view with schema-aligned card fields.
2. Add sidebar filtering for overdue and today.
3. Add drag-and-drop status changes with persisted updates.
4. Add optional extra filters if capacity allows.
5. Track all divergence in `TASK.md` under Spec Drift Log.

## Risks and Tradeoffs

- Using multiple UI systems (`@base-ui/react` plus shadcn components) can create style drift if conventions are not documented.
- RC version usage (`drizzle-orm` and `drizzle-kit` 1.0.0-rc.4) may introduce upgrade friction.
- Over-centralizing logic in routes can reduce testability; prefer server functions for reusable domain behavior.
- Native drag-and-drop is lightweight but can require additional keyboard accessibility work.
- Date-based filters depend on clear timezone handling; define local-date behavior consistently.

## Test Strategy

- Unit tests for utility and server-function logic using Vitest.
- Component tests for reusable UI using Testing Library.
- Route-level smoke tests for key user flows.
- CI checks should run `typecheck`, `lint`, `check`, and `test` scripts.
- Include focused tests for overdue/today filter behavior and drag-drop status transitions.
