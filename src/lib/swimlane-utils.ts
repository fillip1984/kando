import type { TaskType } from "@/server/functions/todos"
import type { TodoStatusEnum } from "./enum-values"

export const buildSwimlanes = (
  tasks: TaskType[]
): Record<TodoStatusEnum, TaskType[]> => {
  const swimlanes: Record<TodoStatusEnum, TaskType[]> = {
    Todo: [],
    "In Progress": [],
    Blocked: [],
    Done: [],
  }
  tasks.forEach((task) => {
    swimlanes[task.status].push(task)
  })
  return swimlanes
}
