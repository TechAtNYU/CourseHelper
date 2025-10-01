import { v } from "convex/values";
import { protectedMutation, protectedQuery } from "./helpers/auth";
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

export const deleteProgram = protectedMutation({
  args: { id: v.id("programs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const upsertProgram = protectedMutation({
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
