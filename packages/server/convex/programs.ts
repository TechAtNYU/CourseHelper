import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { programs } from "./schemas/programs";

export const getProgramById = protectedQuery({
  args: { id: v.id("programs") },
  handler: async (ctx, args) => {
    const program = await ctx.db.get(args.id);
    if (!program) return null;

    const requirements = await ctx.db
      .query("requirements")
      .withIndex("by_program", (q) => q.eq("programId", args.id))
      .collect();

    const requirementsWithoutProgramId = requirements.map(
      ({ programId, ...rest }) => rest,
    );

    return {
      ...program,
      requirements: requirementsWithoutProgramId,
    };
  },
});

export const getProgramByName = protectedQuery({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const program = await ctx.db
      .query("programs")
      .withIndex("by_program_name", (q) => q.eq("name", args.name))
      .unique();

    if (!program) return null;

    const requirements = await ctx.db
      .query("requirements")
      .withIndex("by_program", (q) => q.eq("programId", program._id))
      .collect();

    const requirementsWithoutProgramId = requirements.map(
      ({ programId, ...rest }) => rest,
    );

    return {
      ...program,
      requirements: requirementsWithoutProgramId,
    };
  },
});

export const upsertProgramInternal = internalMutation({
  args: programs,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("programs")
      .withIndex("by_program_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("programs", args);
    }
  },
});
