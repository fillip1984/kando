// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BoardHeader } from "./board-header"

describe("BoardHeader", () => {
  it("renders theme control inside app bar region", () => {
    render(<BoardHeader totalShown={3} />)

    const appBar = screen.getByTestId("app-bar")
    const toggle = within(appBar).getByRole("button", { name: "Toggle theme" })

    expect(appBar).toBeDefined()
    expect(toggle).toBeDefined()
    expect(screen.getByRole("heading", { name: "Kando" })).toBeDefined()
  })
})
