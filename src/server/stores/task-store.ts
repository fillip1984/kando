import { create } from "zustand"
import type { TaskStatus, TaskSummaryType } from "../functions/todos"

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

type State = {
  taskFilter: TaskFilterOption | null
  tasksShownCount: number
  currentTask: TaskSummaryType | null
  isDeleteTaskConfirmationOpen: boolean
  isTaskDialogOpen: boolean
}

type Action = {
  toggleFilter: (value: TaskFilterOption) => void
  resetFilters: () => void
  setTasksShownCount: (count: number) => void
  openDeleteTaskConfirmation: (task: TaskSummaryType) => void
  closeDeleteTaskConfirmation: () => void
  openTaskDialog: ({
    mode,
    status,
    position,
    task,
  }:
    | {
        mode: "create"
        status?: TaskStatus
        position?: number
        task?: never
      }
    | {
        mode: "edit"
        task: TaskSummaryType
        status?: never
        position?: never
      }) => void
  closeTaskDialog: () => void
}

export const useTaskStore = create<State & Action>((set) => ({
  taskFilter: null,
  tasksShownCount: 0,
  currentTask: null,
  isDeleteTaskConfirmationOpen: false,
  isTaskDialogOpen: false,
  toggleFilter: (value: TaskFilterOption) => {
    set((state) => ({ taskFilter: state.taskFilter === value ? null : value }))
  },
  resetFilters: () => {
    set(() => ({ taskFilter: null }))
  },
  setTasksShownCount: (count: number) => {
    set(() => ({ tasksShownCount: count }))
  },
  openDeleteTaskConfirmation: (task: TaskSummaryType) => {
    set({ isDeleteTaskConfirmationOpen: true, currentTask: task })
  },
  closeDeleteTaskConfirmation: () => {
    set({ isDeleteTaskConfirmationOpen: false, currentTask: null })
  },
  openTaskDialog: (
    {
      mode,
      status,
      position,
      task,
    }:
      | {
          mode: "create"
          status?: TaskStatus
          position?: number
          task?: never
        }
      | {
          mode: "edit"
          task: TaskSummaryType
          status?: never
          position?: never
        }
    // mode: "create" | "edit"
    // status?: TaskStatus
    // position?: number
    // task?: TaskSummaryType
  ) => {
    set({
      isTaskDialogOpen: true,
      currentTask:
        mode === "edit"
          ? task
          : {
              position: position ?? 9999,
              status: status ?? "todo",
              title: "",
              description: "",
              dueDate: null,
              priority: null,
              // TODO: make it so we don't have to fake this
              id: "new",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
    })
  },
  closeTaskDialog: () => {
    set({ isTaskDialogOpen: false, currentTask: null })
  },
}))
