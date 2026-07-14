"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { TaskType } from "@/server/functions/todos"
import { useState } from "react"
import { TaskCard } from "./task/task-card"
import { TaskDialog } from "./task/task-dialog"

export function SwimlaneColumn({
  label,
  lane,
  tasks,
  ref,
}: {
  label: string
  lane: string
  tasks: TaskType[]
  ref?: React.Ref<HTMLDivElement>
}) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  return (
    <div className="flex w-100 shrink-0 flex-col rounded-xl border border-border/70 bg-card p-3 shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="font-heading text-base">{label}</h2>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="flex grow content-start gap-2">
        <div ref={ref} data-column-id={lane} className="flex grow flex-col">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Drop a task here
          </div>
        ) : null}
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full justify-start"
        onClick={() => setIsTaskDialogOpen(true)}
      >
        <Plus className="size-4" />
        Add Task
      </Button>

      <TaskDialog
        task={
          {
            id: "new",
            title: "",
            description: "",
            status: label,
            dueDate: "",
            priority: null,
            position: 9999,
          } as TaskType
        }
        open={isTaskDialogOpen}
        close={() => setIsTaskDialogOpen(false)}
      />
    </div>
  )
}
