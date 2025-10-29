/**
 * Database Seeding Script for AlbertPlus
 * 
 * This script reads all JSON seed files and calls the Convex internal mutation
 * to seed the database with proper relationship handling.
 * 
 * Usage:
 *   bun seed/seed.ts
 * 
 * Configuration:
 *   Set TEST_USER_ID environment variable to seed data for a specific user
 *   export TEST_USER_ID="user_2abc123xyz"
 */

import { internal } from "../convex/_generated/api.js";
import { ConvexHttpClient } from "convex/browser";

// ============================================================================
// CONFIGURATION
// ============================================================================

// User ID for testing - all user-specific data will be created for this user
const TEST_USER_ID = process.env.TEST_USER_ID || "user_test_123";

// Convex deployment URL from environment
const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ Error: CONVEX_URL environment variable is not set");
  console.error("Please run: export CONVEX_URL=<your-deployment-url>");
  console.error("Or run this script with: doppler run -- bun seed/seed.ts");
  process.exit(1);
}

// ============================================================================

const client = new ConvexHttpClient(CONVEX_URL);

/**
 * Read JSON file using Bun
 */
async function readJSON(filename: string) {
  const file = Bun.file(new URL(filename, import.meta.url));
  return await file.json();
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log("🌱 Loading seed data files...\n");

  try {
    // Load all seed data
    const appConfigs = await readJSON("appConfigs.json");
    const programs = await readJSON("programs.json");
    const courses = await readJSON("courses.json");
    const courseOfferings = await readJSON("courseOfferings.json");
    const prerequisites = await readJSON("prerequisites.json");
    const requirements = await readJSON("requirements.json");
    const studentsData = await readJSON("students.json");
    const userCoursesData = await readJSON("userCourses.json");
    const userCourseOfferingsData = await readJSON("userCourseOfferings.json");

    // Replace user IDs with TEST_USER_ID
    const students = studentsData.map((student: any) => ({
      ...student,
      userId: TEST_USER_ID,
    }));

    const userCourses = userCoursesData.map((course: any) => ({
      ...course,
      userId: TEST_USER_ID,
    }));

    const userCourseOfferings = userCourseOfferingsData.map((offering: any) => ({
      ...offering,
      userId: TEST_USER_ID,
    }));

    console.log(`📊 Loaded seed data:`);
    console.log(`  - ${appConfigs.length} app configs`);
    console.log(`  - ${programs.length} programs`);
    console.log(`  - ${courses.length} courses`);
    console.log(`  - ${courseOfferings.length} course offerings`);
    console.log(`  - ${prerequisites.length} prerequisites`);
    console.log(`  - ${requirements.length} requirements`);
    console.log(`  - ${students.length} students`);
    console.log(`  - ${userCourses.length} user courses`);
    console.log(`  - ${userCourseOfferings.length} user course offerings`);
    console.log(`\n🔑 Using TEST_USER_ID: ${TEST_USER_ID}\n`);

    // Call the internal mutation
    console.log("🚀 Calling Convex internal mutation...\n");
    
    const result = await client.mutation(internal.seed.seedAll, {
      appConfigs,
      programs,
      courses,
      courseOfferings,
      prerequisites,
      requirements,
      students,
      userCourses,
      userCourseOfferings,
    });

    console.log("\n✅ Database seeding completed successfully!");
    console.log(`\n📝 Result:`, result);
    
  } catch (error) {
    console.error("\n❌ Database seeding failed:");
    console.error(error);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Run the seeding
seedDatabase();
