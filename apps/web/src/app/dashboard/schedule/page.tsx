import { getAuthToken } from "@/lib/convex";
import { api } from "@albert-plus/server/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { Schedule } from "./components/schedule";

const SchedulePage = async () => {
  const token = await getAuthToken();
  const preloadedClasses = await preloadQuery(
    api.userCourseOfferings.getUserCourseOfferings,
    {},
    { token },
  );

  return <Schedule preloadedClasses={preloadedClasses} />;
};

export default SchedulePage;
