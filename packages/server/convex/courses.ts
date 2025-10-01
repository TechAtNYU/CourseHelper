import { v } from "convex/values";
import { partial } from "convex-helpers/validators";
import { mutation, query } from "./_generated/server";
import { courses } from "./schemas/courses";

export const getCourseById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCourseByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_course_code", (q) => q.eq("code", args.code))
      .unique();
  },
});

export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const upsertCourse = mutation({
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
