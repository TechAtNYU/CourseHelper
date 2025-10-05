import type { Doc } from "../../../../../packages/server/convex/_generated/dataModel";
export type Course = Doc<"courses">;

export type TermCourses = {
  term: "Fall" | "Spring" | "Summer" | "J-Term";
  courses: Course[];
};

export type YearPlan = {
  year: "Freshman" | "Sophomore" | "Junior" | "Senior";
  terms: TermCourses[];
};

