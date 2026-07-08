import type { TaskType } from "@/server/functions/todos"
import { differenceInCalendarDays, isSameDay, startOfDay } from "date-fns"

type TaskDateFilterInput = {
  status: TaskType["status"]
  dueDate: TaskType["dueDate"] | Date
}

export function parseDueDate(value: unknown): Date | null {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export function isOverdue(task: TaskDateFilterInput, now: Date): boolean {
  if (task.status === "done") {
    return false
  }

  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  return dueDate < startOfDay(now)
}

export function isToday(task: TaskDateFilterInput, now: Date): boolean {
  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  return isSameDay(dueDate, now)
}

export function isDoneRecently(
  task: TaskDateFilterInput,
  now: Date,
  recentDays = 7
): boolean {
  if (task.status !== "done") {
    return false
  }

  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  const daysSinceDue = differenceInCalendarDays(
    startOfDay(now),
    startOfDay(dueDate)
  )

  return daysSinceDue >= 0 && daysSinceDue <= recentDays
}

export const filterTasks = ({
  tasks,
  taskFilter,
  now,
}: {
  tasks: TaskType[]
  taskFilter: string | null
  now: Date
}) => {
  return tasks.filter((task) => {
    if (taskFilter === "overdue" && !isOverdue(task, now)) {
      return false
    }

    if (taskFilter === "today" && !isToday(task, now)) {
      return false
    }

    if (taskFilter === "doneRecently" && !isDoneRecently(task, now)) {
      return false
    }

    if (taskFilter === "blockedOnly" && task.status !== "blocked") {
      return false
    }

    if (taskFilter === "noDueDate" && parseDueDate(task.dueDate) !== null) {
      return false
    }

    return true
  })
}
