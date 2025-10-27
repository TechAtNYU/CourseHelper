"use client";

import { cn } from "@/lib/utils";
import { WeekView } from "./week-view";

export const EventHeight = 24;
export const EventGap = 4;
export const WeekCellsHeight = 64;
export const AgendaDaysToShow = 30;
export const StartHour = 7;
export const EndHour = 22;
export const DefaultStartHour = 9; // 9 AM
export const DefaultEndHour = 10; // 10 AM

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface Class {
  id: string;
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
      {/* Header */}
      <div className={cn("p-2 sm:p-4", className)}>
        <h2 className="w-full text-center text-sm font-semibold sm:text-lg md:text-xl">
          Spring 2026
        </h2>
      </div>

      {/* Week view */}
      <div className="flex flex-1 flex-col">
        <WeekView classes={classes} />
      </div>
    </div>
  );
}
