import { Button } from "@/components/ui/button"
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
  status: TaskStatus
  saving: boolean
  onOpenChange: (open: boolean) => void
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onDueDateChange: (value: string) => void
  onStatusChange: (status: TaskStatus) => void
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
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => onDueDateChange(event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <p className="text-sm font-medium">Status</p>
            <div className="grid grid-cols-2 gap-2">
              {Swimlanes.map((lane) => (
                <Button
                  key={lane}
                  variant={status === lane ? "default" : "outline"}
                  onClick={() => onStatusChange(lane)}
                >
                  {laneTitles[lane]}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={saving || !title.trim()} onClick={onSubmit}>
            {saving ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
