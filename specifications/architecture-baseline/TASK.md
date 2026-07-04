# Architecture Baseline Tasks

## Implementation Tasks

- [x] Build Kando board route and layout with one active board.
- [x] Render Kanban columns for statuses: todo, in_progress, blocked, done.
- [x] Render todo cards using schema-backed fields: title, description, dueDate, status, position.
- [x] Implement sidebar with required filters: overdue and today.
- [x] Add at least two additional sidebar filters (recommended: blocked only, no due date).
- [x] Implement drag-and-drop between columns to update status.
- [x] Persist drag-and-drop changes via server function updates (status and position).
- [x] Ensure all DB access in server logic flows through modules in `src/server/db`.
- [x] Add notes for future work: tags and multi-board support.

## Validation Tasks

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual verification
- [ ] Verify overdue filter excludes done tasks and includes dueDate before today.
- [ ] Verify today filter only includes tasks due on current date.
- [ ] Verify drag-and-drop status changes persist across refresh.
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [ ] `pnpm test`

## Spec Drift Log

- Date:
  Area:
  Expected:
  Actual:
  Reason:
  Resolution:
  Follow-up task:
