import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const release = sqliteTable("Release", {
  version: text("Version").primaryKey().notNull(),
  releaseDate: text("Release_date").notNull(),
  releaseNote: text("Release_note"),
});
