import type { Doc } from "@dev-team-fall-25/server/convex/_generated/dataModel";

export type UserCourse = Omit<
  Doc<"userCourses">,
  "_id" | "_creationTime" | "userId" | "alternativeOf"
>;
export type Term = Doc<"userCourses">["term"];
export type Grade = NonNullable<Doc<"userCourses">["grade"]>;
