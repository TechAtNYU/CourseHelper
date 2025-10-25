import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/convex";
import { AuthenticatedContent } from "../components/authenticated-content";
import { ScheduleContent } from "./components/schedule-content";

const SchedulePage = async () => {
  const token = await getAuthToken();
  const preloadedClasses = await preloadQuery(
    api.userCourseOfferings.getUserCourseOfferings,
    {},
    { token },
  );

  return (
    <AuthenticatedContent>
      <ScheduleContent preloadedClasses={preloadedClasses} />
    </AuthenticatedContent>
  );
};

export default SchedulePage;
