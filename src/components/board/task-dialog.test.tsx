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
    expect(screen.getByLabelText("Clear status")).toBeDefined()
    expect(screen.getByLabelText("Clear priority")).toBeDefined()
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
    expect(clearDueDate.textContent).toBe("X")
    fireEvent.click(clearDueDate)
    expect(props.onDueDateChange).toHaveBeenCalledWith("")
  })

  it("updates and clears status through compact selector", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} status="blocked" />)

    fireEvent.click(screen.getByRole("button", { name: "Open status options" }))
    fireEvent.click(screen.getByRole("option", { name: "Done" }))

    expect(props.onStatusChange).toHaveBeenCalledWith("done")

    fireEvent.click(screen.getByLabelText("Clear status"))
    expect(props.onStatusChange).toHaveBeenCalledWith("")
  })

  it("updates and clears priority through compact selector", () => {
    const props = createBaseProps()

    render(<TaskDialog {...props} priority="important" />)

    fireEvent.click(
      screen.getByRole("button", { name: "Open priority options" })
    )
    fireEvent.click(screen.getByRole("option", { name: "Frantic" }))

    expect(props.onPriorityChange).toHaveBeenCalledWith("frantic")

    fireEvent.click(screen.getByLabelText("Clear priority"))
    expect(props.onPriorityChange).toHaveBeenCalledWith("")
  })
})
