import { TodoPriorityEnumValues, TodoStatusEnumValues } from "@/lib/enum-values"
import { baseSchema } from "./base"

export const todoStatusPgEnum = baseSchema.enum(
  "todo_status",
  TodoStatusEnumValues
)

export const todoPriorityPgEnum = baseSchema.enum(
  "todo_priority",
  TodoPriorityEnumValues
)
