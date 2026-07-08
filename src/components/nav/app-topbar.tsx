import { useTaskStore } from "@/server/stores/task-store"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

export default function AppTopbar() {
  const { tasksShownCount: totalShown } = useTaskStore()
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}

      {totalShown > 0 ? (
        <p className="text-sm text-muted-foreground">
          Showing {totalShown} task{totalShown > 1 ? "s" : ""}
        </p>
      ) : null}
      {/* TODO: add command palette */}
    </header>
  )
}
