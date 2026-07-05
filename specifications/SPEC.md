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

## Tooling Requirements

- Use `pnpm` and `pnpx` for all package management and package execution commands.
- Do not use `npm` or `npx` in repository docs, runbooks, or implementation notes.
- Convert third-party command examples from `npm`/`npx` to `pnpm`/`pnpx` when applying them in this repo.

## User Stories

- As a user, I can view tasks on a Kanban board grouped by status.
- As a user, I can drag a task between columns to change its status.
- As a user, I can quickly filter tasks in a sidebar, including overdue and due today.
- As a user, I can edit an existing task in a dialog without leaving the board context.
- As a user, I can create a task from a button pinned to the bottom of each swimlane.
- As a user, I can use the same task dialog for both creating and editing tasks.
- As a user, I can delete a task from its card using a visible trashcan action.
- As a user, I must confirm task deletion in a dialog before the task is removed.
- As a user, I can control theme from a control placed under the app bar.
- As a user, I can set a task priority to important, urgent, frantic, or leave it unset.
- As a user, I can see due date and priority metadata on each task card at a glance.
- As a user, I can use a compact task dialog where placeholders and icons communicate field meaning.
- As a developer, I can rely on the schema fields for task behavior and rendering.
- As a maintainer, I can evolve toward tags and multiple boards without reworking core flows.

## Functional Requirements

- Application name is Kando and core experience is a Kanban todo board.
- Kanban columns map to schema status values: todo, in_progress, blocked, done.
- Todo cards use schema fields from src/server/db/schema.ts: title, description, status, dueDate, position.
- Editing a task must be performed through a dialog-based form.
- Editing must be initiated by clicking the task card surface.
- Each task card must show a visible trashcan icon action for deletion.
- Trash/delete actions must use destructive button variants.
- Each task card must render due date and priority as shadcn badges.
- Task card metadata badges must use icons to indicate due date and priority instead of text labels like "Due" or "Priority".
- Deleting a task must require a confirmation dialog before the delete mutation is executed.
- Theme control must be placed under the app bar.
- Date picking fields must use a shadcn date picker-based picker.
- Date picker display controls must include an inline `span` with an `X` affordance for clearing selected values, similar to combobox clear interactions.
- Dropdown-style choice fields should prefer combobox with a clear option over select.
- Task dialog inputs should be compact and avoid standalone text labels when placeholders and/or icon input groups can convey field meaning.
- Todo priority must be nullable and constrained to: important, urgent, frantic.
- Package management and package execution commands must use pnpm/pnpx conventions.
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
- Clicking an existing task card opens the shared task dialog in edit mode with pre-filled values.
- Each task card visibly renders a trashcan icon delete action.
- Trash/delete controls render with destructive variant styling.
- Each task card shows due date and priority metadata using shadcn badge components.
- Due date and priority badges use icons as their field indicators rather than text labels.
- Clicking the trashcan action opens a confirmation dialog before deletion.
- Confirming deletion removes the task and persists the change.
- Canceling deletion closes the confirmation dialog and leaves the task unchanged.
- Theme mode control is rendered under the app bar.
- Date picking fields render a shadcn date picker-based picker.
- Date picker selected-value displays include an inline `X` clear affordance rendered as a `span` inside the display control.
- Dropdown-style controls prefer combobox with a clear option over select.
- Task dialog uses a compact layout where field meaning is conveyed through placeholders and/or icon input groups instead of standalone labels.
- Task create and edit flows support priority values of null, important, urgent, or frantic.
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

- Done tasks do not appear in overdue results, and today includes done tasks when dueDate matches the current date.
- Position remains ordered per status column in v1.
- Extra sidebar filters in v1 are blocked only, no due date, and done recently; by status remains a follow-up iteration.
