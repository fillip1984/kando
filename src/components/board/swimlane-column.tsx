import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"

import { useTaskStore } from "@/server/stores/task-store"
import { TaskCard } from "./task-card"

type SwimlaneColumnProps = {
  lane: TaskStatus
  title: string
  tasks: TaskSummaryType[]
}

export function SwimlaneColumn({ lane, title, tasks }: SwimlaneColumnProps) {
  const { openTaskDialog } = useTaskStore()

  return (
    <article
      onDragOver={(event) => event.preventDefault()}
      className="flex w-100 shrink-0 flex-col rounded-xl border border-border/70 bg-card p-3 shadow-sm"
    >
      <header className="mb-2 flex items-center justify-between">
        <h2 className="font-heading text-base">{title}</h2>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="grid flex-1 content-start gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Drop a task here
          </div>
        ) : null}
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full justify-start"
        onClick={() =>
          openTaskDialog({
            mode: "create",
            status: lane,
            position: tasks.length,
          })
        }
      >
        <Plus className="size-4" />
        Add Task
      </Button>
    </article>
  )
}
