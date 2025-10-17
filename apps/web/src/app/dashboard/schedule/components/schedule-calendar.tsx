"use client";

import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { FunctionReturnType } from "convex/server";

export interface ScheduleCalendarProps {
  classes: FunctionReturnType<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

export function ScheduleCalendar({ classes }: ScheduleCalendarProps) {
  // TODO: implement the component to display all the classes
  return <></>;
}
