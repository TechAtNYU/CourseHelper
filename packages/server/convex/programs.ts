import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { internalMutation } from "./_generated/server";
import { protectedQuery } from "./helpers/auth";
import { programs } from "./schemas/programs";
import { schoolName } from "./schemas/schools";

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
      { credits: number; courses: string[][] }
    > = {};

    for (const req of requirements) {
      const { courses } = req;

      if ("creditsRequired" in req && req.creditsRequired) {
        // CASE: Options type with creditsRequired
        const uniquePrefixes = [
          ...new Set(courses.map((c) => c.split(" ")[0])),
        ];

        if (uniquePrefixes.length === 1) {
          // All same prefix - assign all credits to that one prefix
          const prefix = uniquePrefixes[0];
          if (!groupedRequirements[prefix]) {
            groupedRequirements[prefix] = { credits: 0, courses: [] };
          }
          groupedRequirements[prefix].credits += req.creditsRequired;
          groupedRequirements[prefix].courses.push(courses);
        } else {
          // Mixed prefixes - assign to "Other" category
          if (!groupedRequirements.Other) {
            groupedRequirements.Other = { credits: 0, courses: [] };
          }
          groupedRequirements.Other.credits += req.creditsRequired;
          groupedRequirements.Other.courses.push(courses);
        }
      } else {
        // CASE: Required/Alternative type - calculate actual credits per course
        for (const courseCode of courses) {
          const prefix = courseCode.split(" ")[0];
          const course = await getOneFrom(
            ctx.db,
            "courses",
            "by_course_code",
            courseCode,
            "code",
          );
          const credits = course ? course.credits : 4;

          if (!groupedRequirements[prefix]) {
            groupedRequirements[prefix] = { credits: 0, courses: [] };
          }
          groupedRequirements[prefix].credits += credits;
          groupedRequirements[prefix].courses.push([courseCode]);
        }
      }
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
    schools: v.optional(v.array(schoolName)),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { query, schools, paginationOpts }) => {
    if (schools && schools.length > 0) {
      if (query) {
        const results = await Promise.all(
          schools.map((school) =>
            ctx.db
              .query("programs")
              .withSearchIndex("search_name", (q) =>
                q.search("name", query).eq("school", school),
              )
              .paginate(paginationOpts),
          ),
        );

        const allPrograms = results.flatMap((result) => result.page);
        const continueCursor = results.find(
          (result) => result.isDone === false,
        )?.continueCursor;

        return {
          page: allPrograms,
          isDone: results.every((result) => result.isDone),
          continueCursor: continueCursor ?? null,
        };
      }

      const results = await Promise.all(
        schools.map((school) =>
          ctx.db
            .query("programs")
            .withIndex("by_school", (q) => q.eq("school", school))
            .order("desc")
            .paginate(paginationOpts),
        ),
      );

      const allPrograms = results.flatMap((result) => result.page);
      const continueCursor = results.find(
        (result) => result.isDone === false,
      )?.continueCursor;

      return {
        page: allPrograms,
        isDone: results.every((result) => result.isDone),
        continueCursor: continueCursor ?? null,
      };
    }

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
