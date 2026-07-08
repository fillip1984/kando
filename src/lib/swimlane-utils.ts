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

export const buildSwimlanes = (tasks: TaskType[]): SwimlaneType[] => {
  const swimlanes: SwimlaneType[] = swimlaneLabels.map((label) => ({
    label,
    tasks: [] as TaskType[],
  }))

  tasks.forEach((task) => {
    const lane = swimlanes.find((l) => l.label.value === task.status)
    if (lane) {
      lane.tasks.push(task)
    }
  })

  return swimlanes
}
