import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useTaskStore } from "@/server/stores/task-store"
import { ModeToggle } from "../theme/mode-toggle"
import { Button } from "../ui/button"

export default function AppSidebar() {
  return (
    <Sidebar>
      <Branding />
      <PrimaryNav />
      <SecondaryNav />
      <Footer />
    </Sidebar>
  )
}

const Branding = () => {
  return <div>Branding</div>
}

const PrimaryNav = () => {
  const { taskFilter, toggleFilter, resetFilters } = useTaskStore()

  return (
    <div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="grid gap-2 px-2 text-sm">
              <Button
                variant={taskFilter === "overdue" ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("overdue")}
              >
                Overdue
              </Button>
              <Button
                variant={taskFilter === "today" ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("today")}
              >
                Due Today
              </Button>
              <Button
                variant={taskFilter === "doneRecently" ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("doneRecently")}
              >
                Done Recently
              </Button>
              <Button
                variant={taskFilter === "blockedOnly" ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("blockedOnly")}
              >
                Blocked Only
              </Button>
              <Button
                variant={taskFilter === "noDueDate" ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("noDueDate")}
              >
                No Due Date
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  )
}

const SecondaryNav = () => {
  return <div>SecondaryNav</div>
}

const Footer = () => {
  return (
    <div>
      <ModeToggle />
    </div>
  )
}
