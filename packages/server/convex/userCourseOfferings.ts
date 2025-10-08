import { v } from "convex/values";
import { omit } from "convex-helpers";
import { protectedMutation, protectedQuery } from "./helpers/auth";
import { userCourseOfferings } from "./schemas/courseOfferings";

export const getUserCourseOfferings = protectedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("userCourseOfferings")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user.subject))
      .collect();
  },
});

export const addUserCourseOffering = protectedMutation({
  args: omit(userCourseOfferings, ["userId"]),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userCourseOfferings")
      .withIndex("by_user", (q) => q.eq("userId", ctx.user.subject))
      .filter((q) => q.eq(q.field("courseOffering"), args.courseOffering))
      .unique();

    if (existing) {
      throw new Error("Course offering already added to user schedule");
    }

    return await ctx.db.insert("userCourseOfferings", {
      userId: ctx.user.subject,
      courseOffering: args.courseOffering,
      alternativeOf: args.alternativeOf,
    });
  },
});

export const updateUserCourseOffering = protectedMutation({
  args: {
    id: v.id("userCourseOfferings"),
    ...omit(userCourseOfferings, ["userId"]),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const userOffering = await ctx.db.get(id);

    if (!userOffering || userOffering.userId !== ctx.user.subject) {
      throw new Error("User course offering not found or unauthorized");
    }

    return await ctx.db.patch(args.id, updates);
  },
});

export const removeUserCourseOffering = protectedMutation({
  args: { id: v.id("userCourseOfferings") },
  handler: async (ctx, args) => {
    const userOffering = await ctx.db.get(args.id);

    if (!userOffering || userOffering.userId !== ctx.user.subject) {
      throw new Error("User course offering not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
