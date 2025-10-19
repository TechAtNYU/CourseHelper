"use client";

import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { ChartOverlayToggle } from "./label";
import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";

const chartConfig = {
  credits: {
    label: "Credits",
  },
  "Computer Science": {
    label: "Computer Science",
    color: "hsl(var(--chart-1))",
  },
  Mathematics: {
    label: "Mathematics",
    color: "hsl(var(--chart-2))",
  },
  "Natural Science": {
    label: "Natural Science",
    color: "hsl(var(--chart-3))",
  },
  "General Education": {
    label: "General Education",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface ProgramRequirementsChartProps {
  programName: string;
  userID: string;
}

export function ProgramRequirementsChart({ programName, userID }: ProgramRequirementsChartProps) {
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
      for (const [category, data] of Object.entries(program.requirementsByCategory)) {
        if (data.courses.includes(userCourse.courseCode)) {
          completedCreditsByCategory[category] =
            (completedCreditsByCategory[category] || 0) + (userCourse.course?.credits || 0);
          break;
        }
      }
    }
  }

  // Transform the data for the chart
  const chartData = Object.entries(program.requirementsByCategory).map(
    ([category, data]) => {
      const completed = completedCreditsByCategory[category] || 0;
      return {
        category,
        credits: data.credits,
        completedCredits: completed,
        remainingCredits: data.credits - completed,
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
            <CardTitle>Program Requirements by Category</CardTitle>
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
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 20,
                right: 16,
              }}
            >
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={150}
                hide
              />
              <XAxis dataKey="credits" type="number" hide domain={[0, 75]} />
              <Bar
                dataKey="credits"
                radius={4}
                barSize={100}
                fill="hsl(var(--muted))"
              >
                <LabelList
                  dataKey="category"
                  position="insideLeft"
                  offset={8}
                  className="fill-white"
                  fontSize={12}
                />
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
        )}

        {showProgress && (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 20,
                right: 16,
              }}
            >
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={150}
                hide
              />
              <XAxis dataKey="credits" type="number" hide domain={[0, 75]} />
              <Bar
                dataKey="completedCredits"
                stackId="stack"
                barSize={100}
                fill="#3b82f6"
                radius={[4, 0, 0, 4]}
              >
                <LabelList
                  dataKey="category"
                  position="insideLeft"
                  offset={8}
                  className="fill-white"
                  fontSize={12}
                  content={(props) => {
                    const { x, y, width, value, index } = props;
                    // Only show if there are completed credits (width > 0)
                    if (!chartData[index]?.completedCredits || chartData[index].completedCredits === 0) {
                      return null;
                    }
                    return (
                      <text
                        x={Number(x) + 8}
                        y={Number(y) + Number(props.height || 0) / 2}
                        fill="white"
                        fontSize={12}
                        textAnchor="start"
                        dominantBaseline="middle"
                      >
                        {value}
                      </text>
                    );
                  }}
                />
                <LabelList
                  dataKey="completedCredits"
                  position="right"
                  offset={8}
                  className="fill-white"
                  fontSize={12}
                />
              </Bar>

              <Bar
                dataKey="remainingCredits"
                stackId="stack"
                barSize={100}
                fill="hsl(var(--muted))"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="category"
                  position="insideLeft"
                  offset={8}
                  className="fill-white"
                  fontSize={12}
                  content={(props) => {
                    const { x, y, value, index } = props;
                    // Only show if there are NO completed credits
                    if (chartData[index]?.completedCredits && chartData[index].completedCredits > 0) {
                      return null;
                    }
                    return (
                      <text
                        x={Number(x) + 8}
                        y={Number(y) + Number(props.height || 0) / 2}
                        fill="white"
                        fontSize={12}
                        textAnchor="start"
                        dominantBaseline="middle"
                      >
                        {value}
                      </text>
                    );
                  }}
                />
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
        )}
      </CardContent>
    </Card>
  );
}
