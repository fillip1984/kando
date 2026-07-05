import type { TaskPriority, TaskStatus } from "@/server/functions/todos"

export type TaskFormState = {
  title: string
  description: string
  dueDate: string
  status: TaskStatus | ""
  priority: TaskPriority | ""
}

export function createTaskFormForLane(targetLane: TaskStatus): TaskFormState {
  return {
    title: "",
    description: "",
    dueDate: "",
    status: targetLane,
    priority: "",
  }
}
