"use client";

import type { api } from "@dev-team-fall-25/server/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { addDays, startOfWeek } from "date-fns";
import { allClassColors, Calendar, type Class } from "./calendar";

export interface ScheduleCalendarProps {
  classes: FunctionReturnType<
    typeof api.userCourseOfferings.getUserCourseOfferings
  >;
}

export function ScheduleCalendar({ classes }: ScheduleCalendarProps) {
  let colorIndex = 0; // start at 0

  const transformedClasses: Class[] = classes.map((c) => {
    const offering = c.courseOffering;
    const startTime = `${offering.startTime.split(":")[0]} ${offering.startTime.split(":")[1]}`;
    const endTime = `${offering.endTime.split(":")[0]} ${offering.endTime.split(":")[1]}`;

    // Format times like "Monday 9 15 11 15"
    const times = offering.days.map((day) => {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      return `${dayName} ${startTime} ${endTime}`;
    });

    const color = allClassColors[colorIndex % allClassColors.length];
    colorIndex++;

    const slots: { start: Date; end: Date }[] = [];

    // Map weekday names to 0-6 offset from start of week (Sunday = 0)
    const weekdayMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    // Get the start of the current week (Sunday)
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday = 0

    for (const slot of times) {
      const parts = slot.split(" ");
      const day = parts[0];
      const startHour = Number(parts[1]);
      const startMinute = Number(parts[2]);
      const endHour = Number(parts[3]);
      const endMinute = Number(parts[4]);

      const dayOffset = weekdayMap[day];
      if (dayOffset === undefined) {
        throw new Error(`Invalid day: ${day}`);
      }

      const date = addDays(startOfCurrentWeek, dayOffset);

      const start = new Date(date);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date(date);
      end.setHours(endHour, endMinute, 0, 0);

      slots.push({ start, end });
    }

    return {
      id: offering._id,
      title: `${offering.courseCode} - ${offering.title}`,
      color,
      times: slots,
      description: `${offering.instructor.join(", ")} • ${offering.section.toUpperCase()} • ${offering.term} ${offering.year}`,
    };
  });

  return <Calendar classes={transformedClasses} />;
}
