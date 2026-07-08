import { DeleteTaskDialog } from "@/components/board/delete-task-dialog"
import { KanbanBoard } from "@/components/board/kanban-board"
import { TaskDialog } from "@/components/board/task-dialog"
import { readTasksFn } from "@/server/functions/todos"
import { useTaskStore } from "@/server/stores/task-store"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const tasks = await readTasksFn()
    return { tasks }
  },
})

function App() {
  const { currentTask, isTaskDialogOpen, isDeleteTaskConfirmationOpen } =
    useTaskStore()
  const { tasks } = Route.useLoaderData()

  useEffect(() => {
    console.log({ tasks })
  }, [tasks])

  return (
    <>
      <main className="min-h-svh p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-6">
          <KanbanBoard tasks={tasks} />
        </div>
      </main>

      <TaskDialog open={isTaskDialogOpen} task={currentTask} />

      <DeleteTaskDialog
        open={isDeleteTaskConfirmationOpen}
        task={currentTask}
      />
    </>
  )
}
