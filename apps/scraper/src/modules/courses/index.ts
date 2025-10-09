/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: bypass for now */
import type {
  ZUpsertCourse,
  ZUpsertPrerequisites,
} from "@dev-team-fall-25/server/convex/http";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as z from "zod/mini";

export type CoursePrerequisite = Omit<
  z.infer<typeof ZUpsertPrerequisites>[number],
  "courseId"
>;

export async function discoverCourses(url: string): Promise<string[]> {
  // TODO: implement this function
  return [];
}

export async function scrapeCourse(
  url: string,
  db: DrizzleD1Database,
  env: CloudflareBindings,
): Promise<{
  course: z.infer<typeof ZUpsertCourse>;
  prerequisites: CoursePrerequisite[];
}> {
  // TODO: implement this function
  throw new Error("Not implemented");
}
