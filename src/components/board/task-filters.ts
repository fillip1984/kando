import { isSameDay, startOfDay } from "date-fns"

export type TaskWithDueDateStatus = {
  status: string
  dueDate: unknown
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

export function isOverdue(task: TaskWithDueDateStatus, now: Date): boolean {
  if (task.status === "done") {
    return false
  }

  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  return dueDate < startOfDay(now)
}

export function isToday(task: TaskWithDueDateStatus, now: Date): boolean {
  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  return isSameDay(dueDate, now)
}
