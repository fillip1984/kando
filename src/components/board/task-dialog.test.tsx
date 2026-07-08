// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { TaskSummaryType } from "@/server/functions/todos"

import { TaskDialog } from "./task-dialog"

const mockCloseTaskDialog = vi.fn()
const mockInvalidate = vi.fn()
const mockServerFn = vi.fn().mockResolvedValue(undefined)

vi.mock("@/server/stores/task-store", () => ({
  useTaskStore: () => ({
    closeTaskDialog: mockCloseTaskDialog,
  }),
}))

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    invalidate: mockInvalidate,
  }),
}))

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const actual = await importOriginal()
  const typedActual = actual as Record<string, unknown>
  return {
    ...typedActual,
    useServerFn: () => mockServerFn,
  }
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  vi.clearAllMocks()
})

function createTask(partial: Partial<TaskSummaryType>): TaskSummaryType {
  return {
    id: "task-1",
    title: "",
    description: null,
    dueDate: null,
    status: "todo",
    priority: null,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  }
}

describe("TaskDialog", () => {
  it("renders create mode and submits create payload", async () => {
    const task = createTask({
      id: "new",
      title: "New task",
      status: "todo",
      dueDate: "",
      priority: null,
    })

    render(<TaskDialog open task={task} />)

    expect(screen.getByRole("heading", { name: "Create Task" })).toBeDefined()
    fireEvent.click(screen.getByRole("button", { name: "Create Task" }))

    await waitFor(() => {
      expect(mockServerFn).toHaveBeenCalledTimes(1)
    })
    expect(mockServerFn).toHaveBeenCalledWith({
      data: {
        title: "New task",
        description: null,
        dueDate: "",
        status: "todo",
        priority: null,
        position: 0,
      },
    })
    expect(mockCloseTaskDialog).toHaveBeenCalledTimes(1)
    expect(mockInvalidate).toHaveBeenCalledTimes(1)
  })

  it("renders edit mode with prefilled values", () => {
    const task = createTask({
      id: "task-9",
      title: "Existing title",
      description: "Existing description",
      dueDate: "2026-07-04",
      status: "blocked",
      priority: "urgent",
    })

    render(<TaskDialog open task={task} />)

    expect(screen.getByRole("heading", { name: "Edit Task" })).toBeDefined()
    expect(screen.getByDisplayValue("Existing title")).toBeDefined()
    expect(screen.getByDisplayValue("Existing description")).toBeDefined()
    expect(screen.getByDisplayValue("2026-07-04")).toBeDefined()
  })

  it("renders compact fields without standalone labels", () => {
    const task = createTask({ id: "new", status: "todo" })

    render(<TaskDialog open task={task} />)

    expect(screen.queryByText("Title")).toBeNull()
    expect(screen.queryByText("Description")).toBeNull()
    expect(screen.queryByText("Due Date")).toBeNull()
    expect(screen.queryByText("Status")).toBeNull()
    expect(screen.getByPlaceholderText("Task title")).toBeDefined()
    expect(screen.getByPlaceholderText("Description (optional)")).toBeDefined()
    expect(screen.getByTestId("title-icon")).toBeDefined()
  })

  it("clears due date through date picker inline clear control", () => {
    const task = createTask({
      id: "task-9",
      title: "Existing title",
      status: "blocked",
      dueDate: "2026-07-04",
    })

    render(<TaskDialog open task={task} />)

    expect(screen.getByDisplayValue("2026-07-04")).toBeDefined()
    const clearButton = screen.getByTestId("date-clear-icon").closest("button")
    expect(clearButton).toBeTruthy()
    fireEvent.click(clearButton as Element)

    expect(screen.queryByDisplayValue("2026-07-04")).toBeNull()
  })

  it("renders dropdown icons in inline-start addon and keeps combobox width visible", () => {
    const task = createTask({
      id: "task-9",
      title: "Existing title",
      status: "todo",
      priority: "important",
    })

    render(<TaskDialog open task={task} />)

    const statusIcon = screen.getByTestId("status-icon")
    const priorityIcon = screen.getByTestId("priority-field-icon")

    const statusAddon = statusIcon.closest('[data-slot="input-group-addon"]')
    const priorityAddon = priorityIcon.closest(
      '[data-slot="input-group-addon"]'
    )

    expect(statusAddon?.getAttribute("data-align")).toBe("inline-start")
    expect(priorityAddon?.getAttribute("data-align")).toBe("inline-start")

    const statusGroup = screen
      .getByRole("combobox", { name: "Open status options" })
      .closest('[data-slot="input-group"]')
    expect(statusGroup?.className).toContain("w-auto")
    expect(statusGroup?.className).toContain("shrink-0")
  })

  it("updates status and clears priority through combobox selectors before submit", async () => {
    const task = createTask({
      id: "task-1",
      title: "Existing title",
      status: "blocked",
      priority: "important",
    })

    render(<TaskDialog open task={task} />)

    const statusInput = screen.getByRole("combobox", {
      name: "Open status options",
    })
    const statusGroup = statusInput.closest('[data-slot="input-group"]')
    const statusTriggerButton = statusGroup?.querySelector(
      '[data-slot="input-group-button"]'
    )
    expect(statusTriggerButton).toBeTruthy()
    fireEvent.click(statusTriggerButton as Element)
    fireEvent.click(screen.getByRole("option", { name: "Done" }))

    const priorityInput = screen.getByRole("combobox", {
      name: "Open priority options",
    })
    const priorityGroup = priorityInput.closest('[data-slot="input-group"]')
    const priorityTriggerButton = priorityGroup?.querySelector(
      '[data-slot="input-group-button"]'
    )
    expect(priorityTriggerButton).toBeTruthy()
    const clearPriorityButton = priorityGroup?.querySelector(
      '[data-slot="combobox-clear"]'
    )
    expect(clearPriorityButton).toBeTruthy()
    fireEvent.click(clearPriorityButton as Element)

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    await waitFor(() => {
      expect(mockServerFn).toHaveBeenCalled()
    })
    expect(mockServerFn).toHaveBeenCalledWith({
      data: expect.objectContaining({
        id: "task-1",
        status: "done",
        priority: null,
      }),
    })
  })
})
