import { defineSchema, defineTable } from "convex/server";
import { courses, prerequisites } from "./schemas/courses";
import { programs, requirements } from "./schemas/programs";

export default defineSchema({
  programs: defineTable(programs).index("by_program_name", ["name"]),
  requirements: defineTable(requirements)
    .index("by_program", ["programId"])
    .index("by_program_and_type", ["programId", "isMajor"]),
  courses: defineTable(courses).index("by_course_code", ["code"]),
  prerequisites: defineTable(prerequisites).index("by_course", ["courseId"]),
});
