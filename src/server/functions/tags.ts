import { createServerFn } from "@tanstack/react-start"

import { eq } from "drizzle-orm"
import { db } from "../db/client"
import { tags } from "../db/schema"

export type CreateTagInput = {
  name: string
  description?: string | null
  color?: string | null
}

export const createTagFn = createServerFn({ method: "POST" })
  .validator((data: CreateTagInput) => data)
  .handler(async ({ data }) => {
    await db.insert(tags).values({
      name: data.name.trim(),
      description: data.description ?? null,
      color: data.color ?? null,
    })
  })

export const readTagsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return await db.query.tags.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }
)

export const deleteTagFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(tags).where(eq(tags.id, data.id))
  })

export type TagType = Awaited<ReturnType<typeof readTagsFn>>[0]
