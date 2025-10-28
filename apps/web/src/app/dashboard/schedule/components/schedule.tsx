"use client";

import {
  type Term,
  useCurrentTerm,
  useCurrentYear,
} from "@/components/AppConfigProvider";
import { formatTermTitle } from "@/utils/format-term";
import type { api } from "@albert-plus/server/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { ScheduleCalendar } from "./schedule-calendar";

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

interface ScheduleProps {
  preloadedClasses: Preloaded<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

export function Schedule({ preloadedClasses }: ScheduleProps) {
  const currentYear = useCurrentYear();
  const currentTerm = useCurrentTerm();

  const classes = getUserClassesByTerm(
    usePreloadedQuery(preloadedClasses),
    currentYear,
    currentTerm,
  );

  const title = formatTermTitle(currentTerm, currentYear) || "";

  return <ScheduleCalendar classes={classes} title={title} />;
}
