import { TodoStatusEnumValues } from "@/lib/enum-values"
import { baseFields, baseSchema } from "./base"
import { todoPriorityPgEnum, todoStatusPgEnum } from "./enums"

export const todos = baseSchema.table("todo", (t) => ({
  ...baseFields,
  title: t.text("title").notNull(),
  description: t.text("description"),
  status: todoStatusPgEnum("status")
    .notNull()
    .default(TodoStatusEnumValues.TODO),
  priority: todoPriorityPgEnum("priority"),
  dueDate: t.date("dueDate", { mode: "string" }),
  position: t.integer("position"),
  emailSubjectLine: t.text("email_subject_line"),
}))

export const comments = baseSchema.table("comment", (t) => ({
  ...baseFields,
  content: t.text("content").notNull(),
  todoId: t
    .text("todoId")
    .notNull()
    .references(() => todos.id, { onDelete: "cascade" }),
}))

export const checklistItems = baseSchema.table("checklist_item", (t) => ({
  ...baseFields,
  content: t.text("content").notNull(),
  complete: t.boolean("complete").notNull().default(false),
  position: t.integer("position").notNull(),
  todoId: t
    .text("todoId")
    .notNull()
    .references(() => todos.id, { onDelete: "cascade" }),
}))

export const todoTags = baseSchema.table("todo_tag", (t) => ({
  ...baseFields,
  todoId: t
    .text("todoId")
    .notNull()
    .references(() => todos.id, { onDelete: "cascade" }),
  tagId: t
    .text("tagId")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
}))

export const tags = baseSchema.table("tag", (t) => ({
  ...baseFields,
  name: t.text("name").notNull(),
  description: t.text("description"),
  color: t.text("color"),
}))
