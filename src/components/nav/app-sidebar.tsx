import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
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
      <SidebarRail />
    </Sidebar>
  )
}

const Branding = () => {
  return (
    <SidebarHeader>
      <div>
        <h1 className="font-heading text-2xl font-semibold">Kando</h1>
      </div>
      <SidebarSeparator />
    </SidebarHeader>
  )
}

const PrimaryNav = () => {
  const { taskFilter, toggleFilter, resetFilters } = useTaskStore()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Due Date Filters</SidebarGroupLabel>
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
  )
}

const SecondaryNav = () => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Tag Filters</SidebarGroupLabel>
        <SidebarContent>Secondary content</SidebarContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

const Footer = () => {
  return (
    <SidebarFooter>
      <ModeToggle />
    </SidebarFooter>
  )
}
