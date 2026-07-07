import { DeleteTaskDialog } from "@/components/board/delete-task-dialog"
import { KanbanBoard } from "@/components/board/kanban-board"
import { TaskDialog } from "@/components/board/task-dialog"
import {
  isDoneRecently,
  isOverdue,
  isToday,
  parseDueDate,
} from "@/components/board/task-filters"
import type { TaskFormState } from "@/components/board/task-form-state"
import { createTaskFormForLane } from "@/components/board/task-form-state"
import {
  applyTaskEditLocally,
  createMoveUpdate,
  createUpdateTaskInput,
} from "@/components/board/task-mutations"
import type {
  TaskPriority,
  TaskStatus,
  TaskSummaryType,
} from "@/server/functions/todos"
import {
  Swimlanes,
  createTaskFn,
  deleteTaskFn,
  moveTaskFn,
  readTasksFn,
  updateTaskFn,
} from "@/server/functions/todos"
import { useTaskStore } from "@/server/stores/task-store"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

export const Route = createFileRoute("/")({
  loader: async () => await readTasksFn(),
  component: App,
})

type TaskDialogMode = "create" | "edit"

type TaskDialogState = {
  open: boolean
  mode: TaskDialogMode
  taskId: string | null
}

function App() {
  const initialTasks = Route.useLoaderData()
  const [tasks, setTasks] = useState<TaskSummaryType[]>(initialTasks)
  const { taskFilter } = useTaskStore()
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
    priority: "",
  })
  const [isSavingTask, setIsSavingTask] = useState(false)
  const [isSavingMove, setIsSavingMove] = useState(false)
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  const [pendingDeleteTask, setPendingDeleteTask] =
    useState<TaskSummaryType | null>(null)

  const now = new Date()

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (taskFilter === "overdue" && !isOverdue(task, now)) {
        return false
      }

      if (taskFilter === "today" && !isToday(task, now)) {
        return false
      }

      if (taskFilter === "doneRecently" && !isDoneRecently(task, now)) {
        return false
      }

      if (taskFilter === "blockedOnly" && task.status !== "blocked") {
        return false
      }

      if (taskFilter === "noDueDate" && parseDueDate(task.dueDate) !== null) {
        return false
      }

      return true
    })
  }, [taskFilter, now, tasks])

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
      return "No date"
    }

    return dueDate.toLocaleDateString()
  }

  function openCreateDialog(targetLane: TaskStatus) {
    setTaskForm(createTaskFormForLane(targetLane))
    setDialogState({ open: true, mode: "create", taskId: null })
  }

  function openEditDialog(task: TaskSummaryType) {
    setTaskForm({
      title: task.title,
      description: task.description ?? "",
      dueDate: formatDateInput(task.dueDate),
      status: task.status,
      priority: task.priority ?? "",
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
    if (!title || !taskForm.status) {
      return
    }
    const selectedStatus = taskForm.status

    const dueDateValue = taskForm.dueDate
      ? new Date(`${taskForm.dueDate}T00:00:00`)
      : null
    const priorityValue: TaskPriority | null = taskForm.priority || null

    setIsSavingTask(true)
    try {
      if (dialogState.mode === "create") {
        const laneTasks = tasks.filter((task) => task.status === selectedStatus)
        const nextPosition = laneTasks.length
        const created = await createTaskFn({
          data: {
            title,
            description: taskForm.description.trim() || null,
            dueDate: dueDateValue,
            status: selectedStatus,
            priority: priorityValue,
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
        const editValues = {
          title,
          description: taskForm.description.trim() || null,
          dueDate: dueDateValue,
          status: selectedStatus,
          priority: priorityValue,
        }

        setTasks((current) =>
          applyTaskEditLocally(current, existingTask.id, editValues)
        )

        try {
          await updateTaskFn({
            data: createUpdateTaskInput(
              existingTask.id,
              nextPosition,
              editValues
            ),
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

  async function onDropToLane(targetLane: TaskStatus) {
    if (!draggedTaskId || isSavingMove) {
      return
    }

    const movingTask = tasks.find((task) => task.id === draggedTaskId)
    if (!movingTask) {
      return
    }

    const moveUpdate = createMoveUpdate(tasks, movingTask.id, targetLane)
    if (!moveUpdate) {
      return
    }

    const previousTasks = tasks

    setIsSavingMove(true)
    setTasks(moveUpdate.nextTasks)

    try {
      await moveTaskFn({
        data: moveUpdate.moveInput,
      })
    } catch {
      setTasks(previousTasks)
    } finally {
      setDraggedTaskId(null)
      setIsSavingMove(false)
    }
  }

  async function confirmDeleteTask() {
    if (!pendingDeleteTask || isDeletingTask) {
      return
    }

    const targetId = pendingDeleteTask.id
    const previousTasks = tasks

    setIsDeletingTask(true)
    setTasks((current) => current.filter((task) => task.id !== targetId))

    try {
      await deleteTaskFn({ data: { id: targetId } })
      setPendingDeleteTask(null)
    } catch {
      setTasks(previousTasks)
    } finally {
      setIsDeletingTask(false)
    }
  }

  const isTaskOverdue = (task: TaskSummaryType) => isOverdue(task, now)

  return (
    <>
      <main className="min-h-svh p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-6">
          <KanbanBoard
            tasksByLane={tasksByLane}
            onDropToLane={onDropToLane}
            onOpenCreate={openCreateDialog}
            onEditTask={openEditDialog}
            onRequestDeleteTask={setPendingDeleteTask}
            onDragStart={setDraggedTaskId}
            onDragEnd={() => setDraggedTaskId(null)}
            getTaskDueLabel={getTaskDueLabel}
            isTaskOverdue={isTaskOverdue}
          />
        </div>
      </main>

      <TaskDialog
        open={dialogState.open}
        mode={dialogState.mode}
        title={taskForm.title}
        description={taskForm.description}
        dueDate={taskForm.dueDate}
        status={taskForm.status}
        priority={taskForm.priority}
        saving={isSavingTask}
        onOpenChange={setDialogOpen}
        onTitleChange={(value) => setTaskFormValue("title", value)}
        onDescriptionChange={(value) => setTaskFormValue("description", value)}
        onDueDateChange={(value) => setTaskFormValue("dueDate", value)}
        onStatusChange={(value) => setTaskFormValue("status", value)}
        onPriorityChange={(value) => setTaskFormValue("priority", value)}
        onSubmit={saveTaskFromDialog}
      />

      <DeleteTaskDialog
        open={pendingDeleteTask !== null}
        title={pendingDeleteTask?.title ?? ""}
        deleting={isDeletingTask}
        onOpenChange={(open) => {
          if (!open && !isDeletingTask) {
            setPendingDeleteTask(null)
          }
        }}
        onConfirm={confirmDeleteTask}
      />
    </>
  )
}
