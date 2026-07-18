export const TodoStatusEnumValues = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  DONE: "Done",
} as const
export type TodoStatusEnum =
  (typeof TodoStatusEnumValues)[keyof typeof TodoStatusEnumValues]

export const TodoPriorityEnumValues = {
  IMPORTANT: "Important",
  URGENT: "Urgent",
  FRANTIC: "Frantic",
} as const
export type TodoPriorityEnum =
  (typeof TodoPriorityEnumValues)[keyof typeof TodoPriorityEnumValues]
