import Schedule from "@/components/comp-542";
import { AppHeader } from "../components/app-header";

const SchedulePage = () => {
  return (
    <>
      <AppHeader title="Schedule" />
      <main className="p-6 space-y-6">
        <Schedule />
      </main>
    </>
  );
};

export default SchedulePage;
