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
- [x] Replace sidebar Quick Add flow with a shared task dialog used for both create and edit.
- [x] Add an edit action on each task card that opens the shared task dialog with pre-filled task values.
- [x] Add a create-task button pinned to the bottom of each swimlane that opens the shared task dialog in create mode.
- [x] Use the target swimlane as the default status when opening create mode from a swimlane button.
- [x] Replace raw form elements with shadcn components for task input flows (dialog, input, textarea, button).
- [x] Decompose board UI from route into reusable components (board, swimlane, task-card, task-dialog, filter-panel).
- [x] Implement shadcn TanStack Start dark mode architecture (ThemeProvider, ScriptOnce, root wiring, mode toggle).
- [x] Update root document title and shell metadata from starter defaults to Kando defaults.
- [x] Add workspace VS Code settings for automatic format on save (`editor.formatOnSave: true`).
- [x] Add workspace VS Code settings to use Prettier as default formatter (`editor.defaultFormatter: esbenp.prettier-vscode`).
- [x] Add project recommended VS Code extensions in `.vscode/extensions.json` (Prettier, ESLint, Tailwind CSS IntelliSense).

## Validation Tasks

- [x] Unit tests
- [x] Integration tests
- [ ] Manual verification
- [x] Verify create-task buttons stay pinned to the bottom of each swimlane on desktop and mobile layouts.
- [x] Verify create mode and edit mode both use the same task dialog component.
- [ ] Verify task edit updates persist and immediately reflect on the board.
- [x] Verify task create from each swimlane defaults to that swimlane status.
- [x] Verify all new task form controls are shadcn components and no custom wrappers were introduced without approval.
- [ ] Verify shadcn components were added via CLI workflow (for example: `npx shadcn@latest add ...`) and not manually scaffolded.
- [x] Verify dark mode follows shadcn TanStack Start docs (hydration-safe, light/dark/system toggle).
- [x] Verify `.vscode/settings.json` enforces format on save.
- [x] Verify `.vscode/settings.json` sets Prettier as default formatter.
- [x] Verify `.vscode/extensions.json` includes recommended project extensions for setup.
- [x] Verify overdue filter excludes done tasks and includes dueDate before today.
- [x] Verify today filter only includes tasks due on current date.
- [x] Verify filter behavior is single-select: enabling one filter disables the previous one, and clicking the active filter toggles it off.
- [ ] Verify drag-and-drop status changes persist across refresh.
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test`

## Spec Drift Log

- Date: 2026-07-04
  Area: Task create/edit UX
  Expected: Create and edit must use a shared dialog, and create entry should be pinned at swimlane bottom.
  Actual: Shared task dialog now handles both create and edit, with per-swimlane pinned create buttons.
  Reason: Initial implementation predated updated UX requirements.
  Resolution: Implemented shared dialog flow and swimlane-pinned create actions in decomposed board components.
  Follow-up task: Add focused component/integration tests for dialog open/edit/save flows.

- Date: 2026-07-04
  Area: shadcn component policy
  Expected: Task input flows should use shadcn components and avoid non-approved wrappers/custom primitives.
  Actual: Task input flow now uses shadcn-aligned dialog/input/textarea/button components.
  Reason: Speed of first implementation slice.
  Resolution: Migrated form controls and removed raw task form fields from route-level UI.
  Follow-up task: Maintain policy for future components and review additions against design constraints.

- Date: 2026-07-04
  Area: Component decomposition
  Expected: Board should be split into reusable, testable components.
  Actual: Board UI is split into board, swimlane, task-card, task-dialog, and filter-panel components.
  Reason: Initial vertical slice prioritized end-to-end behavior over modularity.
  Resolution: Route now primarily handles data wiring while feature UI is componentized.
  Follow-up task: Add component-level tests for extracted board modules.

- Date: 2026-07-04
  Area: Dark mode standard
  Expected: Dark mode implemented per shadcn TanStack Start documentation.
  Actual: ThemeProvider with ScriptOnce is wired in root shell, suppressHydrationWarning is enabled, and a user-facing mode toggle is available.
  Reason: Dark mode setup has not been implemented yet.
  Resolution: Implemented documentation-based theme provider wiring and mode toggle.
  Follow-up task: Complete manual verification for hydration behavior and theme persistence across reloads.

- Date: 2026-07-04
  Area: Filter interaction model
  Expected: Filters should be single-select, and clicking the active filter should clear it.
  Actual: Filter toggles are now exclusive, and active filter click resets filter state.
  Reason: Earlier implementation used independent multi-select toggles.
  Resolution: Added single-select filter state transition logic and integration coverage for interaction flow.
  Follow-up task: Complete manual verification for overdue/today correctness against real board data.
