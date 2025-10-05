import FileUploadButton from "@/components/FileUploadButton";
import { AppHeader } from "./components/app-header";

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
