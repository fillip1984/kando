import type { TaskSummaryType } from "@/server/functions/todos"

import { buildSwimlanes } from "@/lib/swimlane-utils"
import { filterTasks } from "@/lib/task-filters"
import { useTaskStore } from "@/server/stores/task-store"
import { useEffect, useMemo } from "react"
import { SwimlaneColumn } from "./swimlane-column"

export function KanbanBoard({ tasks }: { tasks: TaskSummaryType[] }) {
  const { taskFilter, setTasksShownCount } = useTaskStore()

  const now = new Date()

  const filteredTasks = useMemo(() => {
    return filterTasks({ tasks, taskFilter, now })
  }, [taskFilter, now, tasks])

  const swimlanes = useMemo(() => {
    return buildSwimlanes(filteredTasks)
  }, [filteredTasks])

  useEffect(() => {
    setTasksShownCount(filteredTasks.length)
  }, [filteredTasks.length, setTasksShownCount])

  return (
    <section className="flex grow gap-4 overflow-x-auto p-4">
      {swimlanes.map((lane) => (
        <SwimlaneColumn key={lane.label.value} swimlane={lane} />
      ))}
    </section>
  )
}
