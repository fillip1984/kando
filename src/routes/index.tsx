import { KanbanBoard } from "@/components/board/kanban-board"
import { readTasksFn } from "@/server/functions/todos"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const tasks = await readTasksFn()
    return { tasks }
  },
})

function App() {
  const { tasks } = Route.useLoaderData()

  return (
    <>
      <div className="flex grow overflow-hidden">
        <KanbanBoard tasks={tasks} />
      </div>
    </>
  )
}
