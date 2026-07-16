import { defineRelations } from "drizzle-orm"

import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
  todos: {
    checklistItems: r.many.checklistItems(),
    comments: r.many.comments(),
    todoTags: r.many.todoTags(),
  },
  checklistItems: {
    todo: r.one.todos({
      from: r.checklistItems.todoId,
      to: r.todos.id,
    }),
  },
  comments: {
    todo: r.one.todos({
      from: r.comments.todoId,
      to: r.todos.id,
    }),
  },
  tags: {
    todoTags: r.many.todoTags(),
  },
  todoTags: {
    todo: r.one.todos({
      from: r.todoTags.todoId,
      to: r.todos.id,
    }),
    tag: r.one.tags({
      from: r.todoTags.tagId,
      to: r.tags.id,
    }),
  },
}))
