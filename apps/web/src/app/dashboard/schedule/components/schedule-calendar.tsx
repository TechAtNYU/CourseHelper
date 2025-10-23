"use client";

import type { api } from "@dev-team-fall-25/server/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import Schedule from "@/components/comp-542";

export interface ScheduleCalendarProps {
  classes: FunctionReturnType<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

export function ScheduleCalendar({ classes }: ScheduleCalendarProps) {
  // TODO: implement the component to display all the classes
  console.log(classes)
  console.log("HELLO")
  return (
    <>
      <Schedule classes={classes} />
    </>
  );
}
