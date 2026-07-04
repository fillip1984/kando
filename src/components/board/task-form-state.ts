import type { TaskStatus } from "@/server/functions/todos"

export type TaskFormState = {
  title: string
  description: string
  dueDate: string
  status: TaskStatus
}

export function createTaskFormForLane(targetLane: TaskStatus): TaskFormState {
  return {
    title: "",
    description: "",
    dueDate: "",
    status: targetLane,
  }
}
