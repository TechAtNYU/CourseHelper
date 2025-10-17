import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
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

export const getPrograms = protectedQuery({
  args: {
    query: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { query, paginationOpts }) => {
    if (query) {
      return await ctx.db
        .query("programs")
        .withSearchIndex("search_name", (q) => q.search("name", query))
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("programs")
      .order("desc")
      .paginate(paginationOpts);
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
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("programs", args);
    }
  },
});
