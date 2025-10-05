import { AppHeader } from "./components/app-header";
import FileUploadButton from "@/components/FileUploadButton";

const DashboardPage = () => {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main>
        <FileUploadButton />
      </main>
    </>
  );
};

export default DashboardPage;
