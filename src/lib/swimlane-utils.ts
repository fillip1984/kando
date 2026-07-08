import type { TaskStatus, TaskType } from "@/server/functions/todos"

export const swimlaneLabels: { name: string; value: TaskStatus }[] = [
  { name: "Todo", value: "todo" },
  { name: "In Progress", value: "in_progress" },
  { name: "Blocked", value: "blocked" },
  { name: "Done", value: "done" },
]

export type SwimlaneType = {
  label: {
    name: string
    value: TaskStatus
  }
  tasks: TaskType[]
}

export const buildSwimlanes = (
  tasks: TaskType[]
): Record<TaskStatus, TaskType[]> => {
  const swimlanes: Record<TaskStatus, TaskType[]> = {
    todo: [],
    in_progress: [],
    blocked: [],
    done: [],
  }
  tasks.forEach((task) => {
    swimlanes[task.status].push(task)
  })
  return swimlanes

  // alternative implementation that doesn't use a record, but then we have to find the swimlane for each task which is less efficient
  // const swimlanes: SwimlaneType[] = swimlaneLabels.map((label) => ({
  //   label,
  //   tasks: [] as TaskType[],
  // }))

  // tasks.forEach((task) => {
  //   const lane = swimlanes.find((l) => l.label.value === task.status)
  //   if (lane) {
  //     lane.tasks.push(task)
  //   }
  // })

  // return swimlanes
}
