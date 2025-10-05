import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  status: text("status", {
    enum: ["pending", "processing", "completed", "failed"],
  }).notNull(),
  jobType: text("job_type", {
    enum: ["discovery", "program", "course"],
  }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const errorLogs = sqliteTable("error_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id").references(() => jobs.id),
  errorType: text("error_type", {
    enum: ["network", "parsing", "validation", "timeout"],
  }).notNull(),
  errorMessage: text("error_message").notNull(),
  stackTrace: text("stack_trace"),
  retryCount: integer("retry_count").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});
