import FileUploadButton from "@/modules/report-parsing/components/file-upload-button";
import { AppHeader } from "./components/app-header";

const HomePage = () => {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="p-6 space-y-6">
        <FileUploadButton />
      </main>
    </>
  );
};

export default HomePage;
