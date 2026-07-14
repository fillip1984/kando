import type { TaskType } from "@/server/functions/todos"
import { reorderTasksFn } from "@/server/functions/todos"

import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { useServerFn } from "@tanstack/react-start"
import { useEffect } from "react"
import { Swimlane } from "./swimlane/swimlane"

export function KanbanBoard({ tasks }: { tasks: TaskType[] }) {
  // const { taskFilter } = useTaskStore()

  useEffect(() => {
    setTodoTasks(tasks.filter((task) => task.status === "todo"))
    setInProgressTasks(tasks.filter((task) => task.status === "in_progress"))
    setBlockedTasks(tasks.filter((task) => task.status === "blocked"))
    setDoneTasks(tasks.filter((task) => task.status === "done"))
  }, [tasks])

  const reorderTasks = useServerFn(reorderTasksFn)

  // DnD Stuff
  const config = {
    group: "kanban-board",
    onDragend: async (event: unknown) => {
      // console.log({ event })
      const status = (event as any).parent.el.dataset.columnId
      // const parentEl = event.target.parentElement
      // const columnId = parentEl.dataset.columnId
      // console.log("Dragged from column:", status)

      const dragEvent = event as { values: TaskType[] }
      const updates = dragEvent.values.map((task, i) => ({
        taskId: task.id,
        title: task.title,
        status,
        position: i,
      }))
      console.log("drag ended", updates)
      await reorderTasks({ data: { updates } })
    },
    plugins: [animations()],
  }

  const [todoTasksRef, todos, setTodoTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)
  const [inProgressTasksRef, inProgress, setInProgressTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)
  const [blockedTasksRef, blocked, setBlockedTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)
  const [doneTasksRef, done, setDoneTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)

  return (
    <div className="flex grow overflow-hidden p-4">
      <div className="flex grow gap-4 overflow-x-auto">
        <Swimlane ref={todoTasksRef} label="Todo" lane="todo" tasks={todos} />
        <Swimlane
          ref={inProgressTasksRef}
          label="In Progress"
          lane="in_progress"
          tasks={inProgress}
        />
        <Swimlane
          ref={blockedTasksRef}
          label="Blocked"
          lane="blocked"
          tasks={blocked}
        />
        <Swimlane ref={doneTasksRef} label="Done" lane="done" tasks={done} />
      </div>
    </div>
  )
}
