import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { courses } from "./schemas/courses";

export const getCourseById = protectedQuery({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCourseByCode = protectedQuery({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_course_code", (q) => q.eq("code", args.code))
      .unique();
  },
});

export const deleteCourseInternal = internalMutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const upsertCourseInternal = internalMutation({
  args: courses,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_course_code", (q) => q.eq("code", args.code))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("courses", args);
    }
  },
});
