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

  // Transform the data for the chart
  const chartData = Object.entries(program.requirementsByCategory).map(
    ([category, data]) => ({
      category,
      credits: data.credits,
      fill: `var(--color-${category.replace(/\s+/g, "-").toLowerCase()})`,
    }),
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
              layout="vertical"
              radius={4}
              barSize={100}
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
      </CardContent>
    </Card>
  );
}
