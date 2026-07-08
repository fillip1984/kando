import { describe, expect, it } from "vitest"

import { isDoneRecently, isOverdue, isToday } from "./task-filters"

describe("task filter date rules", () => {
  it("overdue excludes done tasks and includes tasks due before today", () => {
    const now = new Date(2026, 6, 4, 12, 0, 0)
    const yesterday = new Date(2026, 6, 3, 9, 0, 0)

    expect(isOverdue({ status: "done", dueDate: yesterday }, now)).toBe(false)
    expect(isOverdue({ status: "todo", dueDate: yesterday }, now)).toBe(true)
    expect(isOverdue({ status: "todo", dueDate: now }, now)).toBe(false)
    expect(isOverdue({ status: "todo", dueDate: null }, now)).toBe(false)
  })

  it("today matches only tasks due on the current date", () => {
    const now = new Date(2026, 6, 4, 12, 0, 0)
    const todayMorning = new Date(2026, 6, 4, 8, 30, 0)
    const tomorrow = new Date(2026, 6, 5, 8, 30, 0)

    expect(isToday({ status: "todo", dueDate: todayMorning }, now)).toBe(true)
    expect(isToday({ status: "todo", dueDate: tomorrow }, now)).toBe(false)
    expect(isToday({ status: "todo", dueDate: null }, now)).toBe(false)
  })

  it("done recently matches only completed tasks with due dates in the recent window", () => {
    const now = new Date(2026, 6, 10, 12, 0, 0)
    const withinWindow = new Date(2026, 6, 4, 10, 0, 0)
    const outsideWindow = new Date(2026, 5, 30, 10, 0, 0)

    expect(
      isDoneRecently({ status: "done", dueDate: withinWindow }, now)
    ).toBe(true)
    expect(
      isDoneRecently({ status: "done", dueDate: outsideWindow }, now)
    ).toBe(false)
    expect(
      isDoneRecently({ status: "todo", dueDate: withinWindow }, now)
    ).toBe(false)
    expect(isDoneRecently({ status: "done", dueDate: null }, now)).toBe(false)
  })
})
