import type { TaskStatus, TaskSummaryType } from "@/server/functions/todos"

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
  tasks: TaskSummaryType[]
}

export const buildSwimlanes = (tasks: TaskSummaryType[]): SwimlaneType[] => {
  const swimlanes: SwimlaneType[] = swimlaneLabels.map((label) => ({
    label,
    tasks: [] as TaskSummaryType[],
  }))

  tasks.forEach((task) => {
    const lane = swimlanes.find((l) => l.label.value === task.status)
    if (lane) {
      lane.tasks.push(task)
    }
  })

  return swimlanes
}
