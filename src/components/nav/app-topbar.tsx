"use client"

import type { TaskType } from "@/server/functions/todos"
import { readTasksFn } from "@/server/functions/todos"
import { useServerFn } from "@tanstack/react-start"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import NewTaskForm from "../board/swimlane/task/new-task-form"
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
  const commonCommands = [
    {
      title: "New Task",
      action: () => {
        setIsNewTaskDialogOpen(true)
        setCommandAndSearchOpen(false)
      },
    },
  ]
  const [commandAndSearchOpen, setCommandAndSearchOpen] = useState(false)

  const [commandOrSearch, setCommandOrSearch] = useState("")

  // search form and results
  const readTasks = useServerFn(readTasksFn)
  const [searchTaskResults, setSearchTaskResults] = useState<TaskType[]>([])
  const [searchCommandResults, setSearchCommandResults] =
    useState<{ title: string; action: () => void }[]>(commonCommands)
  useEffect(() => {
    const debouncedSearch = setTimeout(async function search() {
      // debounce commandOrSearch for 300 ms and then update the search results
      if (!commandOrSearch) {
        setSearchTaskResults([])
        setSearchCommandResults(commonCommands)
        return
      } else {
        const tasks = await readTasks()
        setSearchTaskResults(
          tasks.filter((task) =>
            task.title
              .toLocaleLowerCase()
              .includes(commandOrSearch.toLocaleLowerCase())
          )
        )
        setSearchCommandResults(
          commonCommands.filter((command) =>
            command.title
              .toLocaleLowerCase()
              .includes(commandOrSearch.toLocaleLowerCase())
          )
        )
      }
    }, 300)
    return () => clearTimeout(debouncedSearch)
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

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)

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

            {searchTaskResults.length > 0 && (
              <CommandGroup heading="Tasks">
                {searchTaskResults.map((task) => (
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

            {searchCommandResults.length > 0 && (
              <CommandGroup heading="Common Commands">
                {searchCommandResults.map((command) => (
                  <CommandItem key={command.title} onSelect={command.action}>
                    {command.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
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

      {isNewTaskDialogOpen && (
        <NewTaskForm
          open={isNewTaskDialogOpen}
          close={() => setIsNewTaskDialogOpen(false)}
        />
      )}
    </>
  )
}
