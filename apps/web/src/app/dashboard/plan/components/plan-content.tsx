"use client";
import type { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import PlanTable from "./plan-table";

type PlanContentProp = {
  preloadedCourses: Preloaded<typeof api.userCourses.getUserCourses>;
};

const PlanContent = ({ preloadedCourses }: PlanContentProp) => {
  const courses = usePreloadedQuery(preloadedCourses);

  return <PlanTable courses={courses} />;
};

export default PlanContent;
