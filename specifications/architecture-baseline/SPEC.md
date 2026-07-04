# Architecture Baseline Specification

## Problem

We are building a simple todo application called Kando. The product requires a clear, implementation-ready baseline that aligns with the current package set and the existing todo schema.

## Goals

- Define Kando as a Kanban-first task tracking experience.
- Use existing dependencies and current schema fields as the source of truth.
- Keep scope to one board for now, with explicit roadmap support for multiple boards later.
- Include sidebar filters for overdue and today tasks, with room for additional useful filters.
- Define drag-and-drop status updates across Kanban columns.

## Non-Goals

- Supporting multiple boards in the initial release.
- Implementing tags in the initial release.
- Rewriting framework, router, or database stack.

## User Stories

- As a user, I can view tasks on a Kanban board grouped by status.
- As a user, I can drag a task between columns to change its status.
- As a user, I can quickly filter tasks in a sidebar, including overdue and due today.
- As a user, I can edit an existing task in a dialog without leaving the board context.
- As a user, I can create a task from a button pinned to the bottom of each swimlane.
- As a user, I can use the same task dialog for both creating and editing tasks.
- As a developer, I can rely on the schema fields for task behavior and rendering.
- As a maintainer, I can evolve toward tags and multiple boards without reworking core flows.

## Functional Requirements

- Application name is Kando and core experience is a Kanban todo board.
- Kanban columns map to schema status values: todo, in_progress, blocked, done.
- Todo cards use schema fields from src/server/db/schema.ts: title, description, status, dueDate, position.
- Editing a task must be performed through a dialog-based form.
- Each swimlane must provide a create-task button pinned to the bottom of the lane.
- The create-task button must open the same task dialog used for editing.
- The shared task dialog must support both modes:
  - Create mode initializes empty/default values for the target swimlane.
  - Edit mode initializes existing task values.
- Drag-and-drop must update task status (and position if needed) persistently.
- Sidebar must include filters for overdue tasks and today tasks.
- Additional recommended filters: by status, no due date, blocked only, done recently.
- Sidebar filters must be mutually exclusive: only one filter can be active at a time.
- Selecting a filter activates it and deactivates any previously active filter.
- Clicking the currently active filter toggles it off (returns to unfiltered state).
- Initial release supports exactly one board.
- Tags are explicitly out of scope for now but must be represented as a planned extension.

## Acceptance Criteria

- Board UI renders columns for todo, in_progress, blocked, and done.
- Each swimlane has a create button pinned to the bottom of the column.
- Clicking the pinned create button opens the shared task dialog in create mode.
- Clicking edit on an existing task opens the same shared task dialog in edit mode with pre-filled values.
- Submitting the dialog in create mode creates a new task in the intended swimlane.
- Submitting the dialog in edit mode updates the existing task.
- Dragging a card to another column updates its status and persists the change.
- Sidebar provides overdue and today filters that correctly derive from dueDate.
- Only one sidebar filter can be active at a time.
- Activating one filter automatically deactivates the previously active filter.
- Clicking the active filter again clears it and restores the unfiltered task view.
- Overdue excludes done tasks and includes tasks with dueDate earlier than the current date.
- Specification and design both document future support for tags and multiple boards.
- Task list includes implementation, validation, and spec drift tracking.

## Open Questions

- Should done tasks appear in overdue/today filter results when dueDate matches conditions?
- Should position be globally ordered or ordered per status column?
- Which extra sidebar filters should ship in v1 versus follow-up iterations?
