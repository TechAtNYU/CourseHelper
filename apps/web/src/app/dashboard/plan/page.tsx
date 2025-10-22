import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/convex";
import PlanContent from "./components/plan-content";

const PlanPage = async () => {
  const token = await getAuthToken();
  const preloadedCourses = await preloadQuery(
    api.userCourses.getUserCourses,
    {},
    { token },
  );

  return <PlanContent preloadedCourses={preloadedCourses} />;
};

export default PlanPage;
