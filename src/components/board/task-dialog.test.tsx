// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TaskDialog } from "./task-dialog"

function createBaseProps() {
  return {
    open: true,
    mode: "create" as const,
    title: "",
    description: "",
    dueDate: "",
    status: "todo" as const,
    saving: false,
    onOpenChange: vi.fn(),
    onTitleChange: vi.fn(),
    onDescriptionChange: vi.fn(),
    onDueDateChange: vi.fn(),
    onStatusChange: vi.fn(),
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
      />
    )

    expect(screen.getByRole("heading", { name: "Edit Task" })).toBeDefined()
    expect(screen.getByDisplayValue("Existing title")).toBeDefined()
    expect(screen.getByDisplayValue("Existing description")).toBeDefined()
    expect(screen.getByDisplayValue("2026-07-04")).toBeDefined()
  })
})
