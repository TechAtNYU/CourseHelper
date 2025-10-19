"use client";

import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProgramSelectorProps {
  onSelectProgram: (programName: string) => void;
  selectedProgram: string;
}

export function ProgramSelector({
  onSelectProgram,
  selectedProgram,
}: ProgramSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const programs = useQuery(api.programs.getPrograms, {
    query: searchQuery || undefined,
    paginationOpts: { numItems: 10, cursor: null },
  });

  const handleProgramClick = (programName: string) => {
    onSelectProgram(programName);
    setSearchQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Program</CardTitle>
        <CardDescription>
          Search for a program to view its requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search programs (e.g., Computer Science)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          {selectedProgram && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-900">
                Currently viewing: {selectedProgram}
              </p>
            </div>
          )}

          {searchQuery && programs && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {programs.page.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No programs found
                </p>
              ) : (
                programs.page.map((program) => (
                  <button
                    key={program._id}
                    type="submit"
                    onClick={() => handleProgramClick(program.name)}
                    className="w-full text-left p-3 rounded border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <p className="font-medium">{program.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {program.level}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
