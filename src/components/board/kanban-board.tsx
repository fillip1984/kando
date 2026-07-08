import type { TaskType } from "@/server/functions/todos"
import { reorderTasksFn } from "@/server/functions/todos"

import { buildSwimlanes } from "@/lib/swimlane-utils"
import { filterTasks } from "@/lib/task-filters"
import { useTaskStore } from "@/server/stores/task-store"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"
import { useServerFn } from "@tanstack/react-start"
import { useEffect, useMemo, useState } from "react"
import { SwimlaneColumn } from "./swimlane-column"

export function KanbanBoard({ tasks }: { tasks: TaskType[] }) {
  const { taskFilter, setTasksShownCount } = useTaskStore()

  const now = new Date()

  const filteredTasks = useMemo(() => {
    return filterTasks({ tasks, taskFilter, now })
  }, [taskFilter, now, tasks])

  // const swimlanes = useMemo(() => {
  //   return buildSwimlanes(filteredTasks)
  // }, [filteredTasks])
  const [swimlanes, setSwimlanes] = useState(() =>
    buildSwimlanes(filteredTasks)
  )

  useEffect(() => {
    setTasksShownCount(filteredTasks.length)
  }, [filteredTasks.length, setTasksShownCount])

  // Dnd stuff
  const reorderTasks = useServerFn(reorderTasksFn)

  return (
    <section className="flex grow gap-4 overflow-x-auto p-4">
      <DragDropProvider
        onDragOver={(event) => {
          setSwimlanes((prev) => move(prev, event))
        }}
        onDragEnd={async (event) => {
          if (event.canceled) {
            // setItems(snapshot.current)
            return
          }

          const { source } = event.operation

          if (isSortable(source)) {
            const { initialIndex, index, initialGroup, group } = source
            if (initialGroup == null || group == null) {
              console.log("Invalid initial group or group: ", {
                initialGroup,
                group,
              })
              return
            }

            console.log({ initialIndex, index, initialGroup, group })
            let reordered: {
              taskId: string
              position: number
              status: TaskType["status"]
            }[] = []
            if (initialGroup === group) {
              console.log("Reorder within the same group")
              // reordered tasks in the same group
              const lane = swimlanes.find((l) => l.label.value === group)
              const originalTasks = lane?.tasks ?? []
              const [movedTask] = originalTasks.splice(initialIndex, 1)
              originalTasks.splice(index, 0, movedTask)
              reordered = originalTasks.map((t, idx) => ({
                taskId: t.id,
                position: idx,
                status: group as TaskType["status"],
              }))
            } else {
              console.log("Move across groups")
              // moved task across groups
              const sourceLane = swimlanes.find(
                (l) => l.label.value === initialGroup
              )
              const targetLane = swimlanes.find((l) => l.label.value === group)
              const sourceTasks = sourceLane?.tasks ?? []
              const targetTasks = targetLane?.tasks ?? []
              const [movedTask] = sourceTasks.splice(initialIndex, 1)
              targetTasks.splice(index, 0, movedTask)
              reordered = [
                ...sourceTasks.map((t, idx) => ({
                  taskId: t.id,
                  position: idx,
                  status: initialGroup as TaskType["status"],
                })),
                ...targetTasks.map((t, idx) => ({
                  taskId: t.id,
                  position: idx,
                  status: group as TaskType["status"],
                })),
              ]
            }

            console.log({ reordered })
            await reorderTasks({
              data: {
                updates: reordered,
              },
            })
          }
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
