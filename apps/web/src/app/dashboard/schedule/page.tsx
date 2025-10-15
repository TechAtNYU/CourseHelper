import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/convex";
import { AppHeader } from "../components/app-header";
import { ScheduleContent } from "./components/schedule-content";

const SchedulePage = async () => {
  const token = await getAuthToken();
  const preloadedClasses = await preloadQuery(
    api.userCourseOfferings.getUserCourseOfferings,
    {},
    { token },
  );

  return (
    <>
      <AppHeader title="Schedule" />
      <main className="p-6 space-y-6">
        <ScheduleContent preloadedClasses={preloadedClasses} />
      </main>
    </>
  );
};

export default SchedulePage;
