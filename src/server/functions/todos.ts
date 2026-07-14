import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { db } from "../db/client"
import { todos } from "../db/schema"

export const Swimlanes = ["todo", "in_progress", "blocked", "done"] as const
export type TaskStatus = (typeof Swimlanes)[number]
export const TaskPriorities = ["important", "urgent", "frantic"] as const
export type TaskPriority = (typeof TaskPriorities)[number]

export type CreateTaskInput = {
  title: string
  description?: string | null
  dueDate?: string | null
  status?: TaskStatus
  priority?: TaskPriority | null
  position?: number
}

export type UpdateTaskInput = {
  id: string
  title: string
  description?: string | null
  dueDate?: string | null
  status: TaskStatus
  priority: TaskPriority | null
  position: number
}

export type TaskType = Awaited<ReturnType<typeof readTasksFn>>[0]
// export type TaskDetailType = Awaited<ReturnType<typeof readTaskFn>>

// crud
export const createTaskFn = createServerFn({ method: "POST" })
  .validator((data: CreateTaskInput) => data)
  .handler(async ({ data }) => {
    await db.insert(todos).values({
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "todo",
      dueDate: data.dueDate !== "" ? data.dueDate : null,
      priority: data.priority ?? null,
      position: data.position ?? 0,
    })
  })

export const readTasksFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.query.todos.findMany({
      orderBy: {
        position: "asc",
      },
    })
  }
)

// export const readTaskFn = createServerFn({ method: "GET" })
//   .validator((data: { id: string }) => data)
//   .handler(async ({ data }) => {
//     return await db.query.todos.findFirst({
//       where: { id: data.id },
//     })
//   })

export const updateTaskFn = createServerFn({ method: "POST" })
  .validator((data: UpdateTaskInput) => data)
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
        status: TaskStatus
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
