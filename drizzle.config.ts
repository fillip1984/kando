import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;
const schemaFilter = process.env.DATABASE_SCHEMA;

if (!url) {
  throw new Error("DATABASE_URL is not set");
}

if (!schemaFilter) {
  throw new Error("DATABASE_SCHEMA is not set");
}

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
  schemaFilter,
});
