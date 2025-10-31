"use client";

import { api } from "@albert-plus/server/convex/_generated/api";
import {
  type RequestForQueries,
  useConvexAuth,
  useQueries,
  useQuery,
} from "convex/react";
import { ProgramRequirementsChart } from "@/modules/degree-progress/components/degree-charts";
import DegreeProgreeUpload from "@/modules/report-parsing/components/degree-progress-upload";

const HomePage = () => {
  const { isAuthenticated } = useConvexAuth();
  const student = useQuery(
    api.students.getCurrentStudent,
    !isAuthenticated ? "skip" : {},
  );

  const userCourses = useQuery(
    api.userCourses.getUserCourses,
    !isAuthenticated ? "skip" : {},
  );

  const prgramQueries: RequestForQueries = {};
  if (isAuthenticated && student) {
    for (const programId of student.programs) {
      prgramQueries[programId] = {
        query: api.programs.getProgramById,
        args: { id: programId },
      };
    }
  }

  const programs = useQueries(prgramQueries);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DegreeProgreeUpload />

      <ProgramRequirementsChart programs={programs} userCourses={userCourses} />
    </div>
  );
};

export default HomePage;
