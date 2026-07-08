import { Flag, GoalIcon, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { isOverdue } from "@/lib/task-filters"
import type { TaskType } from "@/server/functions/todos"
import { useTaskStore } from "@/server/stores/task-store"

type TaskCardProps = {
  task: TaskType
  // dueLabel: string
  // isOverdue: boolean
  // onEdit: (task: TaskType) => void
  // onRequestDelete: (task: TaskType) => void
  // onDragStart: (taskId: string) => void
  // onDragEnd: () => void
}

export function TaskCard({
  task,
  // onDragStart,
  // onDragEnd,
}: TaskCardProps) {
  const priorityBadgeVariant =
    task.priority === "frantic"
      ? "destructive"
      : task.priority === "urgent"
        ? "default"
        : "secondary"

  const { openTaskDialog, openDeleteTaskConfirmation } = useTaskStore()

  return (
    <div
      key={task.id}
      draggable
      // onDragStart={() => onDragStart(task.id)}
      // onDragEnd={onDragEnd}
      onClick={() => openTaskDialog({ mode: "edit", task: task })}
      className="flex h-28 cursor-pointer flex-col rounded-lg border bg-background p-2 transition-colors hover:bg-muted/50"
    >
      <div className="flex grow flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium">{task.title}</p>
          <Button
            variant="destructive"
            size="icon-xs"
            aria-label="Delete task"
            onClick={(event) => {
              event.stopPropagation()
              openDeleteTaskConfirmation(task)
            }}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
        {task.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {task.description}
          </p>
        ) : null}
      </div>

      {/* footer */}
      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs">
        {task.dueDate ? (
          <Badge
            variant={isOverdue(task, new Date()) ? "destructive" : "outline"}
            aria-label={`Due date ${task.dueDate}`}
          >
            <GoalIcon data-testid="due-date-icon" />
            <span>{task.dueDate}</span>
          </Badge>
        ) : null}
        {task.priority ? (
          <Badge
            variant={priorityBadgeVariant}
            aria-label={`Priority ${task.priority}`}
          >
            <Flag data-testid="priority-icon" />
            <span className="capitalize">{task.priority}</span>
          </Badge>
        ) : null}
      </div>
    </div>
  )
}
