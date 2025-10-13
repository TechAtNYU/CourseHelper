import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { programs } from "./schemas/programs";

export const getProgram = protectedQuery({
  args: { id: v.id("programs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProgramByName = protectedQuery({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("programs")
      .withIndex("by_program_name", (q) => q.eq("name", args.name))
      .unique();
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
