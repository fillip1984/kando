import { DeleteTaskDialog } from "@/components/board/delete-task-dialog"
import { KanbanBoard } from "@/components/board/kanban-board"
import { TaskDialog } from "@/components/board/task-dialog"
import { readTasksFn } from "@/server/functions/todos"
import { useTaskStore } from "@/server/stores/task-store"
import { createFileRoute } from "@tanstack/react-router"

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

  return (
    <>
      <div className="flex grow">
        <KanbanBoard tasks={tasks} />
      </div>

      <TaskDialog open={isTaskDialogOpen} task={currentTask} />

      <DeleteTaskDialog
        open={isDeleteTaskConfirmationOpen}
        task={currentTask}
      />
    </>
  )
}
