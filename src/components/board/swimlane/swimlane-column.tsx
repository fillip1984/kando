"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { SwimlaneType } from "@/lib/swimlane-utils"
import type { TaskType } from "@/server/functions/todos"
import { useState } from "react"
import { TaskCard } from "./task/task-card"
import { TaskDialog } from "./task/task-dialog"

export function SwimlaneColumn({ swimlane }: { swimlane: SwimlaneType }) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  return (
    <article className="flex w-100 shrink-0 flex-col rounded-xl border border-border/70 bg-card p-3 shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="font-heading text-base">{swimlane.label.name}</h2>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {swimlane.tasks.length}
        </span>
      </header>

      <div className="grid flex-1 content-start gap-2">
        {swimlane.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {swimlane.tasks.length === 0 ? (
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
            status: swimlane.label.value,
            dueDate: "",
            priority: null,
            position: 9999,
          } as TaskType
        }
        open={isTaskDialogOpen}
        close={() => setIsTaskDialogOpen(false)}
      />
    </article>
  )
}
