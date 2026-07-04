import { Button } from "@/components/ui/button"

export type FilterState = {
  overdue: boolean
  today: boolean
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
    <aside className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <h2 className="font-heading text-lg">Filters</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        One filter can be active at a time.
      </p>

      <div className="mt-3 grid gap-2 text-sm">
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
        <Button variant="ghost" className="justify-start" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </aside>
  )
}
