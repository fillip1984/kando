// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SidebarProvider } from "@/components/ui/sidebar"
import type { FilterState } from "./filter-panel"
import { FilterPanel } from "./filter-panel"
import { toggleSingleSelectFilter } from "./filter-state"

const emptyFilters: FilterState = {
  overdue: false,
  today: false,
  blockedOnly: false,
  noDueDate: false,
}

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function FilterPanelHarness() {
  let filters = { ...emptyFilters }

  const onToggle = (key: keyof FilterState) => {
    filters = toggleSingleSelectFilter(filters, key)
    rerenderPanel()
  }

  const onReset = vi.fn(() => {
    filters = { ...emptyFilters }
    rerenderPanel()
  })

  const { rerender } = render(
    <SidebarProvider>
      <FilterPanel filters={filters} onToggle={onToggle} onReset={onReset} />
    </SidebarProvider>
  )

  const rerenderPanel = () => {
    rerender(
      <SidebarProvider>
        <FilterPanel filters={filters} onToggle={onToggle} onReset={onReset} />
      </SidebarProvider>
    )
  }

  return { onReset }
}

describe("FilterPanel integration", () => {
  it("enforces single-select filter behavior and toggles active filter off", () => {
    FilterPanelHarness()

    const overdueButton = screen.getByRole("button", { name: "Overdue" })
    const todayButton = screen.getByRole("button", { name: "Due Today" })

    expect(overdueButton.className).toContain("bg-background")
    expect(todayButton.className).toContain("bg-background")

    fireEvent.click(overdueButton)
    expect(overdueButton.className).toContain("bg-primary")
    expect(todayButton.className).toContain("bg-background")

    fireEvent.click(todayButton)
    expect(todayButton.className).toContain("bg-primary")
    expect(overdueButton.className).toContain("bg-background")

    fireEvent.click(todayButton)
    expect(todayButton.className).toContain("bg-background")
    expect(overdueButton.className).toContain("bg-background")
  })
})
