import FileUploadButton from "@/modules/report-parsing/components/file-upload-button";
import { ChartBarMixed } from "./components/charts/degree-charts";

const HomePage = () => {
  return (
    <div className="space-y-6 p-6">
      <FileUploadButton />
      <ChartBarMixed />
    </div>
  );
};

export default HomePage;
