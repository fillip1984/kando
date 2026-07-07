import { SidebarTrigger } from "../ui/sidebar"

export default function AppTopbar() {
  const totalShown = 5 // TODO: get this from the board state
  return (
    <header className="flex items-center justify-between gap-2 border-b border-border bg-background p-2">
      <SidebarTrigger aria-label="Open filters" />
      {totalShown > 0 ? (
        <p className="text-sm text-muted-foreground">
          Showing {totalShown} task{totalShown > 1 ? "s" : ""}
        </p>
      ) : null}
      {/* TODO: add command palette */}
    </header>
  )
}
