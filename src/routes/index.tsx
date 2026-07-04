import { createFileRoute } from "@tanstack/react-router"
import { isSameDay, startOfDay } from "date-fns"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Swimlanes,
  createTaskFn,
  moveTaskFn,
  readTasksFn,
} from "@/server/functions/todos"
import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"

export const Route = createFileRoute("/")({
  loader: async () => await readTasksFn(),
  component: App,
})

type FilterState = {
  overdue: boolean
  today: boolean
  blockedOnly: boolean
  noDueDate: boolean
}

const laneTitles: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
}

const emptyFilters: FilterState = {
  overdue: false,
  today: false,
  blockedOnly: false,
  noDueDate: false,
}

function parseDueDate(value: unknown): Date | null {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function isOverdue(task: TaskSummaryType, now: Date): boolean {
  if (task.status === "done") {
    return false
  }

  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  return dueDate < startOfDay(now)
}

function isToday(task: TaskSummaryType, now: Date): boolean {
  const dueDate = parseDueDate(task.dueDate)
  if (!dueDate) {
    return false
  }

  return isSameDay(dueDate, now)
}

function App() {
  const initialTasks = Route.useLoaderData()
  const [tasks, setTasks] = useState<TaskSummaryType[]>(initialTasks)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [titleInput, setTitleInput] = useState("")
  const [descriptionInput, setDescriptionInput] = useState("")
  const [dueDateInput, setDueDateInput] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isSavingMove, setIsSavingMove] = useState(false)

  const now = new Date()

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.overdue && !isOverdue(task, now)) {
        return false
      }

      if (filters.today && !isToday(task, now)) {
        return false
      }

      if (filters.blockedOnly && task.status !== "blocked") {
        return false
      }

      if (filters.noDueDate && parseDueDate(task.dueDate) !== null) {
        return false
      }

      return true
    })
  }, [filters, now, tasks])

  const tasksByLane = useMemo(() => {
    return Swimlanes.reduce(
      (acc, lane) => {
        acc[lane] = filteredTasks
          .filter((task) => task.status === lane)
          .sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER))
        return acc
      },
      {
        todo: [] as TaskSummaryType[],
        in_progress: [] as TaskSummaryType[],
        blocked: [] as TaskSummaryType[],
        done: [] as TaskSummaryType[],
      },
    )
  }, [filteredTasks])

  const totalShown = filteredTasks.length

  async function createTask() {
    const title = titleInput.trim()
    if (!title) {
      return
    }

    setIsCreating(true)
    try {
      const laneTasks = tasks.filter((task) => task.status === "todo")
      const nextPosition = laneTasks.length
      const created = await createTaskFn({
        data: {
          title,
          description: descriptionInput.trim() || null,
          dueDate: dueDateInput ? new Date(`${dueDateInput}T00:00:00`) : null,
          status: "todo",
          position: nextPosition,
        },
      })

      setTasks((current) => [...current, created])
      setTitleInput("")
      setDescriptionInput("")
      setDueDateInput("")
    } finally {
      setIsCreating(false)
    }
  }

  function toggleFilter(key: keyof FilterState) {
    setFilters((current) => ({ ...current, [key]: !current[key] }))
  }

  async function onDropToLane(targetLane: TaskStatus) {
    if (!draggedTaskId || isSavingMove) {
      return
    }

    const movingTask = tasks.find((task) => task.id === draggedTaskId)
    if (!movingTask) {
      return
    }

    const targetTasks = tasks
      .filter((task) => task.status === targetLane && task.id !== movingTask.id)
      .sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER))

    const nextPosition = targetTasks.length
    const previousTasks = tasks

    setIsSavingMove(true)
    setTasks((current) =>
      current.map((task) =>
        task.id === movingTask.id ? { ...task, status: targetLane, position: nextPosition } : task,
      ),
    )

    try {
      await moveTaskFn({
        data: {
          id: movingTask.id,
          status: targetLane,
          position: nextPosition,
        },
      })
    } catch {
      setTasks(previousTasks)
    } finally {
      setDraggedTaskId(null)
      setIsSavingMove(false)
    }
  }

  return (
    <main className="min-h-svh bg-linear-to-br from-emerald-50 via-background to-teal-50 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-6">
        <header className="rounded-xl border border-border/70 bg-background/85 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-2xl tracking-tight">Kando</h1>
              <p className="text-sm text-muted-foreground">Single-board Kanban for focused task flow.</p>
            </div>
            <p className="text-sm text-muted-foreground">Showing {totalShown} task{totalShown === 1 ? "" : "s"}</p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
            <h2 className="font-heading text-lg">Filters</h2>
            <p className="mt-1 text-xs text-muted-foreground">Filters combine with AND behavior.</p>

            <div className="mt-3 grid gap-2 text-sm">
              <Button
                variant={filters.overdue ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("overdue")}
              >
                Overdue
              </Button>
              <Button
                variant={filters.today ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("today")}
              >
                Due Today
              </Button>
              <Button
                variant={filters.blockedOnly ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("blockedOnly")}
              >
                Blocked Only
              </Button>
              <Button
                variant={filters.noDueDate ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleFilter("noDueDate")}
              >
                No Due Date
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => setFilters(emptyFilters)}>
                Reset Filters
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-heading text-sm">Quick Add</h3>
              <div className="mt-2 grid gap-2">
                <input
                  value={titleInput}
                  onChange={(event) => setTitleInput(event.target.value)}
                  placeholder="Task title"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
                <textarea
                  value={descriptionInput}
                  onChange={(event) => setDescriptionInput(event.target.value)}
                  placeholder="Description (optional)"
                  className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={dueDateInput}
                  onChange={(event) => setDueDateInput(event.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
                <Button disabled={isCreating || !titleInput.trim()} onClick={createTask}>
                  {isCreating ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </div>
          </aside>

          <section className="grid gap-3 overflow-x-auto md:grid-cols-2 xl:grid-cols-4">
            {Swimlanes.map((lane) => (
              <article
                key={lane}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDropToLane(lane)}
                className="flex min-h-80 flex-col rounded-xl border border-border/70 bg-card p-3 shadow-sm"
              >
                <header className="mb-2 flex items-center justify-between">
                  <h2 className="font-heading text-base">{laneTitles[lane]}</h2>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {tasksByLane[lane].length}
                  </span>
                </header>

                <div className="grid content-start gap-2">
                  {tasksByLane[lane].map((task) => {
                    const dueDate = parseDueDate(task.dueDate)
                    const showOverdue = isOverdue(task, now)

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                        onDragEnd={() => setDraggedTaskId(null)}
                        className="rounded-lg border border-border/80 bg-background p-3"
                      >
                        <p className="line-clamp-2 text-sm font-medium">{task.title}</p>
                        {task.description ? (
                          <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{task.description}</p>
                        ) : null}
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {dueDate ? (
                            <span className={showOverdue ? "text-destructive" : "text-muted-foreground"}>
                              Due {dueDate.toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No due date</span>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {tasksByLane[lane].length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Drop a task here
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        </section>
        </div>
    </main>
  )
}
