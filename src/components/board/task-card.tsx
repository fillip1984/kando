import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TaskSummaryType } from "@/server/functions/todos"

type TaskCardProps = {
  task: TaskSummaryType
  dueLabel: string
  isOverdue: boolean
  onEdit: (task: TaskSummaryType) => void
  onRequestDelete: (task: TaskSummaryType) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
}

export function TaskCard({
  task,
  dueLabel,
  isOverdue,
  onEdit,
  onRequestDelete,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  return (
    <div
      key={task.id}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      className="cursor-pointer rounded-lg border border-border/80 bg-background p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-medium">{task.title}</p>
        <Button
          variant="destructive"
          size="icon-xs"
          aria-label="Delete task"
          onClick={(event) => {
            event.stopPropagation()
            onRequestDelete(task)
          }}
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
      {task.description ? (
        <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
          {task.description}
        </p>
      ) : null}
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className={isOverdue ? "text-destructive" : "text-muted-foreground"}
        >
          {dueLabel}
        </span>
      </div>
    </div>
  )
}
