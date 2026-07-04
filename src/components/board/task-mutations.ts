import type {
  MoveTaskInput,
  TaskStatus,
  TaskSummaryType,
  UpdateTaskInput,
} from "@/server/functions/todos"

type TaskEditValues = {
  title: string
  description: string | null
  dueDate: Date | null
  status: TaskStatus
}

export function applyTaskEditLocally(
  tasks: TaskSummaryType[],
  taskId: string,
  values: TaskEditValues
): TaskSummaryType[] {
  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          status: values.status,
        }
      : task
  )
}

export function createUpdateTaskInput(
  taskId: string,
  position: number,
  values: TaskEditValues
): UpdateTaskInput {
  return {
    id: taskId,
    title: values.title,
    description: values.description,
    dueDate: values.dueDate,
    status: values.status,
    position,
  }
}

export function createMoveUpdate(
  tasks: TaskSummaryType[],
  movingTaskId: string,
  targetLane: TaskStatus
): { nextTasks: TaskSummaryType[]; moveInput: MoveTaskInput } | null {
  const movingTask = tasks.find((task) => task.id === movingTaskId)
  if (!movingTask) {
    return null
  }

  const targetTasks = tasks
    .filter((task) => task.status === targetLane && task.id !== movingTask.id)
    .sort(
      (a, b) =>
        (a.position ?? Number.MAX_SAFE_INTEGER) -
        (b.position ?? Number.MAX_SAFE_INTEGER)
    )

  const position = targetTasks.length

  return {
    nextTasks: tasks.map((task) =>
      task.id === movingTask.id
        ? { ...task, status: targetLane, position }
        : task
    ),
    moveInput: {
      id: movingTask.id,
      status: targetLane,
      position,
    },
  }
}
