import type { ReactNode } from "react"

import { ModeToggle } from "@/components/theme/mode-toggle"

type BoardHeaderProps = {
  totalShown: number
  mobileLeading?: ReactNode
}

export function BoardHeader({ totalShown, mobileLeading }: BoardHeaderProps) {
  return (
    <header className="rounded-xl border border-border/70 bg-background/85 p-4 shadow-sm backdrop-blur md:p-5">
      <div className="flex flex-col gap-2">
        <div>
          {mobileLeading}
          <h1 className="font-heading text-2xl tracking-tight">Kando</h1>
          <p className="text-sm text-muted-foreground">
            Single-board Kanban for focused task flow.
          </p>
        </div>

        <div
          data-testid="app-bar"
          className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background p-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing {totalShown} task{totalShown === 1 ? "" : "s"}
          </p>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
