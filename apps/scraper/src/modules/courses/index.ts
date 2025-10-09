/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: bypass for now */
import type {
  ZCreatePrerequisites,
  ZUpsertCourse,
} from "@dev-team-fall-25/server/convex/http";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as z from "zod/mini";

export type CoursePrerequisite = Omit<
  z.infer<typeof ZCreatePrerequisites>[number],
  "courseId"
>;

export async function discoverCourses(url: string): Promise<string[]> {
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
  throw new Error("Not implemented");
}
