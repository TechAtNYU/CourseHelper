import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  mockProgramsData,
  mockRequirementsData,
  additionalMockPrograms,
} from "./mockData";

/**
 * Seed the database with mock NYU CS curriculum data
 * Call this mutation from the Convex dashboard to populate your database
 */
export const seedMockData = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting to seed mock data...");

    // Insert the main Computer Science (BA) program
    const programId = await ctx.runMutation(
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
    const additionalProgramIds = [];
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

    return {
      success: true,
      programId,
      additionalProgramIds,
      requirementsCount: mockRequirementsData.length,
    };
  },
});

/**
 * Clear all programs and requirements from the database
 * Use this to reset your database before re-seeding
 */
export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing all programs and requirements...");

    // Delete all requirements first (due to foreign key relationship)
    const allRequirements = await ctx.db.query("requirements").collect();
    for (const req of allRequirements) {
      await ctx.db.delete(req._id);
    }

    // Delete all programs
    const allPrograms = await ctx.db.query("programs").collect();
    for (const program of allPrograms) {
      await ctx.db.delete(program._id);
    }

    console.log(
      `Deleted ${allRequirements.length} requirements and ${allPrograms.length} programs`,
    );

    return {
      success: true,
      deletedRequirements: allRequirements.length,
      deletedPrograms: allPrograms.length,
    };
  },
});
