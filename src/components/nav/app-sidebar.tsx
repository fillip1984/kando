import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "@tanstack/react-router"
import { LayoutDashboardIcon, Rows4Icon } from "lucide-react"
import { ModeToggle } from "../theme/mode-toggle"
import { buttonVariants } from "../ui/button"

export default function AppSidebar() {
  return (
    <Sidebar>
      <Branding />
      <PrimaryNav />
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
  const location = useLocation()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="grid gap-2 px-2 text-sm">
            <Link
              to="/"
              className={cn(
                buttonVariants({
                  variant: location.pathname === "/" ? "default" : "outline",
                }),
                "justify-start"
              )}
            >
              <LayoutDashboardIcon className="size-4" />
              Dashboard
            </Link>
            <Link
              to="/board"
              className={cn(
                buttonVariants({
                  variant:
                    location.pathname === "/board" ? "default" : "outline",
                }),
                "justify-start"
              )}
            >
              <Rows4Icon className="size-4" />
              Board
            </Link>
          </div>
        </SidebarGroupContent>
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
