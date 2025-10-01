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
import type * as courses from "../courses.js";
import type * as prerequisites from "../prerequisites.js";
import type * as programs from "../programs.js";
import type * as requirements from "../requirements.js";
import type * as schemas_courses from "../schemas/courses.js";
import type * as schemas_programs from "../schemas/programs.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  courses: typeof courses;
  prerequisites: typeof prerequisites;
  programs: typeof programs;
  requirements: typeof requirements;
  "schemas/courses": typeof schemas_courses;
  "schemas/programs": typeof schemas_programs;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
