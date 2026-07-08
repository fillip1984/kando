import type { TaskPriority } from "@/server/functions/todos"

export const priorityLabels: { name: string; value: TaskPriority }[] = [
  { name: "Important", value: "important" },
  { name: "Urgent", value: "urgent" },
  { name: "Frantic", value: "frantic" },
]
