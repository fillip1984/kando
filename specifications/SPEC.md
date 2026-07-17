# Architecture Baseline Specification

## Problem

Specification and design documents drifted from the implemented codebase. This baseline defines the current product behavior as implemented in the repository on 2026-07-17.

## Goals

- Define Kando as a single-workspace task tracker with three main views: Dashboard, Board, and Tags.
- Keep the Kanban board as the primary workflow for moving tasks across statuses.
- Treat the current Drizzle schema and server functions as the source of truth.
- Document implemented task metadata and sub-features, including tags, checklist items, and comments.
- Capture known gaps and risks without misrepresenting current behavior.

## Non-Goals

- Supporting multiple boards in the current release.
- Adding new schema entities beyond what is already implemented.
- Rewriting the routing, state, or database stack.

## Tooling Requirements

- Use `pnpm` and `pnpx` for all package management and package execution commands.
- Do not use `npm` or `npx` in repository docs, runbooks, or implementation notes.

## User Stories

- As a user, I can navigate between Dashboard, Board, and Tags from the sidebar.
- As a user, I can create and edit tasks through a shared task dialog.
- As a user, I can move tasks between Kanban columns with drag and drop.
- As a user, I can delete a task from a card with a confirmation step.
- As a user, I can view due date and priority indicators on task cards.
- As a user, I can assign and remove tags from a task.
- As a user, I can add checklist items and comments to an existing task.
- As a user, I can create a task by dropping an Outlook `.msg` file onto a swimlane.
- As a user, I can manage tag records from the Tags page.
- As a user, I can switch theme mode from the sidebar footer.

## Functional Requirements

- Application name is Kando.
- Primary routes are:
  - `/` Dashboard view.
  - `/board` Kanban board view.
  - `/tags` Tag management view.
- Global layout includes left sidebar navigation and a topbar.
- Theme mode control is rendered in the sidebar footer.
- Board uses four status columns: `todo`, `in_progress`, `blocked`, `done`.
- Swimlanes render task counts and include a bottom-pinned `Add Task` action.
- Clicking `Add Task` opens the shared task dialog in create mode.
- Clicking a task card opens the shared task dialog in edit mode.
- Task creation and updates are persisted through server functions.
- Drag and drop on the board persists both `status` and `position` through `reorderTasksFn`.
- Each task card exposes a visible destructive delete button.
- Deleting a task requires confirmation through a dialog before mutation.
- Task cards render metadata badges for:
  - Due date (only when due date exists).
  - Priority (only when priority exists).
  - Checklist progress (only when checklist exists).
  - Comment count (only when comments exist).
  - Up to two tags plus overflow count.
- Task card metadata uses icon-based indicators.
- Task dialog includes compact, icon-led controls for:
  - Title (required).
  - Description (optional).
  - Status combobox (required, no clear action).
  - Priority combobox (optional, clear action enabled).
  - Due date picker using shared styled date picker.
- Shared styled date picker supports:
  - Optional configurable leading icon.
  - Optional configurable placeholder.
  - Inline clear action using lucide `X` when value exists.
- For existing tasks, task dialog additionally includes:
  - Tags section (attach/remove tags).
  - Checklist section (create, toggle, reorder, delete checklist items).
  - Comments section (create and delete comments).
- Dashboard lists non-done tasks grouped by derived categories:
  - Overdue.
  - Due Today.
  - Upcoming.
  - Todo (no due date).
  - Priority buckets.
  - Tag buckets and untagged.
- Tags page supports create, edit, and delete of tag records.
- Task records may include an optional `emailSubjectLine` field.
- Swimlanes support drag-and-drop import of Outlook `.msg` files to create tasks.

## Data Model Requirements

Current todo/task fields include:

- `title` (required)
- `description` (optional)
- `status` (`todo` | `in_progress` | `blocked` | `done`)
- `priority` (optional: `important` | `urgent` | `frantic`)
- `dueDate` (optional string date)
- `position` (optional integer)
- `emailSubjectLine` (optional)

Additional implemented entities:

- `comments`
- `checklistItems`
- `tags`
- `todoTags` (task-tag join)

## Acceptance Criteria

- Sidebar navigation includes links for Dashboard, Board, and Tags.
- Theme mode toggle is visible in sidebar footer.
- Board renders all four swimlanes and task counts.
- Swimlanes provide `Add Task` action at lane bottom.
- Task create/edit dialog is shared between create and edit flows.
- Saving create/edit dialog persists task changes and refreshes route data.
- Task cards include visible destructive delete action.
- Delete action opens confirmation dialog before task removal.
- Task cards render icon-led due date and priority badges when fields are present.
- Task cards omit due-date and priority badges when those fields are null/empty.
- Dragging a task between columns updates persisted `status` and `position`.
- Styled date picker is used in task dialog for due date and shows inline `X` clear affordance.
- Status control uses combobox without clear action.
- Priority control uses combobox with clear action.
- Existing task dialog shows tags, checklist, and comments sections.
- Tags page supports creating, editing, and deleting tags.
- Dashboard renders derived non-done task groupings including date, priority, and tag-based sections.

## Known Gaps and Risks

- Date-only parsing now prefers explicit local-date handling for `yyyy-MM-dd` values; verify behavior in all deployment timezones.
- There is an observed issue where newly added tasks may not become draggable until refresh.

## Future Scope

- Multi-board support is still a roadmap item.
- Richer filtering UX (for example, interactive sidebar filters) can be added in a future iteration.
- Additional analytics/reporting can be layered on top of current entities.
