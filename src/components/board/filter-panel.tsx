import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

export type FilterState = {
  overdue: boolean
  today: boolean
  doneRecently: boolean
  blockedOnly: boolean
  noDueDate: boolean
}

type FilterPanelProps = {
  filters: FilterState
  onToggle: (key: keyof FilterState) => void
  onReset: () => void
}

export function FilterPanel({ filters, onToggle, onReset }: FilterPanelProps) {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="border-r">
      <SidebarHeader className="px-4 pt-4">
        <h2 className="font-heading text-lg">Filters</h2>
        <p className="text-xs text-muted-foreground">
          One filter can be active at a time.
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="grid gap-2 px-2 text-sm">
              <Button
                variant={filters.overdue ? "default" : "outline"}
                className="justify-start"
                onClick={() => onToggle("overdue")}
              >
                Overdue
              </Button>
              <Button
                variant={filters.today ? "default" : "outline"}
                className="justify-start"
                onClick={() => onToggle("today")}
              >
                Due Today
              </Button>
              <Button
                variant={filters.doneRecently ? "default" : "outline"}
                className="justify-start"
                onClick={() => onToggle("doneRecently")}
              >
                Done Recently
              </Button>
              <Button
                variant={filters.blockedOnly ? "default" : "outline"}
                className="justify-start"
                onClick={() => onToggle("blockedOnly")}
              >
                Blocked Only
              </Button>
              <Button
                variant={filters.noDueDate ? "default" : "outline"}
                className="justify-start"
                onClick={() => onToggle("noDueDate")}
              >
                No Due Date
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4">
        <Button variant="ghost" className="justify-start" onClick={onReset}>
          Reset Filters
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
