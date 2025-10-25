import { isSameDay } from "date-fns";
import type { CalendarEvent, EventColor } from ".";

/**
 * Get CSS classes for event colors
 */
export function getEventColorClasses(color?: EventColor | string): string {
  const eventColor = color || "sky";

  switch (eventColor) {
    case "sky":
      return "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8";
    case "amber":
      return "bg-amber-200/50 hover:bg-amber-200/40 text-amber-950/80 dark:bg-amber-400/25 dark:hover:bg-amber-400/20 dark:text-amber-200 shadow-amber-700/8";
    case "violet":
      return "bg-violet-200/50 hover:bg-violet-200/40 text-violet-950/80 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8";
    case "rose":
      return "bg-rose-200/50 hover:bg-rose-200/40 text-rose-950/80 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/8";
    case "emerald":
      return "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8";
    case "orange":
      return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-950/80 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8";
    case "teal":
      return "bg-teal-200/50 hover:bg-teal-200/40 text-teal-950/80 dark:bg-teal-400/25 dark:hover:bg-teal-400/20 dark:text-teal-200 shadow-teal-700/8";
    case "lime":
      return "bg-lime-200/50 hover:bg-lime-200/40 text-lime-950/80 dark:bg-lime-400/25 dark:hover:bg-lime-400/20 dark:text-lime-200 shadow-lime-700/8";
    case "cyan":
      return "bg-cyan-200/50 hover:bg-cyan-200/40 text-cyan-950/80 dark:bg-cyan-400/25 dark:hover:bg-cyan-400/20 dark:text-cyan-200 shadow-cyan-700/8";
    case "fuchsia":
      return "bg-fuchsia-200/50 hover:bg-fuchsia-200/40 text-fuchsia-950/80 dark:bg-fuchsia-400/25 dark:hover:bg-fuchsia-400/20 dark:text-fuchsia-200 shadow-fuchsia-700/8";
    case "indigo":
      return "bg-indigo-200/50 hover:bg-indigo-200/40 text-indigo-950/80 dark:bg-indigo-400/25 dark:hover:bg-indigo-400/20 dark:text-indigo-200 shadow-indigo-700/8";
    case "pink":
      return "bg-pink-200/50 hover:bg-pink-200/40 text-pink-950/80 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200 shadow-pink-700/8";
    default:
      return "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8";
  }
}

/**
 * Get CSS classes for border radius based on event position in multi-day events
 */
export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean,
): string {
  if (isFirstDay && isLastDay) {
    return "rounded"; // Both ends rounded
  } else if (isFirstDay) {
    return "rounded-l rounded-r-none"; // Only left end rounded
  } else if (isLastDay) {
    return "rounded-r rounded-l-none"; // Only right end rounded
  } else {
    return "rounded-none"; // No rounded corners
  }
}

/**
 * Add hours to a date
 */
export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}
