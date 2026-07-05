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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/server/functions/todos"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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

const statusOptions: TaskStatus[] = ["todo", "in_progress", "blocked", "done"]

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

  const handleDueDateSelect = (value: Date | undefined) => {
    onDueDateChange(value ? format(value, "yyyy-MM-dd") : "")
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
            <span className="text-sm font-medium">Due Date</span>
            <Popover>
              <PopoverTrigger
                aria-label="Open due date picker"
                render={<Button variant="outline" />}
              >
                <CalendarIcon className="size-4" />
                <span
                  className={cn(
                    "truncate",
                    !selectedDueDate && "text-muted-foreground"
                  )}
                >
                  {selectedDueDate
                    ? format(selectedDueDate, "PPP")
                    : "Pick a due date"}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDueDate}
                  onSelect={handleDueDateSelect}
                  defaultMonth={selectedDueDate ?? new Date()}
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {dueDate ? `Selected ${dueDate}` : "No due date selected"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDueDateChange("")}
                disabled={!dueDate}
                aria-label="Clear due date"
              >
                Clear due date
              </Button>
            </div>
          </div>

          <div className="grid gap-1.5">
            <span className="text-sm font-medium">Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open status options"
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {status ? laneTitles[status] : "Select status"}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {statusOptions.map((value) => (
                  <DropdownMenuItem
                    key={value}
                    role="option"
                    aria-selected={status === value}
                    onClick={() => onStatusChange(value)}
                  >
                    {laneTitles[value]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {status
                  ? `Selected ${laneTitles[status]}`
                  : "No status selected"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange("")}
                disabled={!status}
                aria-label="Clear status"
              >
                Clear status
              </Button>
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
