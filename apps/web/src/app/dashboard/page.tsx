import { AppHeader } from "./components/app-header";
import FileUploadButton from "@/components/FileUploadButton";

const DashboardPage = () => {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main>
        <div>
          <FileUploadButton />
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
