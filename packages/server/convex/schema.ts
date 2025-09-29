import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  courses: defineTable({
    code: v.string(), // CSCI-UA 101
    level: v.string(), // 100
    title: v.string(), // Intro to Computer Science
    credits: v.int64(), // 4
    description: v.string(),
    courseUrl: v.string(),
  }).index("by_course_code", ["code"]),

  programs: defineTable({
    name: v.string(), // Computer Science (BA)
    level: v.union(v.literal("undergraduate"), v.literal("graduate")),
    programUrl: v.string(),
  }).index("by_program_name", ["name"]),

  requirements: defineTable(
    v.union(
      v.object({
        programId: v.id("programs"),
        isMajor: v.boolean(),
        type: v.literal("required"),
        courses: v.array(v.string()), // course code
      }),
      v.object({
        programId: v.id("programs"),
        isMajor: v.boolean(),
        type: v.literal("alternative"),
        courses: v.array(v.string()), // course code
      }),
      v.object({
        programId: v.id("programs"),
        isMajor: v.boolean(),
        type: v.literal("options"),
        courses: v.array(v.string()), // course code
        creditsRequired: v.int64(),
      }),
    ),
  )
    .index("by_program", ["programId"])
    .index("by_program_and_type", ["programId", "isMajor"]),

  prerequisites: defineTable(
    v.union(
      v.object({
        courseId: v.id("courses"),
        type: v.literal("required"),
        courses: v.array(v.string()), // course code
      }),
      v.object({
        courseId: v.id("courses"),
        type: v.literal("alternative"),
        courses: v.array(v.string()), // course code
      }),
      v.object({
        courseId: v.id("courses"),
        type: v.literal("options"),
        courses: v.array(v.string()), // course code
        creditsRequired: v.int64(),
      }),
    ),
  ).index("by_course", ["courseId"]),
});
