"use client";

import type { api } from "@albert-plus/server/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import {
  type Term,
  useCurrentTerm,
  useCurrentYear,
} from "@/components/AppConfigProvider";
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
  year: number | null,
  term: Term | null,
) {
  if (!year || !term) {
    return [];
  }
  return classes.filter((cls) => {
    return cls.courseOffering.year === year && cls.courseOffering.term === term;
  });
}

export function ScheduleContent({ preloadedClasses }: ScheduleContentProps) {
  const currentYear = useCurrentYear();
  const currentTerm = useCurrentTerm();

  const classes = getUserClassesByTerm(
    usePreloadedQuery(preloadedClasses),
    currentYear,
    currentTerm,
  );

  return <ScheduleCalendar classes={classes} />;
}
