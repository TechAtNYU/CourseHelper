import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { prerequisites } from "./schemas/courses";

export const getPrerequisite = query({
  args: { id: v.id("prerequisites") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPrerequisitesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prerequisites")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const createPrerequisite = mutation({
  args: {
    courseId: v.id("courses"),
    type: v.union(
      v.literal("required"),
      v.literal("alternative"),
      v.literal("options"),
    ),
    courses: v.array(v.string()),
    creditsRequired: v.optional(v.int64()),
  },
  handler: async (ctx, args) => {
    if (args.type === "options") {
      if (args.creditsRequired === undefined) {
        throw new Error("creditsRequired is required for options type");
      }
      return await ctx.db.insert("prerequisites", {
        courseId: args.courseId,
        type: args.type,
        courses: args.courses,
        creditsRequired: args.creditsRequired,
      });
    } else {
      return await ctx.db.insert("prerequisites", {
        courseId: args.courseId,
        type: args.type,
        courses: args.courses,
      });
    }
  },
});

export const deletePrerequisite = mutation({
  args: { id: v.id("prerequisites") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deletePrerequisitesByCourse = mutation({
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
