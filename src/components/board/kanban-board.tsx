import { Swimlanes } from "@/server/functions/todos"
import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"

import { SwimlaneColumn } from "./swimlane-column"

const laneTitles: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
}

type KanbanBoardProps = {
  tasksByLane: Record<TaskStatus, TaskSummaryType[]>
  onDropToLane: (lane: TaskStatus) => void
  onOpenCreate: (lane: TaskStatus) => void
  onEditTask: (task: TaskSummaryType) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
  getTaskDueLabel: (task: TaskSummaryType) => string
  isTaskOverdue: (task: TaskSummaryType) => boolean
}

export function KanbanBoard({
  tasksByLane,
  onDropToLane,
  onOpenCreate,
  onEditTask,
  onDragStart,
  onDragEnd,
  getTaskDueLabel,
  isTaskOverdue,
}: KanbanBoardProps) {
  return (
    <section className="grid gap-3 overflow-x-auto md:grid-cols-2 xl:grid-cols-4">
      {Swimlanes.map((lane) => (
        <SwimlaneColumn
          key={lane}
          lane={lane}
          title={laneTitles[lane]}
          tasks={tasksByLane[lane]}
          onDropToLane={onDropToLane}
          onOpenCreate={onOpenCreate}
          onEditTask={onEditTask}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          getTaskDueLabel={getTaskDueLabel}
          isTaskOverdue={isTaskOverdue}
        />
      ))}
    </section>
  )
}
