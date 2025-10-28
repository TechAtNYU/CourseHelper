"use client";

import type { api } from "@albert-plus/server/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { ScheduleCalendar } from "./schedule-calendar";

interface ScheduleContentProps {
  preloadedClasses: Preloaded<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

function getUserClassesByTerm(
  classes: FunctionReturnType<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >,
  year: number,
  term: string,
) {
  return classes.filter((cls) => {
    return cls.courseOffering.year === year && cls.courseOffering.term === term;
  });
}

export function ScheduleContent({ preloadedClasses }: ScheduleContentProps) {
  // TODO: hardcoded for now, need to use app configs
  const classes = getUserClassesByTerm(
    usePreloadedQuery(preloadedClasses),
    2025,
    "fall",
  );

  return <ScheduleCalendar classes={classes} />;
}
