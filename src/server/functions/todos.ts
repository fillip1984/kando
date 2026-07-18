import type { TodoPriorityEnum, TodoStatusEnum } from "@/lib/enum-values"
import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"
import { db } from "../db/client"
import { checklistItems, comments, todos, todoTags } from "../db/schema"

export type TaskType = Awaited<ReturnType<typeof readTasksFn>>[0]
export type ChecklistItemType = TaskType["checklistItems"][0]
export type CommentType = TaskType["comments"][0]
// export type TaskDetailType = Awaited<ReturnType<typeof readTaskFn>>

// crud
export const createTaskFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      title: string
      description?: string | null
      dueDate?: string | null
      status: TodoStatusEnum
      priority?: TodoPriorityEnum | null
      position: number
    }) => data
  )
  .handler(async ({ data }) => {
    await db.insert(todos).values({
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      dueDate: data.dueDate !== "" ? data.dueDate : null,
      priority: data.priority ?? null,
      position: data.position,
    })
  })

export const readTasksFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.query.todos.findMany({
      orderBy: {
        position: "asc",
      },
      with: {
        checklistItems: {
          orderBy: {
            position: "asc",
          },
        },
        comments: true,
        todoTags: {
          with: {
            tag: true,
          },
        },
      },
    })
  }
)

export const updateTaskFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string
      title: string
      description?: string | null
      dueDate?: string | null
      status: TodoStatusEnum
      priority: TodoPriorityEnum | null
      position: number
    }) => data
  )
  .handler(async ({ data }) => {
    await db
      .update(todos)
      .set({
        title: data.title,
        description: data.description ?? null,
        status: data.status,
        dueDate: data.dueDate !== "" ? data.dueDate : null,
        priority: data.priority ?? null,
        position: data.position,
      })
      .where(eq(todos.id, data.id))
  })

export const reorderTasksFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      updates: {
        taskId: string
        position: number
        status: TodoStatusEnum
      }[]
    }) => data
  )
  .handler(async ({ data }) => {
    await db.transaction(async (tx) => {
      for (const update of data.updates) {
        try {
          await tx
            .update(todos)
            .set({
              status: update.status,
              position: update.position,
            })
            .where(eq(todos.id, update.taskId))
        } catch (error) {
          console.error("Error updating task:", error)
        }
      }
    })
  })

export const deleteTaskFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data.id))
  })

export const createChecklistItemFn = createServerFn({ method: "POST" })
  .validator(
    (data: { content: string; todoId: string; position: number }) => data
  )
  .handler(async ({ data }) => {
    await db.insert(checklistItems).values({
      content: data.content,
      position: data.position,
      todoId: data.todoId,
    })
  })

export const updateChecklistItemFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string
      content: string
      position: number
      complete: boolean
    }) => data
  )
  .handler(async ({ data }) => {
    await db
      .update(checklistItems)
      .set({
        content: data.content,
        position: data.position,
        complete: data.complete,
      })
      .where(eq(checklistItems.id, data.id))
  })

export const deleteChecklistItemFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(checklistItems).where(eq(checklistItems.id, data.id))
  })

export const reorderChecklistItemsFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      updates: {
        id: string
        position: number
      }[]
    }) => data
  )
  .handler(async ({ data }) => {
    await db.transaction(async (tx) => {
      for (const update of data.updates) {
        await tx
          .update(checklistItems)
          .set({
            position: update.position,
          })
          .where(eq(checklistItems.id, update.id))
      }
    })
  })

export const createCommentFn = createServerFn({ method: "POST" })
  .validator((data: { content: string; todoId: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(comments).values({
      content: data.content,
      todoId: data.todoId,
    })
  })

export const updateCommentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; content: string }) => data)
  .handler(async ({ data }) => {
    await db
      .update(comments)
      .set({
        content: data.content,
      })
      .where(eq(comments.id, data.id))
  })

export const deleteCommentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(comments).where(eq(comments.id, data.id))
  })

export const addTagToTaskFn = createServerFn({ method: "POST" })
  .validator((data: { todoId: string; tagId: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(todoTags).values({
      todoId: data.todoId,
      tagId: data.tagId,
    })
  })

export const removeTagToTaskFn = createServerFn({ method: "POST" })
  .validator((data: { todoId: string; tagId: string }) => data)
  .handler(async ({ data }) => {
    await db
      .delete(todoTags)
      .where(
        and(eq(todoTags.todoId, data.todoId), eq(todoTags.tagId, data.tagId))
      )
  })
