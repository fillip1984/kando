import { format } from "date-fns"
import { Check, ChevronDown } from "lucide-react"

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
import { Combobox } from "@base-ui/react/combobox"

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
            <div className="grid gap-2" id="task-status">
              <Combobox.Root
                value={status || null}
                onValueChange={(value) => onStatusChange(value ?? "")}
              >
                <div className="flex items-center gap-2">
                  <Combobox.Input
                    placeholder="Choose status"
                    className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                  />
                  <Combobox.Trigger
                    render={
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Open status options"
                      />
                    }
                  >
                    <ChevronDown className="size-4" />
                  </Combobox.Trigger>
                </div>
                <Combobox.Portal>
                  <Combobox.Positioner className="z-50" sideOffset={4}>
                    <Combobox.Popup className="max-h-60 w-(--anchor-width) overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none">
                      <Combobox.List className="grid gap-1">
                        {Swimlanes.map((lane) => (
                          <Combobox.Item
                            key={lane}
                            value={lane}
                            className="relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground"
                          >
                            <Combobox.ItemIndicator className="text-primary">
                              <Check className="size-3.5" />
                            </Combobox.ItemIndicator>
                            {laneTitles[lane]}
                          </Combobox.Item>
                        ))}
                      </Combobox.List>
                      <Combobox.Empty className="px-2 py-1.5 text-xs text-muted-foreground">
                        No matching status
                      </Combobox.Empty>
                    </Combobox.Popup>
                  </Combobox.Positioner>
                </Combobox.Portal>
              </Combobox.Root>
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
                    onClick={() => onStatusChange("")}
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
