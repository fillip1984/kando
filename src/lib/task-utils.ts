import type { TaskType } from "@/server/functions/todos"
import {
  differenceInCalendarDays,
  isToday,
  isValid,
  parse,
  startOfDay,
} from "date-fns"

type TaskDateFilterInput = {
  status: TaskType["status"]
  dueDate: TaskType["dueDate"] | Date
}

export function parseDueDate(value: unknown): Date | null {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const stringValue = String(value)

  // Parse date-only values explicitly as local dates to avoid UTC shifts.
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    const parsedDateOnly = parse(stringValue, "yyyy-MM-dd", new Date())
    return isValid(parsedDateOnly) ? parsedDateOnly : null
  }

  const parsed = new Date(stringValue)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function isOverdue(task: TaskDateFilterInput, now: Date): boolean {
  if (task.status === "Done") {
    return false
  }

  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  if (isToday(dueDate)) {
    return false
  }

  return dueDate < startOfDay(now)
}

export function isDoneRecently(
  task: TaskDateFilterInput,
  now: Date,
  recentDays = 7
): boolean {
  if (task.status !== "Done") {
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
