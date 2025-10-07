import FileUploadButton from "@/modules/report-parsing/components/file-upload-button";
import { AppHeader } from "./components/app-header";

const DashboardPage = () => {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main>
        <FileUploadButton />
      </main>
      <AppHeader title="Home" />
      <main></main>
    </>
  );
};

export default DashboardPage;
