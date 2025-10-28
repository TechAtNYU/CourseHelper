"use client";

import {
  Term,
  useCurrentTerm,
  useCurrentYear,
} from "@/components/AppConfigProvider";
import { formatTermTitle } from "@/utils/format-term";
import { api } from "@albert-plus/server/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { ScheduleCalendar } from "./components/schedule-calendar";

function getUserClassesByTerm(
  classes:
    | FunctionReturnType<typeof api.userCourseOfferings.getUserCourseOfferings>
    | undefined,
  year: number | null,
  term: Term | null,
) {
  if (!year || !term || !classes) {
    return undefined;
  }
  return classes.filter((cls) => {
    return cls.courseOffering.year === year && cls.courseOffering.term === term;
  });
}

const SchedulePage = () => {
  const { isAuthenticated } = useConvexAuth();
  const currentYear = useCurrentYear();
  const currentTerm = useCurrentTerm();

  const allClasses = useQuery(
    api.userCourseOfferings.getUserCourseOfferings,
    isAuthenticated ? {} : "skip",
  );

  const title = formatTermTitle(currentTerm, currentYear);

  const classes = getUserClassesByTerm(allClasses, currentYear, currentTerm);

  return <ScheduleCalendar classes={classes} title={title} />;
};

export default SchedulePage;
