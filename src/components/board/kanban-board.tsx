import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"
import { Swimlanes } from "@/server/functions/todos"

import {
  isDoneRecently,
  isOverdue,
  isToday,
  parseDueDate,
} from "@/lib/task-filters"
import { useTaskStore } from "@/server/stores/task-store"
import { useEffect, useMemo } from "react"
import { SwimlaneColumn } from "./swimlane-column"

const laneTitles: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
}

export function KanbanBoard({ tasks }: { tasks: TaskSummaryType[] }) {
  const { taskFilter, setTasksShownCount } = useTaskStore()

  // TODO: this needs to be called after filteredTasks
  useEffect(() => {
    setTasksShownCount(tasks.length)
  }, [tasks.length, setTasksShownCount])

  const now = new Date()

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (taskFilter === "overdue" && !isOverdue(task, now)) {
        return false
      }

      if (taskFilter === "today" && !isToday(task, now)) {
        return false
      }

      if (taskFilter === "doneRecently" && !isDoneRecently(task, now)) {
        return false
      }

      if (taskFilter === "blockedOnly" && task.status !== "blocked") {
        return false
      }

      if (taskFilter === "noDueDate" && parseDueDate(task.dueDate) !== null) {
        return false
      }

      return true
    })
  }, [taskFilter, now, tasks])

  const tasksByLane = useMemo(() => {
    return Swimlanes.reduce(
      (acc, lane) => {
        acc[lane] = filteredTasks
          .filter((task) => task.status === lane)
          .sort(
            (a, b) =>
              (a.position ?? Number.MAX_SAFE_INTEGER) -
              (b.position ?? Number.MAX_SAFE_INTEGER)
          )
        return acc
      },
      {
        todo: [] as TaskSummaryType[],
        in_progress: [] as TaskSummaryType[],
        blocked: [] as TaskSummaryType[],
        done: [] as TaskSummaryType[],
      }
    )
  }, [filteredTasks])

  return (
    <section className="flex grow gap-4 overflow-x-auto p-4">
      {Swimlanes.map((lane) => (
        <SwimlaneColumn
          key={lane}
          lane={lane}
          title={laneTitles[lane]}
          tasks={tasksByLane[lane]}
        />
      ))}
    </section>
  )
}
