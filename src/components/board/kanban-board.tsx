import type { TaskType } from "@/server/functions/todos"

import { buildSwimlanes } from "@/lib/swimlane-utils"
import { filterTasks } from "@/lib/task-filters"
import { useTaskStore } from "@/server/stores/task-store"
import { Feedback } from "@dnd-kit/dom"
import { DragDropProvider } from "@dnd-kit/react"
import { useEffect, useMemo } from "react"
import { SwimlaneColumn } from "./swimlane-column"

export function KanbanBoard({ tasks }: { tasks: TaskType[] }) {
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
      <DragDropProvider
        plugins={(defaults) => [
          ...defaults,
          Feedback.configure({
            dropAnimation: async ({ element, translate }) => {
              await element.animate(
                [
                  {
                    transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`,
                  },
                  { transform: "translate3d(0, 0, 0)" },
                ],
                { duration: 200, easing: "ease-out" }
              ).finished
            },
          }),
        ]}
        onDragOver={(event) => {
          console.log({ event })
          // move(swimlanes, event)
        }}
      >
        {swimlanes.map((lane) => (
          <SwimlaneColumn key={lane.label.value} swimlane={lane} />
        ))}
        {/* <DragOverlay>
          {(source) => <TaskCard task={source.data.current} />}
        </DragOverlay> */}
      </DragDropProvider>
    </section>
  )
}
