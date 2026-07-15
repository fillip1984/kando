import { defineRelations } from "drizzle-orm"

import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
  todos: {
    checklistItems: r.many.checklistItems(),
    comments: r.many.comments(),
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
}))
