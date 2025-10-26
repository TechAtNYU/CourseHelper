"use client";

import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartOverlayToggle } from "./label";

const chartConfig = {
  credits: {
    label: "Credits",
  },
  "CSCI-UA": {
    label: "Computer Science",
    color: "hsl(var(--chart-1))",
  },
  "MATH-UA": {
    label: "Mathematics",
    color: "hsl(var(--chart-2))",
  },
  "PHYS-UA": {
    label: "Physics",
    color: "hsl(var(--chart-3))",
  },
  "CHEM-UA": {
    label: "Chemistry",
    color: "hsl(var(--chart-4))",
  },
  "EXPOS-UA": {
    label: "Writing",
    color: "hsl(var(--chart-5))",
  },
  Other: {
    label: "Other Requirements",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

interface ProgramRequirementsChartProps {
  programName: string;
}

export function ProgramRequirementsChart({
  programName,
}: ProgramRequirementsChartProps) {
  const program = useQuery(api.programs.getProgramWithGroupedRequirements, {
    name: programName,
  });

  const userCourses = useQuery(api.userCourses.getUserCourses, {});
  const [showProgress, setShowProgress] = useState(false);

  if (program === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Program Requirements</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (program === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Program Requirements</CardTitle>
          <CardDescription>Program not found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const completedCreditsByCategory: Record<string, number> = {};
  if (userCourses) {
    for (const userCourse of userCourses) {
      for (const [prefix, data] of Object.entries(
        program.requirementsByCategory,
      )) {
        // Check if the course code is in any of the nested course arrays
        const isInRequirement = data.courses.some((courseGroup) =>
          courseGroup.includes(userCourse.courseCode)
        );

        if (isInRequirement) {
          completedCreditsByCategory[prefix] =
            (completedCreditsByCategory[prefix] || 0) +
            (userCourse.course?.credits || 0);
          break;
        }
      }
    }
  }

  // Transform the data for the chart
  const chartData = Object.entries(program.requirementsByCategory).map(
    ([prefix, data]) => {
      const completed = completedCreditsByCategory[prefix] || 0;
      const percentage =
        data.credits > 0 ? Math.round((completed / data.credits) * 100) : 0;
      return {
        category: prefix,
        credits: data.credits,
        completedCredits: completed,
        remainingCredits: data.credits - completed,
        percentage,
      };
    },
  );

  const totalCredits = Object.values(program.requirementsByCategory).reduce(
    (sum, data) => sum + data.credits,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Program Requirements by Subject</CardTitle>
            <CardDescription>
              {program.name} - Total: {totalCredits} credits
            </CardDescription>
          </div>
          <ChartOverlayToggle
            showProgress={showProgress}
            onToggle={setShowProgress}
          />
        </div>
      </CardHeader>
      <CardContent>
        {!showProgress && (
          <div className="w-full">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 16,
                }}
              >
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={140}
                />
                <XAxis dataKey="credits" type="number" hide domain={[0, 75]} />
                <Bar
                  dataKey="credits"
                  radius={4}
                  barSize={100}
                  fill="hsl(var(--muted))"
                >
                  <LabelList
                    dataKey="credits"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        )}

        {showProgress && (
          <div className="w-full">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 16,
                }}
              >
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={140}
                />
                <XAxis dataKey="credits" type="number" hide domain={[0, 75]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Category
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {data.category}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Completed
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {data.completedCredits} / {data.credits} credits
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {data.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="completedCredits"
                  stackId="stack"
                  barSize={100}
                  fill="#3b82f6"
                  radius={[4, 0, 0, 4]}
                />

                <Bar
                  dataKey="remainingCredits"
                  stackId="stack"
                  barSize={100}
                  fill="hsl(var(--muted))"
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList
                    dataKey="credits"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
