// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { TaskSummaryType } from "@/server/functions/todos"
import { Swimlanes } from "@/server/functions/todos"

import { KanbanBoard } from "./kanban-board"

const mockOpenTaskDialog = vi.fn()
const mockOpenDeleteTaskConfirmation = vi.fn()
const mockSetTasksShownCount = vi.fn()

vi.mock("@/server/stores/task-store", () => ({
  useTaskStore: () => ({
    taskFilter: null,
    setTasksShownCount: mockSetTasksShownCount,
    openTaskDialog: mockOpenTaskDialog,
    openDeleteTaskConfirmation: mockOpenDeleteTaskConfirmation,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("KanbanBoard integration", () => {
  it("wires each swimlane create button to its lane and keeps create action in anchored lane layout", () => {
    render(<KanbanBoard tasks={[]} />)

    const addButtons = screen.getAllByRole("button", { name: "Add Task" })
    expect(addButtons).toHaveLength(4)

    for (const button of addButtons) {
      const laneContainer = button.closest("article")
      expect(laneContainer?.className).toContain("flex")
      expect(laneContainer?.className).toContain("flex-col")
      expect(
        laneContainer?.querySelector(".grid.flex-1.content-start.gap-2")
      ).toBeTruthy()
    }

    for (const button of addButtons) {
      fireEvent.click(button)
    }

    expect(
      mockOpenTaskDialog.mock.calls.map((call) => call[0].status)
    ).toEqual(Swimlanes)
    expect(mockSetTasksShownCount).toHaveBeenCalledWith(0)
  })

  it("opens edit on card click and routes delete to confirmation", () => {
    const task: TaskSummaryType = {
      id: "task-1",
      title: "Sample Task",
      description: "Details",
      status: "todo",
      dueDate: "2026-07-05",
      priority: "important",
      position: 0,
    } as TaskSummaryType

    render(<KanbanBoard tasks={[task]} />)

    fireEvent.click(screen.getByText("Sample Task"))
    expect(mockOpenTaskDialog).toHaveBeenCalledTimes(1)
    expect(mockOpenTaskDialog).toHaveBeenCalledWith({ mode: "edit", task })

    const card = screen.getByText("Sample Task").closest('[draggable="true"]')
    expect(card).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Delete task" }))

    expect(mockOpenDeleteTaskConfirmation).toHaveBeenCalledTimes(1)
    expect(mockOpenDeleteTaskConfirmation).toHaveBeenCalledWith(task)
    expect(mockSetTasksShownCount).toHaveBeenCalledWith(1)
  })
})
