import type { Doc } from "@albert-plus/server/convex/_generated/dataModel";
import type { DayOptionValue } from "./components/DaysOfWeek";

export type Course = Doc<"courses">;
export type CourseOffering = Doc<"courseOfferings">;

export interface CourseWithOfferings extends Course {
  offerings: CourseOffering[];
}

export interface FilterState {
  creditFilter: number | null;
  selectedDays: DayOptionValue[];
}

export type FilterAction =
  | { type: "SET_CREDIT"; payload: number | null }
  | { type: "SET_DAYS"; payload: DayOptionValue[] }
  | { type: "RESET_FILTERS" };
