import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { programs } from "./schemas/programs";

export const getProgramById = protectedQuery({
  args: { id: v.id("programs") },
  handler: async (ctx, args) => {
    const program = await ctx.db.get(args.id);
    if (!program) return null;

    const requirements = await getManyFrom(
      ctx.db,
      "requirements",
      "by_program",
      args.id,
      "programId",
    );

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

    const requirements = await getManyFrom(
      ctx.db,
      "requirements",
      "by_program",
      program._id,
      "programId",
    );

    const requirementsWithoutProgramId = requirements.map(
      ({ programId, ...rest }) => rest,
    );

    return {
      ...program,
      requirements: requirementsWithoutProgramId,
    };
  },
});

export const getProgramWithGroupedRequirements = protectedQuery({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const program = await ctx.db
      .query("programs")
      .withIndex("by_program_name", (q) => q.eq("name", args.name))
      .unique();

    if (!program) return null;

    const requirements = await getManyFrom(
      ctx.db,
      "requirements",
      "by_program",
      program._id,
      "programId",
    );

    // Calculate total credits for each category
    const groupedRequirements: Record<
      string,
      { credits: number; courses: string[] }
    > = {};

    for (const req of requirements) {
      const { programId, category, courses, ...rest } = req;
      let totalCredits = 0;

      // Check if this is an "options" type with creditsRequired
      if ("creditsRequired" in req && req.creditsRequired) {
        totalCredits = req.creditsRequired;
      } else {
        // Calculate credits from actual courses
        for (const courseCode of courses) {
          const course = await getOneFrom(
            ctx.db,
            "courses",
            "by_course_code",
            courseCode,
            "code",
          );
          if (course) {
            totalCredits += course.credits;
          }
          // TODO: better error handling if course doesn't exist
          else {
            totalCredits += 4;
          }
        }
      }

      // Add to grouped requirements
      if (!groupedRequirements[category]) {
        groupedRequirements[category] = { credits: 0, courses: [] };
      }
      groupedRequirements[category].credits += totalCredits;
      groupedRequirements[category].courses.push(...courses);
    }

    return {
      ...program,
      requirementsByCategory: groupedRequirements,
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
