import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";

export const getRequirement = protectedQuery({
  args: { id: v.id("requirements") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getRequirementsByProgram = protectedQuery({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("requirements")
      .withIndex("by_program", (q) => q.eq("programId", args.programId))
      .collect();
  },
});

export const createRequirementInternal = internalMutation({
  args: {
    programId: v.id("programs"),
    isMajor: v.boolean(),
    type: v.union(
      v.literal("required"),
      v.literal("alternative"),
      v.literal("options"),
    ),
    courses: v.array(v.string()),
    creditsRequired: v.optional(v.number()),
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

export const deleteRequirementsByProgramInternal = internalMutation({
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
