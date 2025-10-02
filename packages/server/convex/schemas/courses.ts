import { v } from "convex/values";

const courses = {
  code: v.string(), // CSCI-UA 101
  level: v.string(), // 100
  title: v.string(), // Intro to Computer Science
  credits: v.number(), // 4
  description: v.string(),
  courseUrl: v.string(),
};

const prerequisites = v.union(
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
    creditsRequired: v.number(),
  }),
);

export { courses, prerequisites };
