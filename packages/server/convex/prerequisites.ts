import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { prerequisites } from "./schemas/courses";

export const getPrerequisite = protectedQuery({
  args: { id: v.id("prerequisites") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPrerequisitesByCourse = protectedQuery({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prerequisites")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const createPrerequisitesInternal = internalMutation({
  args: {
    prerequisites: v.array(prerequisites),
  },
  handler: async (ctx, args) => {
    for (const newPrereq of args.prerequisites) {
      if (newPrereq.type === "options") {
        return await ctx.db.insert("prerequisites", {
          courseId: newPrereq.courseId,
          type: newPrereq.type,
          courses: newPrereq.courses,
          creditsRequired: newPrereq.creditsRequired,
        });
      } else {
        return await ctx.db.insert("prerequisites", {
          courseId: newPrereq.courseId,
          type: newPrereq.type,
          courses: newPrereq.courses,
        });
      }
    }
  },
});

export const deletePrerequisitesByCourseInternal = internalMutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const prerequisitesToDelete = await ctx.db
      .query("prerequisites")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    for (const prerequisite of prerequisitesToDelete) {
      await ctx.db.delete(prerequisite._id);
    }
  },
});
