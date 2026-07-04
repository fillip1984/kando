import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { todos } from "../db/schema";

export const Swimlanes = ["todo", "in_progress", "blocked", "done"] as const;
export type TaskStatus = (typeof Swimlanes)[number];

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status?: TaskStatus;
  position?: number;
};

export type UpdateTaskInput = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status: TaskStatus;
  position: number;
};

export type MoveTaskInput = {
  id: string;
  status: TaskStatus;
  position: number;
};

export type TaskSummaryType = Awaited<ReturnType<typeof readTasksFn>>[0];
export type TaskDetailType = Awaited<ReturnType<typeof readTaskFn>>;

// crud
export const createTaskFn = createServerFn({ method: "POST" })
  .validator((data: CreateTaskInput) => data)
  .handler(async ({ data }) => {
    const createdTasks = await db
      .insert(todos)
      .values({
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
        status: data.status ?? "todo",
        position: data.position ?? 0,
      })
      .returning();

    return createdTasks[0];
  });

export const readTasksFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.query.todos.findMany();
  },
);

export const readTaskFn = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return await db.query.todos.findFirst({
      where: { id: data.id },
    });
  });

export const updateTaskFn = createServerFn({ method: "POST" })
  .validator((data: UpdateTaskInput) => data)
  .handler(async ({ data }) => {
    await db
      .update(todos)
      .set({
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
        status: data.status,
        position: data.position,
      })
      .where(eq(todos.id, data.id));
  });

export const moveTaskFn = createServerFn({ method: "POST" })
  .validator((data: MoveTaskInput) => data)
  .handler(async ({ data }) => {
    await db
      .update(todos)
      .set({
        status: data.status,
        position: data.position,
      })
      .where(eq(todos.id, data.id));
  });

export const deleteTaskFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data.id));
  });
