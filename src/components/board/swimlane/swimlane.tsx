"use client"

import { Button } from "@/components/ui/button"
import type { TaskType } from "@/server/functions/todos"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { TaskCard } from "./task/task-card"
import { TaskDialog } from "./task/task-dialog"

export function Swimlane({
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
    <>
      <div className="flex min-w-90 grow flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <header className="mb-2 flex items-center justify-between p-2">
          <h2 className="font-heading text-base">{label}</h2>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {tasks.length}
          </span>
        </header>
        <div className="flex grow flex-col overflow-hidden">
          <div
            ref={ref}
            data-column-id={lane}
            className="flex min-h-full flex-col gap-1 overflow-y-auto px-2"
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="p-2">
          <Button
            variant="outline"
            className="mt-3 w-full justify-start"
            onClick={() => setIsTaskDialogOpen(true)}
          >
            <PlusIcon className="size-4" />
            Add Task
          </Button>
        </div>
      </div>

      <TaskDialog
        task={
          {
            id: "new",
            title: "",
            description: "",
            status: lane,
            dueDate: "",
            priority: null,
            position: tasks.length,
          } as TaskType
        }
        open={isTaskDialogOpen}
        close={() => setIsTaskDialogOpen(false)}
      />
    </>
  )
}
