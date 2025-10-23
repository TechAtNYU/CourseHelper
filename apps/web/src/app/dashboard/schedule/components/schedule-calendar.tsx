"use client";

import type { api } from "@dev-team-fall-25/server/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import Schedule from "@/components/comp-542";
import { EventColor } from "@/components/ui/event-calendar/types";

export interface ScheduleCalendarProps {
  classes: FunctionReturnType<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

const allColors: EventColor[] = ["sky", "amber", "violet", "rose", "emerald", "orange", "teal", "lime", "indigo", "fuchsia", "pink", "cyan"];

  const pickColor = (): EventColor => {
    const randomIndex = Math.floor(Math.random() * allColors.length);
    return allColors[randomIndex];
  };

interface Class {
  id: string; // unique identifier
  title: string;
  color: string;
  times: string[]; // e.g. ["Monday 9 15 11 15"]
  selected: boolean;
  description: string;
}


export function ScheduleCalendar({ classes }: ScheduleCalendarProps) {
  // TODO: implement the component to display all the classes
  const transformedClasses: Class[] = classes
    .filter((c) => c.courseOffering !== null)
    .map((c) => {
      const offering = c.courseOffering!;
      const startTime=offering.startTime.split(":")[0]+" "+offering.startTime.split(":")[1]
      const endTime=offering.endTime.split(":")[0]+" "+offering.endTime.split(":")[1]
      
      console.log(offering.startTime)
      console.log(startTime)
      // Format times like "Monday 9 15 11 15"
      const times = offering.days.map((day) => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        return `${dayName} ${startTime} ${endTime}`;
      });

      return {
        id: offering._id,
        title: `${offering.courseCode} - ${offering.title}`,
        color: pickColor(),
        times,
        selected: false,
        description: `${offering.instructor.join(", ")} • ${offering.section.toUpperCase()} • ${offering.term} ${offering.year}`,
      };
    });
  console.log(transformedClasses)
  return (
    <>
      <Schedule classes={transformedClasses} />
    </>
  );
}
