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
import { ChartOverlayToggle } from "./label";

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
  const chartData = Object.entries(program.requirementsByCategory)
    .map(([prefix, data]) => {
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
    })
    .sort((a, b) => {
      // "Other" should always be at the bottom
      if (a.category === "Other") return 1;
      if (b.category === "Other") return -1;
      // Otherwise, maintain alphabetical order
      return a.category.localeCompare(b.category);
    });

  const totalCredits = Object.values(program.requirementsByCategory).reduce(
    (sum, data) => sum + data.credits,
    0,
  );

  const totalCompletedCredits = Object.values(completedCreditsByCategory).reduce(
    (sum, credits) => sum + credits,
    0,
  );

  const overallPercentage =
    totalCredits > 0 ? Math.round((totalCompletedCredits / totalCredits) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Program Requirements by Subject</CardTitle>
            <CardDescription>
              {program.name} - Total: {totalCredits} credits
              {showProgress && (
                <span className="ml-2 font-semibold text-foreground">
                  • {overallPercentage}% Complete ({totalCompletedCredits}/{totalCredits} credits)
                </span>
              )}
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
          <div className="w-full h-[400px]">
            <BarChart
              data={chartData}
              layout="vertical"
              width={800}
              height={400}
              margin={{
                left: 0,
                right: 40,
                bottom: 20,
              }}
            >
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={140}
                tick={{ fontSize: 12 }}
              />
              <XAxis dataKey="credits" type="number" hide />
              <Bar
                dataKey="credits"
                radius={[0, 4, 4, 0]}
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
          </div>
        )}

        {showProgress && (
          <div className="w-full h-[400px]">
            <BarChart
              data={chartData}
              layout="vertical"
              width={800}
              height={400}
              margin={{
                left: 0,
                right: 40,
                bottom: 20,
              }}
            >
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <XAxis dataKey="credits" type="number" hide />
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
                  fill="#3b82f6"
                />

                <Bar
                  dataKey="remainingCredits"
                  stackId="stack"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
