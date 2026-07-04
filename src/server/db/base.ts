import { createId } from "@paralleldrive/cuid2";
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

if (!process.env.DATABASE_SCHEMA) {
  throw new Error("DATABASE_SCHEMA is not set");
}

/**
 * Table schema is used to separate different applications using the same database.
 */
export const baseSchema = pgSchema(process.env.DATABASE_SCHEMA);

/**
 * Base fields for all tables.
 */
export const baseFields = {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => /* @__PURE__ */ new Date(),
  ),
};
