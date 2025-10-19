"use client";

import { useState } from "react";
import FileUploadButton from "@/modules/report-parsing/components/file-upload-button";
import { ChartBarMixed } from "./components/charts/degree-charts";
import { ProgramSelector } from "./components/charts/program-selector";

const HomePage = () => {
  const [selectedProgram, setSelectedProgram] = useState("Computer Science (BA)");

  return (
    <div className="space-y-6 p-6">
      <FileUploadButton />
      <ProgramSelector
        selectedProgram={selectedProgram}
        onSelectProgram={setSelectedProgram}
      />
      <ChartBarMixed programName={selectedProgram} />
    </div>
  );
};

export default HomePage;
