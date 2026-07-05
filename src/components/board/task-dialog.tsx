import { format } from "date-fns"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { TaskStatus } from "@/server/functions/todos"
import { Swimlanes } from "@/server/functions/todos"

type TaskDialogProps = {
  open: boolean
  mode: "create" | "edit"
  title: string
  description: string
  dueDate: string
  status: TaskStatus | ""
  saving: boolean
  onOpenChange: (open: boolean) => void
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onDueDateChange: (value: string) => void
  onStatusChange: (status: TaskStatus | "") => void
  onSubmit: () => void
}

const laneTitles: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
}

export function TaskDialog({
  open,
  mode,
  title,
  description,
  dueDate,
  status,
  saving,
  onOpenChange,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onStatusChange,
  onSubmit,
}: TaskDialogProps) {
  const submitLabel = mode === "create" ? "Create Task" : "Save Changes"
  const selectedDueDate = dueDate ? new Date(`${dueDate}T00:00:00`) : undefined
  const [statusInput, setStatusInput] = useState("")

  useEffect(() => {
    setStatusInput(status ? laneTitles[status] : "")
  }, [status])

  function updateStatusFromInput(value: string) {
    setStatusInput(value)

    if (!value.trim()) {
      onStatusChange("")
      return
    }

    const normalized = value.trim().toLowerCase()
    const matchedLane = Swimlanes.find(
      (lane) =>
        lane === normalized || laneTitles[lane].toLowerCase() === normalized
    )

    if (matchedLane) {
      onStatusChange(matchedLane)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            Use this form to{" "}
            {mode === "create" ? "create a new task" : "update task details"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <label htmlFor="task-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Task title"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Description (optional)"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="task-due-date" className="text-sm font-medium">
              Due date
            </label>
            <div
              id="task-due-date"
              className="rounded-md border border-border/70"
            >
              <Calendar
                mode="single"
                selected={selectedDueDate}
                month={selectedDueDate}
                onSelect={(value) =>
                  onDueDateChange(value ? format(value, "yyyy-MM-dd") : "")
                }
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {dueDate ? `Selected ${dueDate}` : "No due date selected"}
              </span>
              {dueDate ? (
                <Button
                  variant="ghost"
                  size="xs"
                  aria-label="Clear due date"
                  onClick={() => onDueDateChange("")}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="task-status" className="text-sm font-medium">
              Status
            </label>
            <div className="grid gap-2">
              <input
                id="task-status"
                list="task-status-options"
                value={statusInput}
                placeholder="Choose status"
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                onChange={(event) => updateStatusFromInput(event.target.value)}
              />
              <datalist id="task-status-options">
                {Swimlanes.map((lane) => (
                  <option key={lane} value={laneTitles[lane]} />
                ))}
              </datalist>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {status
                    ? `Selected ${laneTitles[status]}`
                    : "No status selected"}
                </span>
                {status ? (
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Clear status"
                    onClick={() => updateStatusFromInput("")}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={saving || !title.trim() || !status}
            onClick={onSubmit}
          >
            {saving ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
