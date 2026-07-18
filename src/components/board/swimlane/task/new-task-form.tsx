"use client"

import DatePickerWithClear from "@/components/custom-ui/date-picker-with-clear"
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroupAddon } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { TodoPriorityEnum, TodoStatusEnum } from "@/lib/enum-values"
import { TodoPriorityEnumValues, TodoStatusEnumValues } from "@/lib/enum-values"
import { createTaskFn } from "@/server/functions/todos"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { Flag, GoalIcon, Kanban } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function NewTaskForm({
  open,
  close,
}: {
  open: boolean
  close: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TodoStatusEnum>("Todo")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<TodoPriorityEnum | null>(null)

  const router = useRouter()
  const createTask = useServerFn(createTaskFn)
  const [isPending, setIsPending] = useState(false)
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    await createTask({
      data: {
        title,
        description,
        status,
        dueDate,
        priority,
        position: 9999,
      },
    })
    setIsPending(false)
    router.invalidate()
    toast.success("Task created")
    close()
  }

  const [isValid, setIsValid] = useState(false)
  useEffect(() => {
    setIsValid(title.trim().length > 0)
  }, [title])

  return (
    <Dialog open={open} onOpenChange={(open) => !open && close()}>
      <DialogContent className="w-3/4 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form
          id="new-task-form"
          onSubmit={handleSubmit}
          className="-mx-4 no-scrollbar grid max-h-[75vh] gap-4 overflow-y-auto px-4 lg:grid-cols-2"
        >
          <div className="space-y-3 lg:min-w-0">
            <Field>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full text-xl"
              />
            </Field>

            <Field>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full"
              />
            </Field>

            <FieldGroup className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Combobox
                items={Object.values(TodoStatusEnumValues)}
                value={status}
                onValueChange={(value) => {
                  setStatus(value ?? "Todo")
                }}
              >
                <ComboboxInput>
                  <InputGroupAddon>
                    <Kanban data-testid="status-icon" className="size-4" />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent className="w-full" align="center">
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <DatePickerWithClear
                value={dueDate}
                handleOnChange={(value) => {
                  const newDueDate = value
                  setDueDate(newDueDate)
                }}
                leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                placeholder="Due date"
              />

              <Combobox
                items={Object.values(TodoPriorityEnumValues)}
                value={priority}
                onValueChange={(value) => {
                  const newPriority = value
                  setPriority(newPriority)
                }}
              >
                <ComboboxInput showClear placeholder="Priority">
                  <InputGroupAddon>
                    <Flag
                      data-testid="priority-field-icon"
                      className="size-4"
                    />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldGroup>
          </div>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            form="new-task-form"
            type="submit"
            disabled={!isValid || isPending}
          >
            {isPending ? <Spinner /> : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
