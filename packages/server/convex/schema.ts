import { defineSchema, defineTable } from "convex/server";
import {
  courseOfferings,
  userCourseOfferings,
} from "./schemas/courseOfferings";
import { courses, prerequisites, userCourses } from "./schemas/courses";
import { programs, requirements } from "./schemas/programs";

export default defineSchema({
  programs: defineTable(programs).index("by_program_name", ["name"]),
  requirements: defineTable(requirements).index("by_program", ["programId"]),
  courses: defineTable(courses)
    .index("by_course_code", ["code"])
    .index("by_program_level", ["program", "level"]),
  prerequisites: defineTable(prerequisites).index("by_course", ["courseId"]),
  courseOfferings: defineTable(courseOfferings)
    .index("by_course", ["courseId"])
    .index("by_term_year", ["term", "year"])
    .index("by_course_term", ["courseId", "term", "year"]),
  userCourses: defineTable(userCourses).index("by_user", ["userId"]),
  userCourseOfferings: defineTable(userCourseOfferings).index("by_user", [
    "userId",
  ]),
});
