import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requirements } from "./schemas/programs";

export const getRequirement = query({
  args: { id: v.id("requirements") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getRequirementsByProgram = query({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("requirements")
      .withIndex("by_program", (q) => q.eq("programId", args.programId))
      .collect();
  },
});

export const createRequirement = mutation({
  args: {
    programId: v.id("programs"),
    isMajor: v.boolean(),
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
      return await ctx.db.insert("requirements", {
        programId: args.programId,
        isMajor: args.isMajor,
        type: args.type,
        courses: args.courses,
        creditsRequired: args.creditsRequired,
      });
    } else {
      return await ctx.db.insert("requirements", {
        programId: args.programId,
        isMajor: args.isMajor,
        type: args.type,
        courses: args.courses,
      });
    }
  },
});

export const deleteRequirement = mutation({
  args: { id: v.id("requirements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteRequirementsByProgram = mutation({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    const requirementsToDelete = await ctx.db
      .query("requirements")
      .withIndex("by_program", (q) => q.eq("programId", args.programId))
      .collect();

    for (const requirement of requirementsToDelete) {
      await ctx.db.delete(requirement._id);
    }
  },
});
