import type { Doc } from "@dev-team-fall-25/server/convex/_generated/dataModel";

export type Course = Doc<"courses">;
export type CourseOffering = Doc<"courseOfferings">;

export interface CourseWithOfferings extends Course {
  offerings: CourseOffering[];
}
