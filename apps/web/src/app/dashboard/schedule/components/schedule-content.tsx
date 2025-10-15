"use client";

import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ScheduleCalendar } from "./schedule-calendar";

interface ScheduleContentProps {
  preloadedClasses: Preloaded<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

export function ScheduleContent({ preloadedClasses }: ScheduleContentProps) {
  const classes = usePreloadedQuery(preloadedClasses);

  return <ScheduleCalendar classes={classes} />;
}
