import { baseFields, baseSchema } from "./base";

export const todoStatusEnum = baseSchema.enum("todo_status", [
  "todo",
  "in_progress",
  "blocked",
  "done",
]);

export const todoPriorityEnum = baseSchema.enum("todo_priority", [
  "important",
  "urgent",
  "frantic",
]);

export const todos = baseSchema.table("todos", (t) => ({
  ...baseFields,
  title: t.text("title").notNull(),
  description: t.text("description"),
  status: todoStatusEnum("status").notNull().default("todo"),
  priority: todoPriorityEnum("priority"),
  dueDate: t.date("dueDate", { mode: "date" }),
  position: t.integer("position"),
}));
