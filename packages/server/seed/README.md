# AlbertPlus Database Seeding

This directory contains sample data and scripts for seeding the AlbertPlus Convex database.

## Overview

The seeding system provides comprehensive sample data for all database tables, including:

- **appConfigs**: Application configuration settings
- **programs**: Academic programs (BA, BS, MS)
- **courses**: Course catalog with descriptions
- **courseOfferings**: Specific course sections with schedules
- **prerequisites**: Course prerequisite relationships
- **requirements**: Program requirements
- **students**: Student profiles
- **userCourses**: Courses taken by users
- **userCourseOfferings**: User course registrations

## Configuration

### Environment Variables

The seeding script requires:

1. **`CONVEX_URL`** - Your Convex deployment URL
   - Automatically set when using `doppler run`
   - Or set manually: `export CONVEX_URL="https://your-deployment.convex.cloud"`

2. **`TEST_USER_ID`** - Your Clerk user ID for user-specific data
   - **Required**: `export TEST_USER_ID="user_2abc123xyz"`
   - All students, userCourses, and userCourseOfferings will use this ID

## Usage

### Prerequisites

1. Make sure you have Convex CLI configured and deployed
2. Set your `CONVEX_URL` environment variable (or use `doppler`)
3. Set your `TEST_USER_ID` to your actual Clerk user ID

### Seeding the Database

```bash
# Navigate to the server directory
cd packages/server

# Set your user ID (replace with your actual Clerk user ID)
export TEST_USER_ID="user_2abc123xyz"

# Run the seeding script
bun seed/seed.ts
```

Or if you're using Doppler for environment management:

```bash
cd packages/server
export TEST_USER_ID="user_2abc123xyz"
doppler run -- bun seed/seed.ts
```

### What Gets Seeded

The script seeds **all tables** in the correct order with proper relationship handling:

1. **appConfigs** - Application configuration
2. **programs** - Academic programs
3. **courses** - Course catalog
4. **prerequisites** - Course prerequisites (with course ID relationships)
5. **requirements** - Program requirements (with program ID relationships)
6. **courseOfferings** - Course sections
7. **students** - Student profiles (with program ID relationships)
8. **userCourses** - Completed courses
9. **userCourseOfferings** - Course registrations

## Sample Data Details

### Programs (6 programs)
- Computer Science (BA)
- Computer Science (BS)
- Data Science (BS)
- Mathematics (BA)
- Economics (BA)
- Computer Science (MS)

### Courses (15 courses)
- CSCI-UA 101: Introduction to Computer Science
- CSCI-UA 102: Data Structures
- CSCI-UA 201: Computer Systems Organization
- CSCI-UA 202: Operating Systems
- CSCI-UA 310: Basic Algorithms
- CSCI-UA 480: Special Topics in Computer Science
- CSCI-UA 479: Data Management and Analysis
- MATH-UA 120: Discrete Mathematics
- MATH-UA 121: Calculus I
- MATH-UA 122: Calculus II
- CORE-UA 214: Physical Science: How Things Work
- PHIL-UA 20: Ancient Greek and Roman Philosophy
- ECON-UA 1: Microeconomics
- ECON-UA 2: Macroeconomics
- DSGA-UA 201: Introduction to Data Science

### Course Offerings (21 sections)
- Spring 2025: 19 sections
- Fall 2025: 2 sections
- Various times, locations, and instructors
- Mix of open, closed, and waitlist statuses

### User Data

All user-specific data (students, userCourses, userCourseOfferings) will be created for the configured `TEST_USER_ID`. This includes:

- **1 student profile** with the configured user ID
- **19 completed courses** across multiple semesters
- **10 course registrations** for upcoming semester

The sample data represents a realistic student journey through a Computer Science program.

## File Formats

All seed data files use standard **JSON format** (`.json`) with arrays of objects:

```json
[
  {
    "key": "current_term",
    "value": "fall"
  },
  {
    "key": "current_year",
    "value": "2025"
  }
]
```

This format is:
- Easy to read and edit in any text editor
- Supports syntax highlighting and validation
- Compatible with Convex internal mutations
- Standard JSON that works with all tools

## How It Works

The seeding system uses a **Convex internal mutation** (`convex/seed.ts`) that:

1. Accepts all seed data as arguments
2. Handles relationships by creating ID maps for programs and courses
3. Uses upsert logic (updates existing records or creates new ones)
4. Maintains referential integrity across all tables

The TypeScript script (`seed/seed.ts`):

1. Reads all JSON seed files
2. Replaces user IDs with your `TEST_USER_ID`
3. Calls the internal mutation with all data
4. Reports success or errors

## Customization

To customize the sample data:

1. Edit the respective `.json` files in any text editor
2. Maintain the schema structure as defined in `convex/schemas/`
3. Ensure referential integrity (e.g., course codes match between files)
4. Validate JSON syntax before running seed scripts

## Troubleshooting

### "CONVEX_URL environment variable is not set"
Set your Convex deployment URL:
```bash
export CONVEX_URL="https://your-deployment.convex.cloud"
```

Or use Doppler which sets it automatically:
```bash
doppler run -- bun seed/seed.ts
```

### "Course not found" warnings
Ensure all course codes referenced in prerequisites and requirements exist in `courses.json`.

### "Program not found" warnings
Ensure all program names referenced in requirements and students exist in `programs.json`.

### User ID not found in dashboard
Make sure you're using the correct user ID format (e.g., Clerk user IDs start with `user_`).

## Adding to package.json

You can add a convenient npm script:

```json
{
  "scripts": {
    "seed": "bun seed/seed.ts"
  }
}
```

Then run:
```bash
export TEST_USER_ID="your_user_id"
npm run seed
```

**Note**: The script is already configured in `package.json`.

## Notes

- The seeding uses **upsert logic** - it updates existing records or creates new ones
- Safe to run multiple times without creating duplicates
- User-specific data (students, userCourses, userCourseOfferings) always uses `TEST_USER_ID`
- Prerequisites and requirements are cleared and recreated each time
- Consider backing up data before running in production environments
