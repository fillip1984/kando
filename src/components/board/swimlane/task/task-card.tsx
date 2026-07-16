import {
  FlagIcon,
  GoalIcon,
  ListChecksIcon,
  MessageCircleIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { isOverdue } from "@/lib/task-utils"
import type { TaskType } from "@/server/functions/todos"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import DeleteTaskConfirmation from "./delete-task-confirmation"
import { TaskDialog } from "./task-dialog"

export function TaskCard({ task }: { task: TaskType }) {
  const priorityBadgeVariant =
    task.priority === "frantic"
      ? "destructive"
      : task.priority === "urgent"
        ? "default"
        : "secondary"

  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false)

  return (
    <>
      <div
        key={task.id}
        onClick={() => setIsOpen(true)}
        className="flex h-26 shrink-0 cursor-pointer flex-col rounded-lg border bg-background p-2 transition-colors select-none hover:bg-muted/50"
      >
        <div className="flex grow flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-medium">{task.title}</p>
            <Button
              variant="destructive"
              size="icon-xs"
              aria-label="Delete task"
              onClick={(event) => {
                event.stopPropagation()
                setIsDeleteConfirmationOpen(true)
              }}
            >
              <Trash2Icon className="size-3" />
            </Button>
          </div>
          {task.description ? (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          ) : null}
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
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
              <FlagIcon data-testid="priority-icon" />
              <span className="capitalize">{task.priority}</span>
            </Badge>
          ) : null}
          {task.checklistItems.length > 0 ? (
            <Badge
              variant="outline"
              aria-label={`Checklist items ${task.checklistItems.length}`}
            >
              <ListChecksIcon />
              <span>
                {task.checklistItems.filter((item) => item.complete).length}/
                {task.checklistItems.length}
              </span>
            </Badge>
          ) : null}
          {task.comments.length > 0 ? (
            <Badge
              variant="outline"
              aria-label={`Comments ${task.comments.length}`}
            >
              <MessageCircleIcon />
              <span>{task.comments.length}</span>
            </Badge>
          ) : null}
          {task.todoTags.slice(0, 2).map((todoTag) => (
            <Badge key={todoTag.id} variant="outline">
              {todoTag.tag?.color ? (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: todoTag.tag.color }}
                />
              ) : null}
              <span>{todoTag.tag?.name || "Tag"}</span>
            </Badge>
          ))}
          {task.todoTags.length > 2 ? (
            <Badge variant="outline">+{task.todoTags.length - 2}</Badge>
          ) : null}
        </div>
      </div>

      <TaskDialog task={task} open={isOpen} close={() => setIsOpen(false)} />
      <DeleteTaskConfirmation
        task={task}
        open={isDeleteConfirmationOpen}
        close={() => setIsDeleteConfirmationOpen(false)}
      />
    </>
  )
}
