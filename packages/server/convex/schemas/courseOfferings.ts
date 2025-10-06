import { v } from "convex/values";

const courseOfferings = {
  courseId: v.id("courses"),
  title: v.string(),
  sectionNumber: v.string(),
  year: v.number(), // 2025
  term: v.union(
    v.literal("spring"),
    v.literal("summer"),
    v.literal("fall"),
    v.literal("j-term"),
  ),
  instructor: v.string(),
  location: v.string(),
  days: v.array(
    v.union(
      v.literal("monday"),
      v.literal("tuesday"),
      v.literal("wednesday"),
      v.literal("thursday"),
      v.literal("friday"),
      v.literal("saturday"),
      v.literal("sunday"),
    ),
  ),
  startTime: v.string(), // 13:00
  endTime: v.string(), // 14:15
  status: v.union(
    v.literal("open"),
    v.literal("closed"),
    v.literal("waitlist"),
  ),
  waitlistNum: v.number(),
};

const userCourseOfferings = {
  userId: v.string(),
  courseOffering: v.id("courseOfferings"),
  alternativeOf: v.optional(v.id("userCourseOfferings")),
};

export { courseOfferings, userCourseOfferings };
