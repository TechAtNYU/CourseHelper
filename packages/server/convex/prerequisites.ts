import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { prerequisites } from "./schemas/courses";

export const createPrerequisitesInternal = internalMutation({
  args: {
    prerequisites: v.array(prerequisites),
  },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.prerequisites.map((newPrereq) => {
        if (newPrereq.type === "options") {
          return ctx.db.insert("prerequisites", {
            courseId: newPrereq.courseId,
            type: newPrereq.type,
            courses: newPrereq.courses,
            creditsRequired: newPrereq.creditsRequired,
          });
        }
        return ctx.db.insert("prerequisites", {
          courseId: newPrereq.courseId,
          type: newPrereq.type,
          courses: newPrereq.courses,
        });
      }),
    );
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
