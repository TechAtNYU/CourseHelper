import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import {
  additionalMockPrograms,
  mockCoursesData,
  mockProgramsData,
  mockRequirementsData,
  mockUserCoursesData,
} from "./mockData";

/**
 * Seed the database with mock NYU CS curriculum data
 * Call this mutation from the Convex dashboard to populate your database
 *
 * @param userId - Optional user ID to associate with user courses. If not provided, uses a default mock user ID.
 */
export const seedMockData = internalMutation({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Starting to seed mock data...");

    // Insert courses
    const courseIds: Id<"courses">[] = [];
    for (const course of mockCoursesData) {
      const courseId = await ctx.runMutation(
        internal.courses.upsertCourseInternal,
        course,
      );
      courseIds.push(courseId);
    }
    console.log(`Created ${mockCoursesData.length} courses`);

    // Insert the main Computer Science (BA) program
    const programId: Id<"programs"> = await ctx.runMutation(
      internal.programs.upsertProgramInternal,
      mockProgramsData.program,
    );

    console.log("Created program:", programId);

    // Insert requirements for the CS program
    if (mockRequirementsData.length > 0) {
      // First delete any existing requirements
      await ctx.runMutation(
        internal.requirements.deleteRequirementsByProgramInternal,
        { programId },
      );

      // Then create new requirements
      await ctx.runMutation(internal.requirements.createRequirementsInternal, {
        requirements: mockRequirementsData.map((req) => ({
          ...req,
          programId,
        })),
      });

      console.log(`Created ${mockRequirementsData.length} requirements`);
    }

    // Insert additional programs
    const additionalProgramIds: Id<"programs">[] = [];
    for (const program of additionalMockPrograms) {
      const id = await ctx.runMutation(
        internal.programs.upsertProgramInternal,
        program,
      );
      additionalProgramIds.push(id);
    }

    console.log(
      `Created ${additionalMockPrograms.length} additional programs:`,
      additionalProgramIds,
    );

    // Insert user courses (if userId is provided)
    const userCourseIds: Id<"userCourses">[] = [];
    if (args.userId) {
      for (const userCourse of mockUserCoursesData) {
        const userCourseId = await ctx.db.insert("userCourses", {
          ...userCourse,
          userId: args.userId,
        });
        userCourseIds.push(userCourseId);
      }
      console.log(
        `Created ${mockUserCoursesData.length} user courses for user: ${args.userId}`,
      );
    } else {
      console.log("Skipped user courses (no userId provided)");
    }

    return {
      success: true,
      courseIds,
      programId,
      additionalProgramIds,
      requirementsCount: mockRequirementsData.length,
      userCourseIds,
    };
  },
});

/**
 * Clear all data from the database
 * Use this to reset your database before re-seeding
 */
export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing all data...");

    // Delete all user courses first (no foreign keys)
    const allUserCourses = await ctx.db.query("userCourses").collect();
    for (const userCourse of allUserCourses) {
      await ctx.db.delete(userCourse._id);
    }

    // Delete all requirements (references programs)
    const allRequirements = await ctx.db.query("requirements").collect();
    for (const req of allRequirements) {
      await ctx.db.delete(req._id);
    }

    // Delete all prerequisites (references courses)
    const allPrerequisites = await ctx.db.query("prerequisites").collect();
    for (const prereq of allPrerequisites) {
      await ctx.db.delete(prereq._id);
    }

    // Delete all programs
    const allPrograms = await ctx.db.query("programs").collect();
    for (const program of allPrograms) {
      await ctx.db.delete(program._id);
    }

    // Delete all courses
    const allCourses = await ctx.db.query("courses").collect();
    for (const course of allCourses) {
      await ctx.db.delete(course._id);
    }

    console.log(
      `Deleted ${allUserCourses.length} user courses, ${allRequirements.length} requirements, ${allPrerequisites.length} prerequisites, ${allPrograms.length} programs, and ${allCourses.length} courses`,
    );

    return {
      success: true,
      deletedUserCourses: allUserCourses.length,
      deletedRequirements: allRequirements.length,
      deletedPrerequisites: allPrerequisites.length,
      deletedPrograms: allPrograms.length,
      deletedCourses: allCourses.length,
    };
  },
});
