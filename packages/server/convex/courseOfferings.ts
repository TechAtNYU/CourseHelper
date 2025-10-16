import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { courseOfferings } from "./schemas/courseOfferings";

export const getCourseOfferingById = protectedQuery({
  args: { id: v.id("courseOfferings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCourseOfferingsByTerm = protectedQuery({
  args: {
    term: v.union(
      v.literal("spring"),
      v.literal("summer"),
      v.literal("fall"),
      v.literal("j-term"),
    ),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courseOfferings")
      .withIndex("by_term_year", (q) =>
        q.eq("term", args.term).eq("year", args.year),
      )
      .collect();
  },
});

export const getCourseOfferingsByCourseTerm = protectedQuery({
  args: {
    courseCode: v.string(),
    term: v.union(
      v.literal("spring"),
      v.literal("summer"),
      v.literal("fall"),
      v.literal("j-term"),
    ),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courseOfferings")
      .withIndex("by_course_term_section", (q) =>
        q
          .eq("courseCode", args.courseCode)
          .eq("term", args.term)
          .eq("year", args.year),
      )
      .collect();
  },
});

export const upsertCourseOfferingInternal = internalMutation({
  args: courseOfferings,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courseOfferings")
      .withIndex("by_course_term_section", (q) =>
        q
          .eq("courseCode", args.courseCode)
          .eq("term", args.term)
          .eq("year", args.year)
          .eq("section", args.section),
      )
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("courseOfferings", args);
    }
  },
});
