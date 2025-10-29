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

Before running the seed scripts, you need to configure:

### For Node.js Script (`seed.js`)

Edit the configuration section at the top of `seed.js`:

```javascript
// Your Convex deployment URL
const CONVEX_URL = process.env.CONVEX_URL || "https://your-deployment.convex.cloud";

// User ID for testing - all user-specific data will be created for this user
const TEST_USER_ID = process.env.TEST_USER_ID || "user_test_123";
```

Or set environment variables:

```bash
export CONVEX_URL="https://your-deployment.convex.cloud"
export TEST_USER_ID="user_2abc123xyz"
```

## Usage

### Method 1: Simple Seeding (JSONL Import)

For basic tables that don't require complex relationships:

```bash
# Make the script executable
chmod +x seed-simple.sh

# Run the script
./seed-simple.sh
```

This seeds:
- appConfigs
- programs
- courses
- courseOfferings
- userCourseOfferings

### Method 2: Complete Seeding (Node.js)

For all tables including complex relationships:

```bash
# Install dependencies (if needed)
npm install convex

# Run the seeding script
node seed.js
```

This seeds all tables including:
- All tables from Method 1
- prerequisites (with course relationships)
- requirements (with program relationships)
- students (with program associations)
- userCourses (with user data)

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

### JSONL Format (`.jsonl`)
One JSON object per line, used for simple imports:

```jsonl
{"key":"current_term","value":"fall"}
{"key":"current_year","value":"2025"}
```

### JSON Format (`.json`)
Standard JSON arrays, used for complex data:

```json
[
  {
    "courseCode": "CSCI-UA 102",
    "type": "required",
    "courses": ["CSCI-UA 101"]
  }
]
```

## Customization

To customize the sample data:

1. Edit the respective `.json` or `.jsonl` files
2. Maintain the schema structure as defined in `convex/schemas/`
3. Ensure referential integrity (e.g., course codes match between files)

## Troubleshooting

### "Course not found" errors
Ensure all course codes referenced in prerequisites and requirements exist in `courses.jsonl`.

### "Program not found" errors
Ensure all program names referenced in requirements and students exist in `programs.jsonl`.

### Authentication errors
Verify your Convex deployment URL and ensure you have proper access credentials.

### User ID not found in dashboard
Make sure you're using the correct user ID format (e.g., Clerk user IDs start with `user_`).

## Integration with Existing Scripts

The repository already has a script for seeding appConfigs:

```bash
npm run seed:configs
```

This is equivalent to running:

```bash
convex import --table appConfigs --replace seed/appConfigs.jsonl
```

You can add similar scripts to `package.json` for other tables.

## Notes

- The `--replace` flag will delete existing data before importing
- Use caution when running in production environments
- Consider backing up data before running seed scripts
- The Node.js script requires the Convex API endpoints to be properly defined in your `convex/` directory
