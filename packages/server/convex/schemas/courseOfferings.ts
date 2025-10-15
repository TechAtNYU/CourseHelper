import { v } from "convex/values";

const courseOfferings = {
  courseCode: v.string(), // course code
  title: v.string(),
  section: v.string(), // 001
  year: v.number(), // 2025
  term: v.union(
    v.literal("spring"),
    v.literal("summer"),
    v.literal("fall"),
    v.literal("j-term"),
  ),
  instructor: v.string(),
  location: v.optional(v.string()),
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
  waitlistNum: v.optional(v.number()),
  corequisite: v.optional(v.array(v.string())), // course code
};

const userCourseOfferings = {
  userId: v.string(),
  courseOfferingId: v.id("courseOfferings"),
  alternativeOf: v.optional(v.id("userCourseOfferings")),
};

export { courseOfferings, userCourseOfferings };
