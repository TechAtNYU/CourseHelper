"use client";

import type { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { ScheduleCalendar } from "./schedule-calendar";

interface ScheduleContentProps {
  preloadedClasses: Preloaded<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

export function ScheduleContent({ preloadedClasses }: ScheduleContentProps) {
  const classes = usePreloadedQuery(preloadedClasses);
  console.log(preloadedClasses)
  return <ScheduleCalendar classes={classes} />;
}
