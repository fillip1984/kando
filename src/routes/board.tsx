import { KanbanBoard } from "@/components/board/kanban-board"
import { readTasksFn } from "@/server/functions/todos"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/board")({
  component: BoardPage,
  loader: async () => {
    const tasks = await readTasksFn()
    return { tasks }
  },
})

function BoardPage() {
  const { tasks } = Route.useLoaderData()

  return (
    <div className="flex grow overflow-hidden">
      <KanbanBoard tasks={tasks} />
    </div>
  )
}
