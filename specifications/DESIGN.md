# Architecture Baseline Design

## Overview

This design defines Kando as a simple Kanban todo application using packages already included in package.json. The first release is intentionally constrained to one board, with explicit extension points for tags and multi-board support.

## Package-Driven Architecture

| Concern                          | Primary Packages                                                                                 | Design Decision                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| App runtime and build            | `@tanstack/react-start`, `vite`, `@vitejs/plugin-react`                                          | Use TanStack Start app model with Vite as the build/dev runtime.                                                           |
| Routing                          | `@tanstack/react-router`, `@tanstack/router-plugin`                                              | Route-first architecture with generated route tree and typed navigation.                                                   |
| Route data and SSR query support | `@tanstack/react-router-ssr-query`                                                               | Keep route loaders/actions as source of truth for route-level data concerns.                                               |
| UI primitives and components     | `shadcn`, `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` | Use shadcn components as the default UI layer in `src/components/ui`, with consistent variants and accessibility behavior. |
| Styling system                   | `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css`, fontsource packages                        | Utility-first styling with consistent variants and animation utilities.                                                    |
| Data and persistence             | `drizzle-orm`, `drizzle-kit`, `postgres`, `@paralleldrive/cuid2`                                 | Drizzle schema-driven SQL access on Postgres with CUID2 IDs.                                                               |
| Testing                          | `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`                              | Unit and component testing with DOM simulation in jsdom.                                                                   |
| Code quality                     | `eslint`, `@tanstack/eslint-config`, `prettier`, Tailwind/import plugins                         | Enforce deterministic formatting and linting in CI/local scripts.                                                          |

## Architecture

1. Presentation layer:

- Routes in `src/routes` define entry points and route composition.
- Shared UI components in `src/components/ui` provide consistent interaction patterns.
- Interactive UI should use shadcn components by default (for example: dialog, input, button, sidebar, dropdown-menu, select, tooltip, sheet).
- Main board view renders four status columns: todo, in_progress, blocked, done.
- Sidebar presents filters for overdue and today, plus optional filters listed below.

## UI Component Standard

- Always prefer shadcn components for app UI composition.
- Use shadcn button, input, dialog, and sidebar patterns as the baseline for new features.
- shadcn components must be added through the command-line workflow (for example: `npx shadcn@latest add <component>`).
- Do not hand-generate or manually scaffold shadcn component files.
- If CLI-based addition is blocked by environment constraints, get explicit user approval before any alternative approach and record it in spec/task notes.
- Do not modify shadcn component source implementations from their recommended patterns unless explicitly approved by the user.
- If a needed component does not exist in the current UI set, add it through shadcn first.
- Do not wrap shadcn components by default.
- Wrapping a shadcn component is allowed only when both conditions are met:
  - No suitable shadcn-native option is available.
  - The user has explicitly approved the wrapper approach.
- Only fall back to lower-level primitives when there is no suitable shadcn option and this constraint has been acknowledged in the spec/task notes.

## Component Decomposition Standard

- All UI should be broken down into small, reusable, and easily testable components.
- Route files should focus on composition and data wiring, not large blocks of UI markup.
- Shared UI elements should live in `src/components/ui` and feature-level reusable pieces should live in `src/components`.
- Application navigation components should live in `src/components/nav`.
- Specifically, `app-sidebar.tsx` and `app-topbar.tsx` should be placed under `src/components/nav`.
- Prefer passing data and handlers through explicit props so components can be tested in isolation.
- Keep side effects and server calls at container boundaries; keep presentational components mostly pure.
- Complex views (for example, board, swimlane, task card, task dialog, filter panel) should each be separate components with focused responsibilities.

## Dark Mode Standard

- Dark mode implementation must follow the shadcn TanStack Start documentation: https://ui.shadcn.com/docs/dark-mode/tanstack-start
- Theme-related components must live under `src/components/theme` (for example: provider, toggle, theme hooks, and hydration helpers).
- New dark mode files should be created in `src/components/theme` instead of `src/components` or route files.
- Use the documented ThemeProvider pattern and ScriptOnce approach to prevent flash-of-unstyled-content during hydration.
- Root layout must be wired per the documented pattern, including suppressHydrationWarning on the html element.
- Theme selection must support light, dark, and system modes.
- Add and maintain a user-facing mode toggle based on the documented shadcn pattern.
- Do not introduce a custom dark mode architecture when the documented shadcn approach is applicable.
- Any deviation from the documented approach requires explicit user approval and a note in Spec Drift Log.

## Environment File Policy

- Only `.env.example` may be committed to the repository.
- Any runtime/local environment file (for example: `.env`, `.env.local`, `.env.development`, `.env.production`) must not be committed.
- Repository `.gitignore` must enforce this with a broad `.env*` ignore rule and an explicit exception for `.env.example`.
- If additional environment template files are needed in the future, they require explicit user approval and a spec/task note.

## VS Code Tooling Standard

- After modifying files in VS Code, files must be saved so the configured Prettier workflow can run.
- Saving files is required to allow import organization behavior from the configured Prettier/import tooling.
- Workspace VS Code settings should enforce automatic formatting on save.
- Workspace VS Code settings should set Prettier as the default formatter.
- Project setup should include recommended VS Code extensions via `.vscode/extensions.json`.
- Required recommended extensions should include at least Prettier, ESLint, and Tailwind CSS IntelliSense.
- Additional recommended extensions for this project should include Chat Customizations Evaluations, ES7 React snippets, and Pretty TypeScript Errors.
- Suggested workspace recommendations for `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-chat-customizations-evaluations",
    "dsznajder.es7-react-js-snippets",
    "yoavbls.pretty-ts-errors"
  ]
}
```

- Required workspace settings for `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

- If auto-save or format-on-save is unavailable, save manually and run the formatting workflow before considering the change complete.
- Pull requests should not include unorganized imports caused by unsaved files.

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

- Filters are single-select (mutually exclusive); only one filter may be active at a time.
- Selecting a filter deactivates any previously active filter.
- Clicking the currently active filter toggles it off.
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
