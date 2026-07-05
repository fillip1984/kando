// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import type { TaskSummaryType } from "@/server/functions/todos"

import { TaskCard } from "./task-card"

afterEach(() => {
  cleanup()
})

function createTask(): TaskSummaryType {
  return {
    id: "task-1",
    title: "Sample task",
    description: "Details",
    status: "todo",
    dueDate: new Date(2026, 6, 5),
    priority: "urgent",
    position: 0,
  } as TaskSummaryType
}

describe("TaskCard interactions", () => {
  it("renders due date and priority badges with icon indicators", () => {
    render(
      <TaskCard
        task={createTask()}
        dueLabel="7/5/2026"
        isOverdue={false}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        onDragStart={vi.fn()}
        onDragEnd={vi.fn()}
      />
    )

    expect(screen.getByLabelText("Due date 7/5/2026")).toBeDefined()
    expect(screen.getByTestId("due-date-icon")).toBeDefined()
    expect(screen.getByLabelText("Priority urgent")).toBeDefined()
    expect(screen.getByTestId("priority-icon")).toBeDefined()
  })

  it("does not render a priority badge when priority is null", () => {
    const task = createTask()
    task.priority = null

    render(
      <TaskCard
        task={task}
        dueLabel="7/5/2026"
        isOverdue={false}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        onDragStart={vi.fn()}
        onDragEnd={vi.fn()}
      />
    )

    expect(screen.queryByTestId("priority-icon")).toBeNull()
  })

  it("opens edit when task card surface is clicked", () => {
    const onEdit = vi.fn()

    render(
      <TaskCard
        task={createTask()}
        dueLabel="7/5/2026"
        isOverdue={false}
        onEdit={onEdit}
        onRequestDelete={vi.fn()}
        onDragStart={vi.fn()}
        onDragEnd={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText("Sample task"))

    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it("triggers delete request without opening edit when trash icon is clicked", () => {
    const onEdit = vi.fn()
    const onRequestDelete = vi.fn()

    render(
      <TaskCard
        task={createTask()}
        dueLabel="7/5/2026"
        isOverdue={false}
        onEdit={onEdit}
        onRequestDelete={onRequestDelete}
        onDragStart={vi.fn()}
        onDragEnd={vi.fn()}
      />
    )

    const deleteButton = screen.getByRole("button", { name: "Delete task" })
    fireEvent.click(deleteButton)

    expect(onRequestDelete).toHaveBeenCalledTimes(1)
    expect(onEdit).not.toHaveBeenCalled()
  })
})
