import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { AlignLeft, Flag, GoalIcon, Kanban, Type, X } from "lucide-react"
import { InputGroupAddon } from "../ui/input-group"

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
      <DialogContent className="sm:max-w-lg">
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
            <Type
              data-testid="title-icon"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
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

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Popover>
              <PopoverTrigger
                aria-label="Open due date picker"
                render={
                  <Button variant="outline" className="justify-between" />
                }
              >
                <span className="flex min-w-0 items-center gap-2">
                  <GoalIcon className="size-4 text-muted-foreground" />
                  <span
                    className={cn(
                      "truncate",
                      !selectedDueDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDueDate
                      ? format(selectedDueDate, "M/d/yyyy")
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
                    <X data-testid="date-clear-icon" className="size-4" />
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

            <Combobox
              value={status || null}
              items={statusOptions}
              onValueChange={(next) => onStatusChange(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open status options"
                showClear
                showTrigger
                value={status ? laneTitles[status] : ""}
                placeholder="Status"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Kanban data-testid="status-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent className="w-full">
                <ComboboxList>
                  {statusOptions.map((value) => (
                    <ComboboxItem key={value} value={value}>
                      {laneTitles[value]}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Combobox
              value={priority || null}
              items={priorityOptions}
              onValueChange={(next) => onPriorityChange(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open priority options"
                showClear
                showTrigger
                value={priority ? priorityTitles[priority] : ""}
                placeholder="Priority"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Flag data-testid="priority-field-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent className="w-full">
                <ComboboxList>
                  {priorityOptions.map((value) => (
                    <ComboboxItem key={value} value={value}>
                      {priorityTitles[value]}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
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
