"use client";

import { useState } from "react";
import DegreeProgreeUpload from "@/modules/report-parsing/components/degree-progress-upload";
import { ProgramRequirementsChart } from "./components/charts/degree-charts";
import { ProgramSelector } from "./components/charts/program-selector";

const HomePage = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DegreeProgreeUpload />

      <ProgramSelector
        selectedProgram={selectedProgram}
        onSelectProgram={setSelectedProgram}
      />

      {selectedProgram && (
        <ProgramRequirementsChart programName={selectedProgram} />
      )}

      {!selectedProgram && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
          <p className="text-muted-foreground">
            Select a program above to view its requirements
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
