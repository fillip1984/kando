import { describe, expect, it } from "vitest"

import type { TaskSummaryType } from "@/server/functions/todos"

import {
  applyTaskEditLocally,
  createMoveUpdate,
  createUpdateTaskInput,
} from "./task-mutations"

function createTask(partial: {
  id: string
  title: string
  status: "todo" | "in_progress" | "blocked" | "done"
  position: number
  description?: string | null
  dueDate?: Date | null
}): TaskSummaryType {
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? null,
    dueDate: partial.dueDate ?? null,
    status: partial.status,
    position: partial.position,
    createdAt: new Date("2026-07-04T00:00:00.000Z"),
    updatedAt: new Date("2026-07-04T00:00:00.000Z"),
  }
}

describe("task mutations", () => {
  it("applies edit updates immediately to local board state", () => {
    const tasks = [
      createTask({ id: "1", title: "Alpha", status: "todo", position: 0 }),
      createTask({ id: "2", title: "Beta", status: "blocked", position: 0 }),
    ]

    const dueDate = new Date("2026-07-05T00:00:00.000Z")
    const next = applyTaskEditLocally(tasks, "1", {
      title: "Alpha Updated",
      description: "Updated description",
      dueDate,
      status: "in_progress",
    })

    expect(next[0]).toMatchObject({
      title: "Alpha Updated",
      description: "Updated description",
      dueDate,
      status: "in_progress",
    })
  })

  it("creates persistence payload for edit updates", () => {
    const dueDate = new Date("2026-07-06T00:00:00.000Z")

    expect(
      createUpdateTaskInput("task-1", 3, {
        title: "Persisted",
        description: null,
        dueDate,
        status: "done",
      })
    ).toEqual({
      id: "task-1",
      title: "Persisted",
      description: null,
      dueDate,
      status: "done",
      position: 3,
    })
  })

  it("creates local + persistence move updates for drag-and-drop", () => {
    const tasks = [
      createTask({ id: "a", title: "A", status: "todo", position: 0 }),
      createTask({ id: "b", title: "B", status: "blocked", position: 0 }),
      createTask({ id: "c", title: "C", status: "blocked", position: 1 }),
    ]

    const move = createMoveUpdate(tasks, "a", "blocked")
    expect(move).toBeTruthy()

    expect(move?.moveInput).toEqual({
      id: "a",
      status: "blocked",
      position: 2,
    })

    expect(move?.nextTasks.find((task) => task.id === "a")).toMatchObject({
      status: "blocked",
      position: 2,
    })
  })
})
