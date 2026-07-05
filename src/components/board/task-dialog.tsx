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
import type { TaskPriority, TaskStatus } from "@/server/functions/todos"
import { format } from "date-fns"
import { AlignLeft, CalendarIcon, Flag, Text, Workflow } from "lucide-react"

type TaskDialogProps = {
  open: boolean
  mode: "create" | "edit"
  title: string
  description: string
  dueDate: string
  status: TaskStatus | ""
  priority: TaskPriority | ""
  saving: boolean
  onOpenChange: (open: boolean) => void
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onDueDateChange: (value: string) => void
  onStatusChange: (status: TaskStatus | "") => void
  onPriorityChange: (priority: TaskPriority | "") => void
  onSubmit: () => void
}

const laneTitles: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
}

const statusOptions: TaskStatus[] = ["todo", "in_progress", "blocked", "done"]
const priorityOptions: TaskPriority[] = ["important", "urgent", "frantic"]

const priorityTitles: Record<TaskPriority, string> = {
  important: "Important",
  urgent: "Urgent",
  frantic: "Frantic",
}

export function TaskDialog({
  open,
  mode,
  title,
  description,
  dueDate,
  status,
  priority,
  saving,
  onOpenChange,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onStatusChange,
  onPriorityChange,
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
          <div className="relative">
            <Text className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Task title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Task title"
              className="pl-9"
            />
          </div>

          <div className="relative">
            <AlignLeft className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <Textarea
              aria-label="Task description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Description (optional)"
              className="min-h-20 pl-9"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Popover>
              <PopoverTrigger
                aria-label="Open due date picker"
                render={<Button variant="outline" className="justify-between" />}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <CalendarIcon className="size-4" />
                  <span
                    className={cn(
                      "truncate",
                      !selectedDueDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDueDate
                      ? format(selectedDueDate, "PPP")
                      : "Due date"}
                  </span>
                </span>
                {selectedDueDate ? (
                  <span
                    aria-label="Clear due date"
                    className="ml-2 rounded px-1 text-xs text-muted-foreground hover:bg-muted"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onDueDateChange("")
                    }}
                  >
                    X
                  </span>
                ) : null}
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

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open status options"
                className="flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Workflow className="size-4" />
                  <span className={cn("truncate", !status && "text-muted-foreground") }>
                    {status ? laneTitles[status] : "Status"}
                  </span>
                </span>
                {status ? (
                  <span
                    aria-label="Clear status"
                    className="ml-2 rounded px-1 text-xs text-muted-foreground hover:bg-muted"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onStatusChange("")
                    }}
                  >
                    X
                  </span>
                ) : null}
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

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open priority options"
                className="flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Flag className="size-4" />
                  <span
                    className={cn("truncate", !priority && "text-muted-foreground")}
                  >
                    {priority ? priorityTitles[priority] : "Priority"}
                  </span>
                </span>
                {priority ? (
                  <span
                    aria-label="Clear priority"
                    className="ml-2 rounded px-1 text-xs text-muted-foreground hover:bg-muted"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onPriorityChange("")
                    }}
                  >
                    X
                  </span>
                ) : null}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {priorityOptions.map((value) => (
                  <DropdownMenuItem
                    key={value}
                    role="option"
                    aria-selected={priority === value}
                    onClick={() => onPriorityChange(value)}
                  >
                    {priorityTitles[value]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
