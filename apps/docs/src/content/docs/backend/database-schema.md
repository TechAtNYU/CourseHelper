# Database Schema

The Convex database schema for AlbertPlus is defined in the `packages/server/convex/schema.ts` file. It is organized into several tables that store information about courses, programs, users, and their relationships.

## Core Tables

| Table                 | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `appConfigs`          | Stores key-value pairs for application configuration.                       |
| `programs`            | Contains information about academic programs (majors, minors, etc.).        |
| `requirements`        | Defines the course requirements for each academic program.                  |
| `courses`             | A catalog of all available courses.                                         |
| `prerequisites`       | Stores the prerequisite relationships between courses.                      |
| `courseOfferings`     | Represents specific sections of a course offered in a particular term.      |
| `userCourses`         | Stores the courses that a user has completed, typically from a degree audit. |
| `userCourseOfferings` | Links users to the specific course offerings they have added to their schedule. |
| `students`            | Stores student-specific information, linked to a Clerk user ID.             |
| `schools`             | A list of the different schools within NYU.                                 |

## Schema Definition

The schema is defined using the `defineSchema` and `defineTable` functions from the Convex server library. Indexes are created on various fields to optimize query performance. For example, the `courses` table has indexes on `code`, `level`, and `school`, as well as a search index on the `title` field.

```typescript
import { defineSchema, defineTable } from "convex/server";
// ... import table definitions

export default defineSchema({
  appConfigs: defineTable(appConfigs).index("by_key", ["key"]),
  programs: defineTable(programs)
    .index("by_program_name", ["name"])
    .searchIndex("search_name", { searchField: "name" }),
  // ... other table definitions
});
```

This structured schema ensures data integrity and provides a foundation for building the application's features.
