// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { DeleteTaskDialog } from "./delete-task-dialog"

describe("DeleteTaskDialog", () => {
  it("calls onConfirm when delete is confirmed", () => {
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn()

    render(
      <DeleteTaskDialog
        open
        title="Task to delete"
        deleting={false}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Delete" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("calls onOpenChange(false) and does not confirm when cancel is clicked", () => {
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn()

    render(
      <DeleteTaskDialog
        open
        title="Task to keep"
        deleting={false}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
