"use client"

import type { TaskType } from "@/server/functions/todos"
import { readTasksFn } from "@/server/functions/todos"
import { useServerFn } from "@tanstack/react-start"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskDialog } from "../board/swimlane/task/task-dialog"
import { Button } from "../ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

export default function AppTopbar() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:my-auto data-[orientation=vertical]:h-6"
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

      {/* TODO: add command palette */}
      <div className="ml-auto">
        <SearchCommand />
      </div>
    </header>
  )
}

const SearchCommand = () => {
  const [commandAndSearchOpen, setCommandAndSearchOpen] = useState(false)

  const [commandOrSearch, setCommandOrSearch] = useState("")

  // search form and results
  const readTasks = useServerFn(readTasksFn)
  const [searchResults, setSearchResults] = useState<TaskType[]>([])
  useEffect(() => {
    async function debounceSearch() {
      // debounce commandOrSearch for 300 ms and then update the search results
      if (!commandOrSearch) {
        setSearchResults([])
        return
      } else {
        const tasks = await readTasks()
        setSearchResults(
          tasks.filter((task) =>
            task.title
              .toLocaleLowerCase()
              .includes(commandOrSearch.toLocaleLowerCase())
          )
        )
      }
    }
    debounceSearch()
    // debounce commandOrSearch for 300 ms and then update the search results
    // const handler = setTimeout(async () => {
    // )
    // }, 300)

    // return () => clearTimeout(handler)
  }, [commandOrSearch])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if 'k' is pressed alongside Cmd (Mac) or Ctrl (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault() // Stop default browser search bar from opening
        setCommandAndSearchOpen((prev) => !prev)
      }
    }

    // Attach listener to the window
    window.addEventListener("keydown", handleKeyDown)

    // Clean up listener on component unmount to prevent memory leaks
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // state for task dialog and selected task
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskType | undefined>(
    undefined
  )

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setCommandAndSearchOpen(true)}
        className="bg-muted text-muted-foreground"
      >
        <SearchIcon className="size-4" />
        <span className="">⌘k</span>
      </Button>
      <CommandDialog
        open={commandAndSearchOpen}
        onOpenChange={setCommandAndSearchOpen}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a command or search..."
            value={commandOrSearch}
            onValueChange={setCommandOrSearch}
          />
          <CommandList>
            <CommandEmpty>No commands or tasks found.</CommandEmpty>

            {searchResults.length > 0 && (
              <CommandGroup heading="Tasks">
                {searchResults.map((task) => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      setSelectedTask(task)
                      setCommandAndSearchOpen(false)
                      setIsTaskDialogOpen(true)
                    }}
                  >
                    {task.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandGroup heading="Common Commands">
              <CommandItem
                onSelect={() => {
                  setSelectedTask({
                    id: "new",
                    title: "",
                    description: "",
                    status: "Todo",
                    dueDate: "",
                    priority: null,
                    position: 9999,
                  } as TaskType)
                  setCommandAndSearchOpen(false)
                  setIsTaskDialogOpen(true)
                }}
              >
                New Task
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          open={isTaskDialogOpen}
          close={() => setIsTaskDialogOpen(false)}
        />
      )}
    </>
  )
}
