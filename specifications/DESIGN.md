# Architecture Baseline Design

## Overview

This design describes the current implemented architecture for Kando as of 2026-07-17. Kando is a TanStack Start application with a global shell layout and three feature routes: Dashboard, Board, and Tags.

## Implemented Architecture

### 1. Shell and Routing

- Root shell (`src/routes/__root.tsx`) composes:
  - `ThemeProvider`
  - `TooltipProvider`
  - `SidebarProvider`
  - `AppSidebar`
  - `AppTopbar`
  - `Toaster`
  - TanStack devtools
- File-based routes are:
  - `/` Dashboard (`src/routes/index.tsx`)
  - `/board` Board (`src/routes/board.tsx`)
  - `/tags` Tags (`src/routes/tags.tsx`)
- Sidebar navigation is implemented in `src/components/nav/app-sidebar.tsx`.

### 2. Data and Server Functions

- Database access uses Drizzle and Postgres via `src/server/db/*`.
- Task-focused server functions are implemented in `src/server/functions/todos.ts`.
- Tag CRUD server functions are implemented in `src/server/functions/tags.ts`.
- Route loaders fetch initial data, and UI mutations use TanStack Start server functions plus `router.invalidate()` for refresh.

### 3. Board Composition

- `src/routes/board.tsx` loads tasks and renders `KanbanBoard`.
- `src/components/board/kanban-board.tsx`:
  - Splits tasks into status-based arrays.
  - Uses `@formkit/drag-and-drop` across four grouped swimlanes.
  - Persists drag results through `reorderTasksFn` with `status` and `position` updates.
- `src/components/board/swimlane/swimlane.tsx`:
  - Renders lane header, task list, and bottom `Add Task` button.
  - Opens shared `TaskDialog` in create mode.
  - Supports Outlook `.msg` drag-drop overlay that creates tasks via `parseOutlookMsg` and `createTaskFn`.

### 4. Task Interaction Design

- Task cards are rendered by `src/components/board/swimlane/task/task-card.tsx`.
- Card click opens `TaskDialog` in edit mode.
- Card delete uses destructive icon button and opens confirmation dialog.
- `DeleteTaskConfirmation` performs mutation only on explicit confirmation.
- Card metadata badges include due date, priority, checklist progress, comment count, and tag previews.

### 5. Task Dialog Design

- Shared create/edit dialog: `src/components/board/swimlane/task/task-dialog.tsx`.
- Compact icon-first controls are used for title, description, status, due date, and priority.
- Status field:
  - Combobox.
  - Required.
  - No clear action.
- Priority field:
  - Combobox.
  - Optional.
  - Clear action enabled.
- Due date field uses shared styled date picker:
  - `src/components/custom-ui/styled-date-picker.tsx`
  - Supports configurable `leadingIcon` and `placeholder`.
  - Uses inline `X` clear affordance.
- For existing tasks, dialog includes:
  - Tags section (attach/remove)
  - Checklist section (create/toggle/reorder/delete)
  - Comments section (create/delete)

### 6. Dashboard Design

- Dashboard route (`src/routes/index.tsx`) derives grouped views from loaded tasks and tags.
- Grouping is display-first rather than interactive filter state.
- Date-based groups:
  - Overdue
  - Due Today
  - Upcoming
  - Todo backlog (todo with no due date)
- Additional groups:
  - By priority (frantic, urgent, important, no priority)
  - By tag plus untagged
- Dashboard currently excludes done tasks from these groups.

### 7. Tags Design

- Tags route (`src/routes/tags.tsx`) provides CRUD dialogs for tag management.
- Tag editing includes name, description, and color.
- Tag deletion requires confirmation.
- Task-tag relation is managed from task dialog tags section.

## UI Standards Actually Used

- App UI is built with local wrappers under `src/components/ui/*`.
- Iconography comes from `lucide-react`.
- Date and due-date treatment uses the same goal/calendar semantics across dialog/card contexts.
- Theme mode toggle is implemented in sidebar footer, not topbar.

## Schema Alignment (Implemented)

From `src/server/db/schema.ts`:

- Task table includes:
  - `title`, `description`, `status`, `priority`, `dueDate`, `position`, `emailSubjectLine`
- Related tables include:
  - `comments`
  - `checklistItems`
  - `tags`
  - `todoTags`

Design implications:

- Status controls lane placement.
- Position controls ordering within lane.
- Priority and due date drive card metadata and dashboard grouping.
- Tag relationships are fully implemented and exposed in UI.

## Gaps and Technical Risks

- Date-only parsing now uses explicit `yyyy-MM-dd` local-date parsing for date-only values; behavior should still be validated across deployment timezones.
- Newly created tasks may require refresh before drag behavior is fully stable.

## Migration and Next Iterations

1. Validate timezone behavior of date grouping in real deployment environments.
2. Continue stabilizing post-create drag behavior and monitor for regression.
3. Introduce multi-board support in a future schema and route design.
4. Add optional interactive filtering UX if dashboard grouping should become controllable state.

## Test Strategy (Current Priorities)

- Unit tests:
  - Date grouping helpers (`overdue`, `today`, `done recently` logic)
  - Tag association mutation rules
- Component tests:
  - Task card metadata and delete flow
  - Task dialog create/edit behavior
  - Styled date picker clear behavior
- Integration/route smoke tests:
  - Board drag-drop persistence
  - Tags CRUD and assignment flow
