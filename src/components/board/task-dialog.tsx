import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import type { TaskPriority, TaskStatus } from "@/server/functions/todos"
import { format } from "date-fns"
import { AlignLeft, Flag, GoalIcon, Kanban, Type } from "lucide-react"
import StyledDatePicker from "../custom-ui/styled-date-picker"
import { Field } from "../ui/field"
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
            <Field className="mx-auto w-full">
              <StyledDatePicker
                value={selectedDueDate}
                handleSetValue={handleDueDateSelect}
                leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                placeholder="Due date"
              />
            </Field>

            <Combobox
              value={status || null}
              items={statusOptions}
              onValueChange={(next) => onStatusChange(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open status options"
                showTrigger
                value={status ? laneTitles[status] : ""}
                placeholder="Status"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Kanban data-testid="status-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent className="w-full" align="center">
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
              <ComboboxContent className="w-full" align="center">
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
