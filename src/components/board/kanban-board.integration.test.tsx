// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"
import { Swimlanes } from "@/server/functions/todos"

import { KanbanBoard } from "./kanban-board"

const emptyTasksByLane: Record<TaskStatus, TaskSummaryType[]> = {
  todo: [],
  in_progress: [],
  blocked: [],
  done: [],
}

describe("KanbanBoard integration", () => {
  it("wires each swimlane create button to its lane and keeps create action in anchored lane layout", () => {
    const onOpenCreate = vi.fn()

    render(
      <KanbanBoard
        tasksByLane={emptyTasksByLane}
        onDropToLane={vi.fn()}
        onOpenCreate={onOpenCreate}
        onEditTask={vi.fn()}
        onRequestDeleteTask={vi.fn()}
        onDragStart={vi.fn()}
        onDragEnd={vi.fn()}
        getTaskDueLabel={() => "No due date"}
        isTaskOverdue={() => false}
      />
    )

    const addButtons = screen.getAllByRole("button", { name: "Add Task" })
    expect(addButtons).toHaveLength(4)

    for (const button of addButtons) {
      const laneContainer = button.closest("article")
      expect(laneContainer?.className).toContain("flex")
      expect(laneContainer?.className).toContain("flex-col")
      expect(laneContainer?.className).toContain("min-h-80")
      expect(
        laneContainer?.querySelector(".grid.flex-1.content-start.gap-2")
      ).toBeTruthy()
    }

    for (const button of addButtons) {
      fireEvent.click(button)
    }

    expect(onOpenCreate.mock.calls.map((call) => call[0])).toEqual(Swimlanes)
  })
})
