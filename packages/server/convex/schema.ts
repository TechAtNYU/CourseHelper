import { defineSchema, defineTable } from "convex/server";
import { appConfigs } from "./schemas/appConfigs";
import {
  courseOfferings,
  userCourseOfferings,
} from "./schemas/courseOfferings";
import { courses, prerequisites, userCourses } from "./schemas/courses";
import { programs, requirements } from "./schemas/programs";
import { students } from "./schemas/students";

export default defineSchema({
  appConfigs: defineTable(appConfigs).index("by_key", ["key"]),
  programs: defineTable(programs)
    .index("by_program_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
    }),
  requirements: defineTable(requirements)
    .index("by_program", ["programId"])
    .index("by_category", ["category"])
    .index("by_program_and_category", ["programId", "category"]),
  courses: defineTable(courses)
    .index("by_course_code", ["code"])
    .index("by_level", ["level"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["level"],
    }),
  prerequisites: defineTable(prerequisites).index("by_course", ["courseId"]),
  courseOfferings: defineTable(courseOfferings)
    .index("by_class_number", ["classNumber", "term", "year"])
    .index("by_term_year", ["isCorequisite", "term", "year"])
    .index("by_course_term", ["courseCode", "term", "year"])
    .index("by_corequisite_of", ["corequisiteOf", "term", "year"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["isCorequisite", "term", "year"],
    }),
  userCourses: defineTable(userCourses)
    .index("by_user", ["userId"])
    .index("by_user_course_term", ["userId", "courseCode", "year", "term"]),
  userCourseOfferings: defineTable(userCourseOfferings).index("by_user", [
    "userId",
  ]),
  students: defineTable(students).index("by_user_id", ["userId"]),
});
