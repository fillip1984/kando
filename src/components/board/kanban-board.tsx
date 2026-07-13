import type { TaskType } from "@/server/functions/todos"

import { buildSwimlanes } from "@/lib/swimlane-utils"
import { filterTasks } from "@/lib/task-filters"
import { useTaskStore } from "@/server/stores/task-store"
import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { useEffect, useMemo } from "react"
import { SwimlaneColumn } from "./swimlane/swimlane-column"

export function KanbanBoard({ tasks }: { tasks: TaskType[] }) {
  const { taskFilter } = useTaskStore()

  const now = new Date()

  const filteredTasks = useMemo(() => {
    return filterTasks({ tasks, taskFilter, now })
  }, [taskFilter, now, tasks])

  const swimlanes = useMemo(() => {
    return buildSwimlanes(filteredTasks)
  }, [filteredTasks])

  // DnD Stuff
  const config = { sortable: false }
  const [draggableTasksParentRef, draggabledTasks, setDraggabledTasks] =
    useDragAndDrop<HTMLDivElement, TaskType>([], config)
  useEffect(() => {
    setDraggabledTasks(filteredTasks)
  }, [filteredTasks])

  return (
    <section className="flex grow gap-4 overflow-x-auto p-4">
      {Object.entries(swimlanes).map(([status, tasks]) => (
        <SwimlaneColumn
          key={status}
          swimlane={{
            label: { name: status, value: status as TaskType["status"] },
            tasks,
          }}
        />
      ))}
    </section>
  )
}
