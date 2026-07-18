# Implementation Tasks

Last updated: 2026-07-17

## TODOs

### Long-term TODOs

- [ ] add settings and import/export
- [ ] switch over to Field instead of div everywhere
- [ ] try to get consistent on fields, either use null or empty string to denote no value
- [ ] when adding items, they are not draggable without a page refresh (formkit dnd issue)
- [ ] break up task dialog - would prefer that the tags go on the left... work on this after inlining form and making to possible to add tags on creation
- [ ] add security
- [ ] deploy to cloud
- [ ] send email?
- [ ] create reports/charts showing progress
- [ ] add recurring
- [ ] create mobile app that sends daily tasks, and summary

**Check that above items are represented in below items**

## Completed

- [x] Align spec and design docs to current codebase architecture.
- [x] Confirm and document implemented routes: `/`, `/board`, `/tags`.
- [x] Confirm and document implemented task features: create/edit/delete, drag-drop reorder, tags, checklist, comments.
- [x] Confirm and document shared task dialog behavior and styled date-picker usage.
- [x] Confirm and document theme toggle placement in sidebar footer.
- [x] Fix task-tag unlink mutation to scope by both `todoId` and `tagId`.
- [x] Improve due-date parsing for `yyyy-MM-dd` values using local-date parsing semantics.
- [x] Improve new-task position assignment (`max(position) + 1`) to reduce duplicate positions after create/import.
- [x] Run verification checks (`pnpm typecheck`, `pnpm build`) successfully after fixes.
- [x] Add toasts for key create/update/delete flows.
- [x] Break up task dialog into a responsive two-column layout on larger screens.

## In Progress / Validate

- [ ] Validate timezone behavior for date grouping in real deployment environments.
- [ ] Monitor drag behavior after task creation to verify refresh is no longer needed in normal usage.

## Next Up

- [ ] Add regression tests for date grouping helpers (`overdue`, `today`, `done recently`) across timezone edge cases.
- [ ] Add server-function tests for tag association/unassociation behavior, including scoped delete safety.
- [ ] Add component tests for task card metadata rendering and delete confirmation flow.
- [ ] Add component tests for task dialog create/edit and styled date-picker clear behavior.
- [ ] Add integration smoke tests for board drag-drop persistence and tags CRUD/assignment flow.

## Product / UX Backlog

- [ ] Evaluate inline edit affordances for common task fields.
- [ ] Add settings and import/export workflows.
- [ ] Improve dashboard filtering UX if interactive filters are desired.

## Long-term Backlog

- [ ] Add security hardening and auth model.
- [ ] Prepare cloud deployment strategy.
- [ ] Evaluate email delivery workflows.
- [ ] Add progress reports/charts.
- [ ] Add recurring task support.
- [ ] Evaluate mobile companion experience.
- [ ] Plan multi-board data model and migration path.
