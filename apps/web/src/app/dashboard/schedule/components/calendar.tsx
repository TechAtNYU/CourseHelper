"use client";

import { cn } from "@/lib/utils";
import { WeekView } from "./week-view";

export const EventHeight = 24;

// Vertical gap between events in pixels - controls spacing in month view
export const EventGap = 4;

// Height of hour cells in week and day views - controls the scale of time display
export const WeekCellsHeight = 64;

// Number of days to show in the agenda view
export const AgendaDaysToShow = 30;

// Start and end hours for the week and day views
export const StartHour = 7;
export const EndHour = 22;

// Default start and end times
export const DefaultStartHour = 9; // 9 AM
export const DefaultEndHour = 10; // 10 AM

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface Class {
  id: string; // unique identifier
  title: string;
  color: string;
  times: TimeSlot[];
  description: string;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange"
  | "teal"
  | "lime"
  | "cyan"
  | "fuchsia"
  | "indigo"
  | "pink";

export const allClassColors: EventColor[] = [
  "sky",
  "amber",
  "violet",
  "rose",
  "emerald",
  "orange",
  "teal",
  "lime",
  "indigo",
  "fuchsia",
  "pink",
  "cyan",
];

export interface EventCalendarProps {
  className?: string;
  classes: Class[];
}

export function Calendar({ className, classes }: EventCalendarProps) {
  return (
    <div
      className="flex flex-col rounded-lg border has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex items-center justify-between p-2 sm:p-4",
          className,
        )}
      >
        <div className="flex items-center gap-1 sm:gap-4">
          {/* TODO: fix this so it is not hard coded */}
          <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
            Spring 2026
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <WeekView classes={classes} />
      </div>
    </div>
  );
}
