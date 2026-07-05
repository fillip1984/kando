// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { TaskDialog } from "./task-dialog"

afterEach(() => {
  cleanup()
})

function createBaseProps() {
  return {
    open: true,
    mode: "create" as const,
    title: "",
    description: "",
    dueDate: "",
    status: "todo" as const,
    priority: "" as const,
    saving: false,
    onOpenChange: vi.fn(),
    onTitleChange: vi.fn(),
    onDescriptionChange: vi.fn(),
    onDueDateChange: vi.fn(),
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onSubmit: vi.fn(),
  }
}

describe("TaskDialog", () => {
  it("renders create mode and triggers submit", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} title="New task" />)

    expect(screen.getByRole("heading", { name: "Create Task" })).toBeDefined()
    fireEvent.click(screen.getByRole("button", { name: "Create Task" }))

    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it("renders edit mode with prefilled values", () => {
    const props = createBaseProps()

    render(
      <TaskDialog
        {...props}
        mode="edit"
        title="Existing title"
        description="Existing description"
        dueDate="2026-07-04"
        status="blocked"
        priority="urgent"
      />
    )

    expect(screen.getByRole("heading", { name: "Edit Task" })).toBeDefined()
    expect(screen.getByDisplayValue("Existing title")).toBeDefined()
    expect(screen.getByDisplayValue("Existing description")).toBeDefined()
    expect(screen.getByLabelText("Clear due date")).toBeDefined()
  })

  it("renders compact fields without standalone labels", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} />)

    expect(screen.queryByText("Title")).toBeNull()
    expect(screen.queryByText("Description")).toBeNull()
    expect(screen.queryByText("Due Date")).toBeNull()
    expect(screen.queryByText("Status")).toBeNull()
    expect(screen.getByPlaceholderText("Task title")).toBeDefined()
    expect(screen.getByPlaceholderText("Description (optional)")).toBeDefined()
    expect(screen.getByTestId("title-icon")).toBeDefined()
  })

  it("updates due date through calendar day selection and inline span clear", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} dueDate="2026-07-04" />)

    fireEvent.click(
      screen.getByRole("button", { name: "Open due date picker" })
    )
    fireEvent.click(screen.getByRole("button", { name: /july 15th, 2026/i }))
    expect(props.onDueDateChange).toHaveBeenCalledWith("2026-07-15")

    const clearDueDate = screen.getByLabelText("Clear due date")
    expect(clearDueDate.tagName).toBe("SPAN")
    expect(screen.getByTestId("date-clear-icon")).toBeDefined()
    fireEvent.click(clearDueDate)
    expect(props.onDueDateChange).toHaveBeenCalledWith("")
  })

  it("renders dropdown icons in inline-start addon and keeps combobox width visible", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} status="todo" priority="important" />)

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
    expect(statusGroup?.className).toContain("min-w-44")
    expect(statusGroup?.className).toContain("shrink-0")
  })

  it("updates and clears status through combobox selector", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} status="blocked" />)

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

    expect(props.onStatusChange).toHaveBeenCalledWith("done")

    const clearStatusButton = statusGroup?.querySelector(
      '[data-slot="combobox-clear"]'
    )
    expect(clearStatusButton).toBeTruthy()
    fireEvent.click(clearStatusButton as Element)
    expect(props.onStatusChange).toHaveBeenCalledWith("")
  })

  it("updates and clears priority through combobox selector", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} priority="important" />)

    const priorityInput = screen.getByRole("combobox", {
      name: "Open priority options",
    })
    const priorityGroup = priorityInput.closest('[data-slot="input-group"]')
    const priorityTriggerButton = priorityGroup?.querySelector(
      '[data-slot="input-group-button"]'
    )
    expect(priorityTriggerButton).toBeTruthy()
    fireEvent.click(priorityTriggerButton as Element)
    fireEvent.click(screen.getByRole("option", { name: "Frantic" }))

    expect(props.onPriorityChange).toHaveBeenCalledWith("frantic")

    const clearPriorityButton = priorityGroup?.querySelector(
      '[data-slot="combobox-clear"]'
    )
    expect(clearPriorityButton).toBeTruthy()
    fireEvent.click(clearPriorityButton as Element)
    expect(props.onPriorityChange).toHaveBeenCalledWith("")
  })
})
