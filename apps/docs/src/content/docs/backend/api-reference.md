---
title: API Reference
---

# API Reference

The Convex backend exposes a set of serverless functions (queries and mutations) that can be called from the frontend applications. This section provides an overview of the available API, which is defined in the `packages/server/convex/` directory.

## Naming Conventions

-   **Queries**: Functions that read data from the database. They are typically named using `get` or `list` prefixes.
-   **Mutations**: Functions that write data to the database. They are often named using verbs like `create`, `update`, `delete`, or `add`.

## Core API Functions

Below is a summary of some of the key API functions available in the Convex backend.

### `appConfigs`

-   `getAppConfig`: Retrieves a specific application configuration value by its key.
-   `setAppConfig`: Sets the value of an application configuration key (admin-only).

### `courses`

-   `listCourses`: Retrieves a list of all courses, with optional filtering and pagination.
-   `getCourse`: Fetches a single course by its ID.

### `programs`

-   `listPrograms`: Retrieves a list of all academic programs.
-   `getProgram`: Fetches a single program by its ID.

### `userCourses`

-   `getUserCourses`: Retrieves the list of completed courses for the authenticated user.
-   `addUserCourse`: Adds a course to the authenticated user's list of completed courses.

### `userCourseOfferings`

-   `getUserCourseOfferings`: Retrieves the course offerings that the authenticated user has added to their schedule.
-   `addUserCourseOffering`: Adds a course offering to the user's schedule.
-   `removeUserCourseOffering`: Removes a course offering from the user's schedule.

## Full-stack Type Safety

One of the major benefits of using Convex is its end-to-end type safety. The types for all the queries and mutations are automatically generated and can be imported into your frontend code. This eliminates guesswork and prevents bugs by ensuring that you are calling the API with the correct arguments and handling the responses with the correct types.

To use the API in your React components, you can use the `useQuery` and `useMutation` hooks from the `convex/react` library:

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@albert-plus/server/convex/_generated/api";

const MyComponent = () => {
  const courses = useQuery(api.courses.listCourses);
  const addCourse = useMutation(api.userCourses.addUserCourse);

  // ...
};
```
