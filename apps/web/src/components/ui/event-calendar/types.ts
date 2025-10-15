export type CalendarView = "month" | "week" | "day" | "agenda";

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor;
  location?: string;
  timeSlots: TimeSlot[];
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
