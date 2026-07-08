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
- [x] Manual verification
- [x] Verify create-task buttons stay pinned to the bottom of each swimlane on desktop and mobile layouts.
- [x] Verify create mode and edit mode both use the same task dialog component.
- [x] Verify task edit updates persist and immediately reflect on the board.
- [x] Verify task create from each swimlane defaults to that swimlane status.
- [x] Verify all new task form controls are shadcn components and no custom wrappers were introduced without approval.
- [x] Verify shadcn components were added via CLI workflow (for example: `pnpx shadcn@latest add ...`) and not manually scaffolded.
- [x] Verify dark mode follows shadcn TanStack Start docs (hydration-safe, light/dark/system toggle).
- [x] Verify `.vscode/settings.json` enforces format on save.
- [x] Verify `.vscode/settings.json` sets Prettier as default formatter.
- [x] Verify `.vscode/extensions.json` includes recommended project extensions for setup.
- [x] Verify overdue filter excludes done tasks and includes dueDate before today.
- [x] Verify today filter only includes tasks due on current date.
- [x] Verify filter behavior is single-select: enabling one filter disables the previous one, and clicking the active filter toggles it off.
- [x] Verify drag-and-drop status changes persist across refresh.
- [x] Verify package and CLI commands use `pnpm`/`pnpx` and not `npm`/`npx` in task and validation notes.
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test`

## Spec Drift Log Addendum (2026-07-07)

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

- Date: 2026-07-05
  Area: Task edit trigger interaction
  Expected: Editing a task should be initiated by clicking the task card surface.
  Actual: Editing is currently initiated by a dedicated edit icon button on the task card.
  Reason: Earlier interaction model used explicit edit affordance and did not require full-card click behavior.
  Resolution: Specification updated to require card-click edit trigger; implementation update deferred.
  Follow-up task: Replace edit-icon-only trigger with card-click edit interaction and validate drag-and-click behavior coexistence.

- Date: 2026-07-05
  Area: Task deletion UX
  Expected: Task cards should show a visible trashcan icon, and deletion should require dialog confirmation.
  Actual: Task card deletion affordance and confirmation dialog flow are not implemented in the current board UI.
  Reason: Earlier slices prioritized create/edit, filtering, and drag-and-drop.
  Resolution: Specification updated to require delete affordance and confirmation; implementation update deferred.
  Follow-up task: Add visible task-card trash action, confirm dialog, and persisted delete flow.

- Date: 2026-07-05
  Area: Theme control placement
  Expected: Theme control should be placed under the app bar.
  Actual: Theme control is currently rendered in the header row, not under an app bar region.
  Reason: Earlier dark mode implementation prioritized adding a visible toggle without app-bar placement constraints.
  Resolution: Specification updated to require app-bar-adjacent placement; implementation update deferred.
  Follow-up task: Move theme control under app bar and verify layout behavior across desktop and mobile.

- Date: 2026-07-05
  Area: Date field component standard
  Expected: Date picking fields should use shadcn date picker-based picker interactions.
  Actual: Task due date input currently uses a native date input field.
  Reason: Initial task dialog implementation prioritized a minimal form control setup.
  Resolution: Design/spec updated to require shadcn date picker picker usage; implementation update deferred.
  Follow-up task: Replace native date input with shadcn date picker picker and validate create/edit flows.

- Date: 2026-07-05
  Area: Dropdown component preference
  Expected: Dropdown-style choices should prefer a combobox with clear option over select.
  Actual: Task dialog status now uses a combobox with clear option.
  Reason: Earlier implementation did not formalize a dropdown preference policy.
  Resolution: Implemented combobox-based status selection and clear action in task dialog.
  Follow-up task: Continue using combobox-with-clear for future dropdown-like fields.

- Date: 2026-07-05
  Area: Task dialog date picker dependency integrity
  Expected: Task dialog should render a shadcn date picker-based due-date field with valid `@/components/ui/*` imports.
  Actual: `task-dialog.tsx` imports `@/components/ui/calendar`, but that file is missing, causing compile/type errors.
  Reason: Date picker migration was partially applied after UI component removal, leaving unresolved imports.
  Resolution: Reopen date picker implementation and validation tasks; complete migration with an available shadcn-compatible date picker pattern and passing checks.
  Follow-up task: Implement a non-broken shadcn date picker flow in task dialog and rerun lint/typecheck/tests.

- Date: 2026-07-05
  Area: Task dialog date picker dependency integrity
  Expected: Task dialog should render a shadcn date picker-based due-date field with valid `@/components/ui/*` imports.
  Actual: Due date now uses a shadcn-style date picker pattern (button + popover + calendar) with valid UI wrappers.
  Reason: Missing UI dependency was restored and the dialog date field was migrated to a working date-picker interaction.
  Resolution: Added shadcn `calendar` and `popover` components through `pnpx`, updated task dialog, and validated with `pnpm typecheck`, `pnpm lint`, and `pnpm test`.
  Follow-up task: Keep date picker behavior covered when modifying task dialog inputs.

- Date: 2026-07-05
  Area: Combobox compact sizing validation
  Expected: Validation should enforce readable combobox sizing without coupling to stale class names.
  Actual: `task-dialog.tsx` now uses `shrink-0` sizing without `min-w-44`, but `task-dialog.test.tsx` still asserts `min-w-44`, causing a failing test.
  Reason: Recent compact layout edits changed sizing strategy while test assertions remained tied to a previous min-width utility class.
  Resolution: Reopen combobox visibility validation task to update test expectations to the current sizing contract.
  Follow-up task: Update combobox visibility tests to assert shrink-resistant/readable behavior without requiring `min-w-44`.

## Follow-up Tasks

- [x] Add the optional `done recently` filter described in the design doc.
- [x] Resolve the open question about whether overdue and today filters should include done tasks when the due date matches.
- [x] Decide whether task position should remain ordered per status column or be made globally ordered.
- [x] Add focused tests for any new filter behavior before shipping the next board iteration.
- [x] Implement task editing via task card click and preserve drag-and-drop usability.
- [x] Add integration coverage for task-card click-to-edit behavior.
- [x] Add a visible trashcan icon on each task card to initiate deletion.
- [x] Add a delete confirmation dialog and require confirmation before deletion mutation.
- [x] Add integration coverage for delete confirm and delete cancel behaviors.
- [x] Move theme mode control under the app bar.
- [x] Add validation coverage for theme control placement in responsive layouts.
- [x] Replace task due date native input with a shadcn date picker-based picker.
- [x] Add validation coverage for date picker date picking in create and edit dialogs.
- [x] Prefer combobox with clear option for future dropdown-like task fields instead of select.

## Spec-Derived Delivery Tasks (Next Slice)

### Implementation

- [x] Replace task-card edit-icon-only interaction with click-on-card edit behavior.
- [x] Ensure card click-to-edit does not interfere with drag-and-drop start and drop interactions.
- [x] Add a visible trashcan icon action to every task card.
- [x] Add a delete confirmation dialog that requires explicit confirm before deletion.
- [x] Wire delete confirmation to persisted deletion via existing server mutation flow.
- [x] Move theme mode control under the app bar region in the board layout.
- [x] Replace due-date native input with shadcn date picker picker in task dialog.
- [x] Maintain create and edit dialog parity after date picker migration.
- [x] Introduce combobox-with-clear pattern for dropdown-like choice fields when a dropdown control is needed.

### Validation

- [x] Add integration tests for task-card click-to-edit behavior.
- [x] Add interaction tests proving drag-and-drop still works after card-click edit change.
- [x] Add integration tests for delete confirmation confirm path (task removed and persisted).
- [x] Add integration tests for delete confirmation cancel path (task unchanged).
- [x] Add responsive layout checks for theme control placement under app bar.
- [x] Add create/edit dialog tests for date picker date selection and clearing behavior.
- [x] Verify lint, typecheck, and tests pass after the slice (`pnpm lint`, `pnpm typecheck`, `pnpm test`).

## Reopened Tasks (2026-07-05)

### Implementation

- [x] Re-implement due date input with a working shadcn date picker pattern in `task-dialog.tsx` without broken UI imports.
- [x] Ensure date picker implementation uses only supported `@/components/ui/*` wrappers and matches the current spec wording.

### Validation

- [x] Run `pnpm typecheck` and confirm no unresolved UI imports.
- [x] Run `pnpm lint` and resolve any task-dialog-related issues.
- [x] Run `pnpm test` (or focused task dialog tests) to confirm date selection and clear behavior still pass.

## Application-Specific Priority Tasks (2026-07-05)

### Implementation

- [x] Add nullable `priority` field support across todo data contracts.
- [x] Constrain priority values to `important`, `urgent`, and `frantic` when present.
- [x] Extend create/edit task dialog flows to set and clear priority.

### Validation

- [x] Add tests covering null priority and each allowed priority value.
- [x] Verify create and edit mutations persist priority correctly.
- [x] Verify `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass after priority implementation.

## Task Card Metadata Badge Tasks (2026-07-05)

### Implementation

- [x] Render due date metadata on task cards using shadcn badge components.
- [x] Render priority metadata on task cards using shadcn badge components when priority is set.
- [x] Use icons (not text labels such as "Due" or "Priority") to indicate badge meaning.

### Validation

- [x] Add task-card tests verifying due date badge rendering with icon indicators.
- [x] Add task-card tests verifying priority badge rendering with icon indicators and null-priority behavior.
- [x] Verify `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass after task-card badge implementation.

## Task Card Due Date Badge Visibility Tasks (2026-07-05)

### Implementation

- [x] Update task-card rendering to omit the due-date badge when `dueDate` is null/empty.

### Validation

- [x] Add task-card tests verifying no due-date badge is rendered when due date is missing.

## Dropdown Icon Placement Tasks (2026-07-05)

### Implementation

- [x] Ensure dropdown input-group icons are rendered at the front (inline-start) of controls.

### Validation

- [x] Add or update tests verifying dropdown icon placement is inline-start for compact dropdown controls.

## Combobox Visibility Tasks (2026-07-05)

### Implementation

- [x] Ensure combobox controls do not shrink excessively in task-dialog and related compact layouts.
- [x] Ensure selected combobox values remain fully visible where practical.

### Validation

- [x] Add or update tests verifying combobox selected values remain visible under normal layout widths.

## Task Dialog Title Icon Tasks (2026-07-05)

### Implementation

- [x] Ensure task-dialog title input uses a title icon as the semantic field indicator.

### Validation

- [x] Add or update task-dialog tests verifying title input icon is the expected title icon.

## Task Dialog Compactness Tasks (2026-07-05)

### Implementation

- [x] Refactor task dialog inputs to a compact layout without standalone text labels.
- [x] Use placeholders and/or icon input groups to communicate field meaning in task dialog.
- [x] Preserve create/edit behavior parity and field accessibility while adopting compact patterns.

### Validation

- [x] Add task-dialog tests covering compact placeholder/icon-driven field rendering.
- [x] Verify task dialog interactions (create/edit, clear actions, submit rules) still work after compact layout updates.
- [x] Verify `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass after compact task-dialog implementation.

## Date Picker Clear Affordance Tasks (2026-07-05)

### Implementation

- [x] Add inline `span` `X` clear affordance inside date-picker display controls.
- [x] Add inline `X` clear affordance inside date-picker display controls.
- [x] Align date-picker clear behavior with combobox clear interaction patterns.

### Validation

- [x] Add tests validating date picker clear behavior via inline `X` affordance.
- [x] Verify `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass after date picker clear-affordance updates.
- [x] Verify date-picker clear affordance uses lucide `X` icon.

## Refactor Drift Tasks (2026-07-07)

### Implementation

- [x] Align board/dialog tests to the refactored store-driven component contracts.
- [x] Update task-card tests to use schema-aligned `dueDate` string values instead of `Date` objects.
- [x] Update spec/design language for date-picker clear controls from `span`-specific wording to clear-control wording.
- [ ] Reintroduce drag-and-drop lane-move persistence (`moveTaskFn`) in board/task-card interactions.

### Validation

- [x] Verify `pnpm test` passes after test-contract alignment.
- [ ] Add/update integration coverage for persisted drag-and-drop lane movement once restored.

## Spec Drift Log

- Date: 2026-07-07
  Area: Component contract refactor
  Expected: Board/task dialogs and tests used prop-driven callback contracts.
  Actual: Components now use shared Zustand store actions plus direct server-function hooks.
  Reason: Manual refactor centralized UI orchestration to reduce prop drilling.
  Resolution: Updated tests to mock/store-drive interactions and validate mutation payload behavior.
  Follow-up task: Keep new component tests aligned with store contracts when evolving UI behavior.

- Date: 2026-07-07
  Area: Task card dueDate test fixtures
  Expected: Tests previously passed `Date` objects for due-date display assertions.
  Actual: Data contracts use `string | null` dueDate values from server schema.
  Reason: Refactor tightened schema alignment and exposed stale fixtures.
  Resolution: Updated tests to use string due-date fixtures and current badge labels.
  Follow-up task: Avoid non-schema fixture types in component tests.

- Date: 2026-07-07
  Area: Drag-and-drop persistence
  Expected: Dragging cards between lanes updates/persists status and ordering.
  Actual: Cards remain draggable, but drag/drop mutation wiring is currently deferred.
  Reason: Refactor prioritized dialog/store cleanup and test recovery first.
  Resolution: Reopened drag/drop persistence task for a follow-up implementation slice.
  Follow-up task: Restore lane drop handlers and `moveTaskFn` persistence with integration coverage.

## Due-Date Icon Consistency Tasks (2026-07-05)

### Implementation

- [x] Synchronize task-card due-date badge icon with task-dialog due-date field icon.

### Validation

- [x] Verify due-date icon consistency in task-dialog and task-card rendering/tests.

## Styled Date Picker Standardization Tasks (2026-07-05)

### Implementation

- [x] Add spec/design policy requiring the shared styled date-picker component for future date-picker usage.

### Validation

- [x] Verify `SPEC.md` and `DESIGN.md` both reference the shared styled date-picker standard.

## Styled Date Picker Follow-up Tasks (2026-07-05)

### Implementation

- [ ] Fix styled date-picker placeholder visibility when no date is selected.

### Validation

- [ ] Add or update tests to verify placeholder text is visible in the empty styled date-picker state.

## Spec Drift Tasks (2026-07-05)

### Implementation

- [x] Replace task-dialog dropdown-menu controls for status and priority with combobox-with-clear controls per spec preference.
- [x] Preserve current compact/icon-led dialog behavior while migrating status and priority controls to combobox interactions.
- [ ] Resolve schema rollout drift by fixing the failed `pnpm db:push` path for the new nullable `priority` column.

### Validation

- [x] Add or update task-dialog tests to validate combobox-with-clear behavior for status and priority.
- [ ] Verify migration or push path applies `priority` schema changes successfully in the target database. (Deferred: user requested skipping db push checks in this pass.)
- [x] Verify `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass after drift remediation changes.
