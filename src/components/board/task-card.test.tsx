// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import type { TaskSummaryType } from "@/server/functions/todos"

import { TaskCard } from "./task-card"

const mockOpenTaskDialog = vi.fn()
const mockOpenDeleteTaskConfirmation = vi.fn()

vi.mock("@/server/stores/task-store", () => ({
  useTaskStore: () => ({
    openTaskDialog: mockOpenTaskDialog,
    openDeleteTaskConfirmation: mockOpenDeleteTaskConfirmation,
  }),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function createTask(): TaskSummaryType {
  return {
    id: "task-1",
    title: "Sample task",
    description: "Details",
    status: "todo",
    dueDate: "2026-07-05",
    priority: "urgent",
    position: 0,
  } as TaskSummaryType
}

describe("TaskCard interactions", () => {
  it("renders due date and priority badges with icon indicators", () => {
    render(<TaskCard task={createTask()} />)

    expect(screen.getByLabelText("Due date 2026-07-05")).toBeDefined()
    expect(screen.getByTestId("due-date-icon")).toBeDefined()
    expect(screen.getByLabelText("Priority urgent")).toBeDefined()
    expect(screen.getByTestId("priority-icon")).toBeDefined()
  })

  it("does not render a priority badge when priority is null", () => {
    const task = createTask()
    task.priority = null

    render(<TaskCard task={task} />)

    expect(screen.queryByTestId("priority-icon")).toBeNull()
  })

  it("does not render a due-date badge when due date is missing", () => {
    const task = createTask()
    task.dueDate = null

    render(<TaskCard task={task} />)

    expect(screen.queryByTestId("due-date-icon")).toBeNull()
  })

  it("opens edit when task card surface is clicked", () => {
    const task = createTask()
    render(<TaskCard task={task} />)

    fireEvent.click(screen.getByText("Sample task"))

    expect(mockOpenTaskDialog).toHaveBeenCalledTimes(1)
    expect(mockOpenTaskDialog).toHaveBeenCalledWith({ mode: "edit", task })
  })

  it("triggers delete request without opening edit when trash icon is clicked", () => {
    const task = createTask()
    render(<TaskCard task={task} />)

    const deleteButton = screen.getByRole("button", { name: "Delete task" })
    fireEvent.click(deleteButton)

    expect(mockOpenDeleteTaskConfirmation).toHaveBeenCalledTimes(1)
    expect(mockOpenDeleteTaskConfirmation).toHaveBeenCalledWith(task)
    expect(mockOpenTaskDialog).not.toHaveBeenCalled()
  })
})
