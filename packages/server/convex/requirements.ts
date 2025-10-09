import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { requirements } from "./schemas/programs";

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

export const createRequirementsInternal = internalMutation({
  args: {
    requirements: v.array(requirements),
  },
  handler: async (ctx, args) => {
    for (const newReq of args.requirements) {
      if (newReq.type === "options") {
        return await ctx.db.insert("requirements", {
          programId: newReq.programId,
          isMajor: newReq.isMajor,
          type: newReq.type,
          courses: newReq.courses,
          courseLevels: newReq.courseLevels,
          creditsRequired: newReq.creditsRequired,
        });
      } else {
        return await ctx.db.insert("requirements", {
          programId: newReq.programId,
          isMajor: newReq.isMajor,
          type: newReq.type,
          courses: newReq.courses,
        });
      }
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
