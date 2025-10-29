"use client";

import { api } from "@albert-plus/server/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { CourseSelector } from "@/app/dashboard/schedule/components/course-selection";
import CourseSelectorSkeleton from "@/app/dashboard/schedule/components/course-selection/components/CourseSelectorSkeleton";
import type { CourseOffering } from "@/app/dashboard/schedule/components/course-selection/types";
import {
  type Term,
  useCurrentTerm,
  useCurrentYear,
} from "@/components/AppConfigProvider";
import { formatTermTitle } from "@/utils/format-term";
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
  const [hoveredCourse, setHoveredCourse] = useState<CourseOffering | null>(
    null,
  );

  const allClasses = useQuery(
    api.userCourseOfferings.getUserCourseOfferings,
    isAuthenticated ? {} : "skip",
  );

  const courseData = useQuery(
    api.courseOfferings.getCourseOfferingsWithCourses,
    isAuthenticated && currentTerm && currentYear
      ? { term: currentTerm, year: currentYear }
      : "skip",
  );

  const title = formatTermTitle(currentTerm, currentYear);

  const classes = getUserClassesByTerm(allClasses, currentYear, currentTerm);

  if (!courseData) return <CourseSelectorSkeleton />;

  return (
    <div className="flex gap-4 h-full w-full">
      <div className="w-[350px] h-full overflow-y-auto">
        <CourseSelector
          courses={courseData.courses}
          courseOfferings={courseData.courseOfferings}
          onHover={setHoveredCourse}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="sticky top-[var(--header-height)]">
          <ScheduleCalendar
            classes={classes}
            title={title}
            hoveredCourse={hoveredCourse}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
