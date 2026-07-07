import { create } from "zustand"

// export type TaskState = {
//   overdue: boolean
//   today: boolean
//   doneRecently: boolean
//   blockedOnly: boolean
//   noDueDate: boolean
// }

// export const emptyTaskState: TaskState = {
//   overdue: false,
//   today: false,
//   doneRecently: false,
//   blockedOnly: false,
//   noDueDate: false,
// }

// type TaskStore = {
//   filters: TaskState
//   toggleFilter: (key: keyof TaskState) => void
//   resetFilters: () => void
// }

type TaskFilterOption =
  "overdue" | "today" | "doneRecently" | "blockedOnly" | "noDueDate"

type TaskStore = {
  taskFilter: TaskFilterOption | null
  toggleFilter: (value: TaskFilterOption) => void
  resetFilters: () => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  taskFilter: null,
  toggleFilter: (value: TaskFilterOption) => {
    set((state) => ({ taskFilter: state.taskFilter === value ? null : value }))
  },
  resetFilters: () => {
    set((state) => ({ taskFilter: null }))
  },
}))
