/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as courseOfferings from "../courseOfferings.js";
import type * as courses from "../courses.js";
import type * as helpers_auth from "../helpers/auth.js";
import type * as http from "../http.js";
import type * as prerequisites from "../prerequisites.js";
import type * as programs from "../programs.js";
import type * as requirements from "../requirements.js";
import type * as schemas_courseOfferings from "../schemas/courseOfferings.js";
import type * as schemas_courses from "../schemas/courses.js";
import type * as schemas_programs from "../schemas/programs.js";
import type * as userCourseOfferings from "../userCourseOfferings.js";
import type * as userCourses from "../userCourses.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  courseOfferings: typeof courseOfferings;
  courses: typeof courses;
  "helpers/auth": typeof helpers_auth;
  http: typeof http;
  prerequisites: typeof prerequisites;
  programs: typeof programs;
  requirements: typeof requirements;
  "schemas/courseOfferings": typeof schemas_courseOfferings;
  "schemas/courses": typeof schemas_courses;
  "schemas/programs": typeof schemas_programs;
  userCourseOfferings: typeof userCourseOfferings;
  userCourses: typeof userCourses;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
