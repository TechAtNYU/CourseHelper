import { defineSchema, defineTable } from "convex/server";
import { courses, prerequisites } from "./schemas/courses";
import { programs, requirements } from "./schemas/programs";

export default defineSchema({
  programs: defineTable(programs).index("by_program_name", ["name"]),
  requirements: defineTable(requirements).index("by_program", ["programId"]),
  courses: defineTable(courses)
    .index("by_course_code", ["code"])
    .index("by_program_level", ["program", "level"]),
  prerequisites: defineTable(prerequisites).index("by_course", ["courseId"]),
});
