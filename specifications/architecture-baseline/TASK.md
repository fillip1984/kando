# Architecture Baseline Tasks

## Implementation Tasks

- [ ] Build Kando board route and layout with one active board.
- [ ] Render Kanban columns for statuses: todo, in_progress, blocked, done.
- [ ] Render todo cards using schema-backed fields: title, description, dueDate, status, position.
- [ ] Implement sidebar with required filters: overdue and today.
- [ ] Add at least two additional sidebar filters (recommended: blocked only, no due date).
- [ ] Implement drag-and-drop between columns to update status.
- [ ] Persist drag-and-drop changes via server function updates (status and position).
- [ ] Ensure all DB access in server logic flows through modules in `src/server/db`.
- [ ] Add notes for future work: tags and multi-board support.

## Validation Tasks

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual verification
- [ ] Verify overdue filter excludes done tasks and includes dueDate before today.
- [ ] Verify today filter only includes tasks due on current date.
- [ ] Verify drag-and-drop status changes persist across refresh.
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test`

## Spec Drift Log

- Date:
  Area:
  Expected:
  Actual:
  Reason:
  Resolution:
  Follow-up task:
