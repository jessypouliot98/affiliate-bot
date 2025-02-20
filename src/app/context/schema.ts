import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const tableContext = sqliteTable(
  "context",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    createdAt: text().notNull(),
    value: text().notNull(),
  },
);