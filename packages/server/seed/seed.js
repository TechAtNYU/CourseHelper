/**
 * Comprehensive Database Seeding Script for AlbertPlus
 *
 * This script seeds all tables in the Convex database with sample data.
 * It handles dependencies between tables and ensures data integrity.
 *
 * Usage:
 *   node seed.js
 *
 * Requirements:
 *   - Convex CLI installed and configured
 *   - Valid Convex deployment URL
 */

import { ConvexHttpClient } from "convex/browser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { api } from "../convex/_generated/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION - Update these values before running
// ============================================================================

// Your Convex deployment URL
const CONVEX_URL =
  process.env.CONVEX_URL || "https://your-deployment.convex.cloud";

// User ID for testing - all user-specific data will be created for this user
// Replace with your actual Clerk user ID or test user ID
const TEST_USER_ID = process.env.TEST_USER_ID || "user_test_123";

// ============================================================================

// Initialize Convex client
const client = new ConvexHttpClient(CONVEX_URL);

/**
 * Read JSON file
 */
function readJSON(filename) {
  const filepath = path.join(__dirname, filename);
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content);
}

/**
 * Seed app configurations
 */
async function seedAppConfigs() {
  console.log("📝 Seeding appConfigs...");
  const configs = readJSON("appConfigs.json");

  for (const config of configs) {
    try {
      await client.mutation(api.appConfigs.upsert, {
        key: config.key,
        value: config.value,
      });
      console.log(`  ✓ Created config: ${config.key}`);
    } catch (error) {
      console.error(
        `  ✗ Failed to create config ${config.key}:`,
        error.message,
      );
    }
  }
}

/**
 * Seed programs and return mapping of program names to IDs
 */
async function seedPrograms() {
  console.log("📚 Seeding programs...");
  const programs = readJSON("programs.json");
  const programMap = new Map();

  for (const program of programs) {
    try {
      const programId = await client.mutation(api.programs.create, {
        name: program.name,
        level: program.level,
        programUrl: program.programUrl,
      });
      programMap.set(program.name, programId);
      console.log(`  ✓ Created program: ${program.name} (${programId})`);
    } catch (error) {
      console.error(
        `  ✗ Failed to create program ${program.name}:`,
        error.message,
      );
    }
  }

  return programMap;
}

/**
 * Seed courses and return mapping of course codes to IDs
 */
async function seedCourses() {
  console.log("📖 Seeding courses...");
  const courses = readJSON("courses.json");
  const courseMap = new Map();

  for (const course of courses) {
    try {
      const courseId = await client.mutation(api.courses.create, {
        code: course.code,
        program: course.program,
        level: course.level,
        title: course.title,
        credits: course.credits,
        description: course.description,
        courseUrl: course.courseUrl,
      });
      courseMap.set(course.code, courseId);
      console.log(`  ✓ Created course: ${course.code} - ${course.title}`);
    } catch (error) {
      console.error(
        `  ✗ Failed to create course ${course.code}:`,
        error.message,
      );
    }
  }

  return courseMap;
}

/**
 * Seed prerequisites
 */
async function seedPrerequisites(courseMap) {
  console.log("🔗 Seeding prerequisites...");
  const prerequisites = readJSON("prerequisites.json");

  for (const prereq of prerequisites) {
    try {
      const courseId = courseMap.get(prereq.courseCode);
      if (!courseId) {
        console.error(`  ✗ Course not found: ${prereq.courseCode}`);
        continue;
      }

      const prerequisiteData = {
        courseId,
        type: prereq.type,
        courses: prereq.courses,
      };

      if (prereq.type === "options") {
        prerequisiteData.creditsRequired = prereq.creditsRequired;
      }

      await client.mutation(api.prerequisites.create, prerequisiteData);
      console.log(`  ✓ Created prerequisite for: ${prereq.courseCode}`);
    } catch (error) {
      console.error(
        `  ✗ Failed to create prerequisite for ${prereq.courseCode}:`,
        error.message,
      );
    }
  }
}

/**
 * Seed requirements
 */
async function seedRequirements(programMap) {
  console.log("📋 Seeding requirements...");
  const requirements = readJSON("requirements.json");

  for (const req of requirements) {
    try {
      const programId = programMap.get(req.programName);
      if (!programId) {
        console.error(`  ✗ Program not found: ${req.programName}`);
        continue;
      }

      const requirementData = {
        programId,
        isMajor: req.isMajor,
        type: req.type,
        courses: req.courses,
      };

      if (req.type === "options") {
        requirementData.courseLevels = req.courseLevels;
        requirementData.creditsRequired = req.creditsRequired;
      }

      await client.mutation(api.requirements.create, requirementData);
      console.log(
        `  ✓ Created requirement for: ${req.programName} (${req.type})`,
      );
    } catch (error) {
      console.error(
        `  ✗ Failed to create requirement for ${req.programName}:`,
        error.message,
      );
    }
  }
}

/**
 * Seed course offerings
 */
async function seedCourseOfferings() {
  console.log("🗓️  Seeding course offerings...");
  const offerings = readJSON("courseOfferings.json");

  for (const offering of offerings) {
    try {
      await client.mutation(api.courseOfferings.create, offering);
      console.log(
        `  ✓ Created offering: ${offering.courseCode} ${offering.section} (${offering.term} ${offering.year})`,
      );
    } catch (error) {
      console.error(
        `  ✗ Failed to create offering ${offering.courseCode}:`,
        error.message,
      );
    }
  }
}

/**
 * Seed students
 */
async function seedStudents(programMap) {
  console.log("👥 Seeding students...");
  const students = readJSON("students.json");

  for (const student of students) {
    try {
      // Convert program names to program IDs
      const programIds = student.programNames
        .map((name) => programMap.get(name))
        .filter((id) => id !== undefined);

      if (programIds.length === 0) {
        console.error(
          `  ✗ No valid programs found for student ${student.userId}`,
        );
        continue;
      }

      await client.mutation(api.students.create, {
        userId: TEST_USER_ID, // Use configured test user ID
        programs: programIds,
        startingDate: student.startingDate,
        expectedGraduationDate: student.expectedGraduationDate,
      });
      console.log(
        `  ✓ Created student for user: ${TEST_USER_ID} with programs: ${student.programNames.join(", ")}`,
      );
    } catch (error) {
      console.error(`  ✗ Failed to create student:`, error.message);
    }
  }
}

/**
 * Seed user courses
 */
async function seedUserCourses() {
  console.log("📚 Seeding user courses...");
  const userCourses = readJSON("userCourses.json");

  for (const userCourse of userCourses) {
    try {
      await client.mutation(api.userCourses.create, {
        ...userCourse,
        userId: TEST_USER_ID, // Use configured test user ID
      });
      console.log(
        `  ✓ Created user course: ${userCourse.courseCode} - ${userCourse.title}`,
      );
    } catch (error) {
      console.error(
        `  ✗ Failed to create user course ${userCourse.courseCode}:`,
        error.message,
      );
    }
  }
}

/**
 * Seed user course offerings
 */
async function seedUserCourseOfferings() {
  console.log("🎯 Seeding user course offerings...");
  const userOfferings = readJSON("userCourseOfferings.json");

  for (const offering of userOfferings) {
    try {
      await client.mutation(api.userCourseOfferings.create, {
        userId: TEST_USER_ID, // Use configured test user ID
        classNumber: offering.classNumber,
      });
      console.log(
        `  ✓ Created user course offering: class ${offering.classNumber}`,
      );
    } catch (error) {
      console.error(
        `  ✗ Failed to create user course offering for class ${offering.classNumber}:`,
        error.message,
      );
    }
  }
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Seed in order of dependencies
    await seedAppConfigs();
    console.log();

    const programMap = await seedPrograms();
    console.log();

    const courseMap = await seedCourses();
    console.log();

    await seedPrerequisites(courseMap);
    console.log();

    await seedRequirements(programMap);
    console.log();

    await seedCourseOfferings();
    console.log();

    await seedStudents(programMap);
    console.log();

    await seedUserCourses();
    console.log();

    await seedUserCourseOfferings();
    console.log();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
