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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { priorityLabels } from "@/lib/priority-utils"
import { swimlaneLabels } from "@/lib/swimlane-utils"
import type {
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@/server/functions/todos"
import { createTaskFn, updateTaskFn } from "@/server/functions/todos"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { AlignLeft, Flag, GoalIcon, Kanban, Type } from "lucide-react"
import { useEffect, useState } from "react"
import StyledDatePicker from "../custom-ui/styled-date-picker"
import { Field } from "../ui/field"
import { InputGroupAddon } from "../ui/input-group"

export function TaskDialog({
  open,
  close,
  task,
}: {
  open: boolean
  close: () => void
  task: TaskType | null
}) {
  // init form state
  // TODO: this should be done differently, but working quick to make things work for now
  const isNew = task?.id === "new"
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus | "">("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<TaskPriority | "">("")
  const [position, setPosition] = useState(9999)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (open) {
      setTitle(task?.title || "")
      setDescription(task?.description || "")
      setStatus(task?.status || "")
      setDueDate(task?.dueDate || "")
      setPriority(task?.priority || "")
      setPosition(task?.position ?? 9999)
    }
  }, [open])

  const router = useRouter()
  const createTask = useServerFn(createTaskFn)
  const updateTask = useServerFn(updateTaskFn)
  const handleSubmit = async () => {
    try {
      setSaving(true)
      if (isNew) {
        await createTask({
          data: {
            title,
            description: description || null,
            status: status as TaskStatus,
            dueDate,
            priority: priority || null,
            position,
          },
        })
      } else {
        if (!task) {
          throw new Error("Task is null when trying to update")
        }
        await updateTask({
          data: {
            id: task.id,
            title,
            description: description || null,
            status: status as TaskStatus,
            dueDate: dueDate || null,
            priority: priority || null,
            position,
          },
        })
      }
    } finally {
      // TODO: this may cause issues if the server function fails
      // TODO: to make this perfect we should wait for the dialog to close then set saving to false
      close()
      router.invalidate()
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => open === false && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Create Task" : "Edit Task"}</DialogTitle>
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
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="pl-9"
            />
          </div>

          <div className="relative">
            <AlignLeft className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <Textarea
              aria-label="Task description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description (optional)"
              className="min-h-20 pl-9"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Combobox
              value={status || null}
              items={swimlaneLabels.map((label) => label.value)}
              onValueChange={(next) => setStatus(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open status options"
                showTrigger
                value={
                  status
                    ? swimlaneLabels.find((label) => label.value === status)
                        ?.name
                    : ""
                }
                placeholder="Status"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Kanban data-testid="status-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>

              <Field className="mx-auto w-full">
                <StyledDatePicker
                  value={dueDate}
                  handleOnChange={(value) => setDueDate(value)}
                  leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                  placeholder="Due date"
                />
              </Field>

              <ComboboxContent className="w-full" align="center">
                <ComboboxList>
                  {swimlaneLabels.map((label) => (
                    <ComboboxItem key={label.value} value={label.value}>
                      {label.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Combobox
              value={priority || null}
              items={priorityLabels.map((label) => label.value)}
              onValueChange={(next) => setPriority(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open priority options"
                showClear
                showTrigger
                value={
                  priority
                    ? priorityLabels.find((label) => label.value === priority)
                        ?.name
                    : ""
                }
                placeholder="Priority"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Flag data-testid="priority-field-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent className="w-full" align="center">
                <ComboboxList>
                  {priorityLabels.map((label) => (
                    <ComboboxItem key={label.value} value={label.value}>
                      {label.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            disabled={saving || !title.trim() || !status}
            onClick={handleSubmit}
          >
            {saving ? "Saving..." : isNew ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
