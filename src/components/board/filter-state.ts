import type { FilterState } from "./filter-panel"

export function toggleSingleSelectFilter(
  current: FilterState,
  key: keyof FilterState
): FilterState {
  const isCurrentlyActive = current[key]

  if (isCurrentlyActive) {
    return {
      overdue: false,
      today: false,
      doneRecently: false,
      blockedOnly: false,
      noDueDate: false,
    }
  }

  return {
    overdue: key === "overdue",
    today: key === "today",
    doneRecently: key === "doneRecently",
    blockedOnly: key === "blockedOnly",
    noDueDate: key === "noDueDate",
  }
}
