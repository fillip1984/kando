import type { FilterState } from "@/components/board/filter-panel"
import { FilterPanel } from "@/components/board/filter-panel"
import { toggleSingleSelectFilter } from "@/components/board/filter-state"
import { KanbanBoard } from "@/components/board/kanban-board"
import { TaskDialog } from "@/components/board/task-dialog"
import {
  isOverdue,
  isToday,
  parseDueDate,
} from "@/components/board/task-filters"
import { ModeToggle } from "@/components/mode-toggle"
import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"
import {
  Swimlanes,
  createTaskFn,
  moveTaskFn,
  readTasksFn,
  updateTaskFn,
} from "@/server/functions/todos"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

export const Route = createFileRoute("/")({
  loader: async () => await readTasksFn(),
  component: App,
})

const emptyFilters: FilterState = {
  overdue: false,
  today: false,
  blockedOnly: false,
  noDueDate: false,
}

type TaskDialogMode = "create" | "edit"

type TaskDialogState = {
  open: boolean
  mode: TaskDialogMode
  taskId: string | null
}

type TaskFormState = {
  title: string
  description: string
  dueDate: string
  status: TaskStatus
}

function App() {
  const initialTasks = Route.useLoaderData()
  const [tasks, setTasks] = useState<TaskSummaryType[]>(initialTasks)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<TaskDialogState>({
    open: false,
    mode: "create",
    taskId: null,
  })
  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
  })
  const [isSavingTask, setIsSavingTask] = useState(false)
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
          .sort(
            (a, b) =>
              (a.position ?? Number.MAX_SAFE_INTEGER) -
              (b.position ?? Number.MAX_SAFE_INTEGER)
          )
        return acc
      },
      {
        todo: [] as TaskSummaryType[],
        in_progress: [] as TaskSummaryType[],
        blocked: [] as TaskSummaryType[],
        done: [] as TaskSummaryType[],
      }
    )
  }, [filteredTasks])

  const totalShown = filteredTasks.length

  function formatDateInput(value: unknown): string {
    const dueDate = parseDueDate(value)
    if (!dueDate) {
      return ""
    }

    return dueDate.toISOString().slice(0, 10)
  }

  function getTaskDueLabel(task: TaskSummaryType): string {
    const dueDate = parseDueDate(task.dueDate)
    if (!dueDate) {
      return "No due date"
    }

    return `Due ${dueDate.toLocaleDateString()}`
  }

  function openCreateDialog(targetLane: TaskStatus) {
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      status: targetLane,
    })
    setDialogState({ open: true, mode: "create", taskId: null })
  }

  function openEditDialog(task: TaskSummaryType) {
    setTaskForm({
      title: task.title,
      description: task.description ?? "",
      dueDate: formatDateInput(task.dueDate),
      status: task.status,
    })
    setDialogState({ open: true, mode: "edit", taskId: task.id })
  }

  function setDialogOpen(open: boolean) {
    setDialogState((current) => ({ ...current, open }))
  }

  function setTaskFormValue<TField extends keyof TaskFormState>(
    key: TField,
    value: TaskFormState[TField]
  ) {
    setTaskForm((current) => ({ ...current, [key]: value }))
  }

  async function saveTaskFromDialog() {
    const title = taskForm.title.trim()
    if (!title) {
      return
    }

    const dueDateValue = taskForm.dueDate
      ? new Date(`${taskForm.dueDate}T00:00:00`)
      : null

    setIsSavingTask(true)
    try {
      if (dialogState.mode === "create") {
        const laneTasks = tasks.filter(
          (task) => task.status === taskForm.status
        )
        const nextPosition = laneTasks.length
        const created = await createTaskFn({
          data: {
            title,
            description: taskForm.description.trim() || null,
            dueDate: dueDateValue,
            status: taskForm.status,
            position: nextPosition,
          },
        })

        setTasks((current) => [...current, created])
      } else if (dialogState.taskId) {
        const existingTask = tasks.find(
          (task) => task.id === dialogState.taskId
        )
        if (!existingTask) {
          return
        }

        const previousTasks = tasks
        const nextPosition = existingTask.position ?? 0

        setTasks((current) =>
          current.map((task) =>
            task.id === existingTask.id
              ? {
                  ...task,
                  title,
                  description: taskForm.description.trim() || null,
                  dueDate: dueDateValue,
                  status: taskForm.status,
                }
              : task
          )
        )

        try {
          await updateTaskFn({
            data: {
              id: existingTask.id,
              title,
              description: taskForm.description.trim() || null,
              dueDate: dueDateValue,
              status: taskForm.status,
              position: nextPosition,
            },
          })
        } catch {
          setTasks(previousTasks)
          return
        }
      }

      setDialogOpen(false)
    } finally {
      setIsSavingTask(false)
    }
  }

  function toggleFilter(key: keyof FilterState) {
    setFilters((current) => toggleSingleSelectFilter(current, key))
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
      .sort(
        (a, b) =>
          (a.position ?? Number.MAX_SAFE_INTEGER) -
          (b.position ?? Number.MAX_SAFE_INTEGER)
      )

    const nextPosition = targetTasks.length
    const previousTasks = tasks

    setIsSavingMove(true)
    setTasks((current) =>
      current.map((task) =>
        task.id === movingTask.id
          ? { ...task, status: targetLane, position: nextPosition }
          : task
      )
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

  const isTaskOverdue = (task: TaskSummaryType) => isOverdue(task, now)

  return (
    <main className="min-h-svh bg-linear-to-br from-emerald-50 via-background to-teal-50 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-6">
        <header className="rounded-xl border border-border/70 bg-background/85 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-2xl tracking-tight">Kando</h1>
              <p className="text-sm text-muted-foreground">
                Single-board Kanban for focused task flow.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {totalShown} task{totalShown === 1 ? "" : "s"}
              </p>
              <ModeToggle />
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <FilterPanel
            filters={filters}
            onToggle={toggleFilter}
            onReset={() => setFilters(emptyFilters)}
          />

          <KanbanBoard
            tasksByLane={tasksByLane}
            onDropToLane={onDropToLane}
            onOpenCreate={openCreateDialog}
            onEditTask={openEditDialog}
            onDragStart={setDraggedTaskId}
            onDragEnd={() => setDraggedTaskId(null)}
            getTaskDueLabel={getTaskDueLabel}
            isTaskOverdue={isTaskOverdue}
          />
        </section>
      </div>

      <TaskDialog
        open={dialogState.open}
        mode={dialogState.mode}
        title={taskForm.title}
        description={taskForm.description}
        dueDate={taskForm.dueDate}
        status={taskForm.status}
        saving={isSavingTask}
        onOpenChange={setDialogOpen}
        onTitleChange={(value) => setTaskFormValue("title", value)}
        onDescriptionChange={(value) => setTaskFormValue("description", value)}
        onDueDateChange={(value) => setTaskFormValue("dueDate", value)}
        onStatusChange={(value) => setTaskFormValue("status", value)}
        onSubmit={saveTaskFromDialog}
      />
    </main>
  )
}
