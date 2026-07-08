// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeleteTaskDialog } from "./delete-task-dialog"

const mockCloseDeleteTaskConfirmation = vi.fn()
const mockDeleteTask = vi.fn().mockResolvedValue(undefined)
const mockInvalidate = vi.fn()

vi.mock("@/server/stores/task-store", () => ({
  useTaskStore: () => ({
    closeDeleteTaskConfirmation: mockCloseDeleteTaskConfirmation,
  }),
}))

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    invalidate: mockInvalidate,
  }),
}))

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-start")>()
  return {
    ...actual,
    useServerFn: () => mockDeleteTask,
  }
})

function createTask() {
  return {
    id: "task-1",
    title: "Task to delete",
    description: null,
    status: "todo",
    dueDate: null,
    priority: null,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("DeleteTaskDialog", () => {
  it("calls delete server function when delete is confirmed", async () => {
    const task = createTask()

    render(<DeleteTaskDialog open task={task} />)

    fireEvent.click(screen.getByRole("button", { name: "Delete" }))

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith({ data: { id: task.id } })
    })
    expect(mockCloseDeleteTaskConfirmation).toHaveBeenCalledTimes(1)
    expect(mockInvalidate).toHaveBeenCalledTimes(1)
  })

  it("closes confirmation and does not call delete when cancel is clicked", () => {
    render(<DeleteTaskDialog open task={createTask()} />)

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(mockCloseDeleteTaskConfirmation).toHaveBeenCalledTimes(1)
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })
})
