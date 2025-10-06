import { v } from "convex/values";
import { omit, pick } from "convex-helpers";
import { partial } from "convex-helpers/validators";
import { protectedMutation, protectedQuery } from "./helpers/auth";
import { userCourses } from "./schemas/courses";

export const getUserCourses = protectedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("userCourses")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user.subject))
      .collect();
  },
});

export const getUserCoursesByTerm = protectedQuery({
  args: pick(userCourses, ["term", "year"]),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userCourses")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user.subject))
      .filter((q) =>
        q.and(
          q.eq(q.field("term"), args.term),
          q.eq(q.field("year"), args.year),
        ),
      )
      .collect();
  },
});

export const createUserCourse = protectedMutation({
  args: omit(userCourses, ["userId"]),
  handler: async (ctx, args) => {
    return await ctx.db.insert("userCourses", {
      userId: ctx.user.subject,
      ...args,
    });
  },
});

export const updateUserCourse = protectedMutation({
  args: {
    id: v.id("userCourses"),
    ...partial(omit(userCourses, ["userId", "courseId"])),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const userCourse = await ctx.db.get(id);

    if (!userCourse || userCourse.userId !== ctx.user.subject) {
      throw new Error("User course not found or unauthorized");
    }

    return await ctx.db.patch(id, updates);
  },
});

export const deleteUserCourse = protectedMutation({
  args: { id: v.id("userCourses") },
  handler: async (ctx, args) => {
    const userCourse = await ctx.db.get(args.id);

    if (!userCourse || userCourse.userId !== ctx.user.subject) {
      throw new Error("User course not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
