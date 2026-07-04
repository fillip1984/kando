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
- As a developer, I can rely on the schema fields for task behavior and rendering.
- As a maintainer, I can evolve toward tags and multiple boards without reworking core flows.

## Functional Requirements

- Application name is Kando and core experience is a Kanban todo board.
- Kanban columns map to schema status values: todo, in_progress, blocked, done.
- Todo cards use schema fields from src/server/db/schema.ts: title, description, status, dueDate, position.
- Drag-and-drop must update task status (and position if needed) persistently.
- Sidebar must include filters for overdue tasks and today tasks.
- Additional recommended filters: by status, no due date, blocked only, done recently.
- Initial release supports exactly one board.
- Tags are explicitly out of scope for now but must be represented as a planned extension.

## Acceptance Criteria

- Board UI renders columns for todo, in_progress, blocked, and done.
- Dragging a card to another column updates its status and persists the change.
- Sidebar provides overdue and today filters that correctly derive from dueDate.
- Overdue excludes done tasks and includes tasks with dueDate earlier than the current date.
- Specification and design both document future support for tags and multiple boards.
- Task list includes implementation, validation, and spec drift tracking.

## Open Questions

- Should done tasks appear in overdue/today filter results when dueDate matches conditions?
- Should position be globally ordered or ordered per status column?
- Which extra sidebar filters should ship in v1 versus follow-up iterations?
