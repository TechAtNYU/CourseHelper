"use client";

import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { useQuery } from "convex/react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
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

interface ChartBarMixedProps {
  programName: string;
}

export function ChartBarMixed({ programName }: ChartBarMixedProps) {
  const program = useQuery(api.programs.getProgramWithGroupedRequirements, {
    name: programName,
  });

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
    })
  );

  const totalCredits = Object.values(program.requirementsByCategory).reduce(
    (sum, data) => sum + data.credits,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Requirements by Category</CardTitle>
        <CardDescription>
          {program.name} - Total: {totalCredits} credits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="credits" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="credits" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
