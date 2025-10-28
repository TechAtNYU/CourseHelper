"use client";

import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import {
  type Class,
  EndHour,
  StartHour,
  type TimeSlot,
  WeekCellsHeight,
} from "../schedule-calendar";
import { EventItem } from "./event-item";

interface WeekViewProps {
  classes: Class[];
}

interface PositionedEvent {
  event: Class;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
  timeSlotIndex: number;
}

export function WeekView({ classes }: WeekViewProps) {
  const currentDate = new Date();

  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const processedDayEvents = useMemo(() => {
    return days.map((day) => {
      const dayEvents: { event: Class; slot: TimeSlot }[] = [];

      classes.forEach((event) => {
        if (!event.times?.length) return;
        event.times.forEach((slot) => {
          const start = new Date(slot.start);
          const end = new Date(slot.end);
          if (
            isSameDay(day, start) ||
            isSameDay(day, end) ||
            (start < day && end > day)
          ) {
            dayEvents.push({ event, slot });
          }
        });
      });

      // Sort by start time, then by duration
      const sortedEvents = dayEvents.sort((a, b) => {
        const aStart = new Date(a.slot.start);
        const bStart = new Date(b.slot.start);
        if (aStart < bStart) return -1;
        if (aStart > bStart) return 1;

        const aDuration = differenceInMinutes(new Date(a.slot.end), aStart);
        const bDuration = differenceInMinutes(new Date(b.slot.end), bStart);
        return bDuration - aDuration;
      });

      const positionedEvents: PositionedEvent[] = [];
      const dayStart = startOfDay(day);
      const columns: { event: Class; end: Date }[][] = [];

      sortedEvents.forEach(({ event, slot }) => {
        const eventStart = new Date(slot.start);
        const eventEnd = new Date(slot.end);

        const adjustedStart = isSameDay(day, eventStart)
          ? eventStart
          : dayStart;
        const adjustedEnd = isSameDay(day, eventEnd)
          ? eventEnd
          : addHours(dayStart, 24);

        const startHour =
          getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
        const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;

        const top = (startHour - StartHour) * WeekCellsHeight;
        const height = (endHour - startHour) * WeekCellsHeight;

        // Find column logic...
        let columnIndex = 0;
        let placed = false;
        while (!placed) {
          const col = columns[columnIndex] || [];
          if (col.length === 0) {
            columns[columnIndex] = col;
            placed = true;
          } else {
            const overlaps = col.some((c) =>
              areIntervalsOverlapping(
                { start: adjustedStart, end: adjustedEnd },
                {
                  start: new Date(c.event.times[0].start),
                  end: new Date(c.event.times[0].end),
                },
              ),
            );
            if (!overlaps) {
              placed = true;
            } else {
              columnIndex++;
            }
          }
        }

        const currentColumn = columns[columnIndex] || [];
        columns[columnIndex] = currentColumn;
        currentColumn.push({ event, end: adjustedEnd });

        const slotIndex = event.times.indexOf(slot);

        positionedEvents.push({
          event,
          top,
          height,
          left: columnIndex === 0 ? 0 : columnIndex * 0.1,
          width: columnIndex === 0 ? 1 : 0.9,
          zIndex: 10 + columnIndex,
          timeSlotIndex: slotIndex, // use correct slot
        });
      });

      return positionedEvents;
    });
  }, [days, classes]);

  return (
    <div data-slot="week-view" className="flex h-full flex-col">
      <div className="bg-background/80 border-border/70 sticky top-0 z-30 grid grid-cols-8 border-b backdrop-blur-md">
        <div className="text-muted-foreground/70 py-2 text-center text-sm">
          <span className="max-[479px]:sr-only">{format(new Date(), "O")}</span>
        </div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="data-today:text-foreground text-muted-foreground/70 py-2 text-center text-sm data-today:font-medium"
            data-today={isToday(day) || undefined}
          >
            <span className="sm:hidden" aria-hidden="true">
              {format(day, "E")[0]} {format(day, "d")}
            </span>
            <span className="max-sm:hidden">{format(day, "EEEE")}</span>
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-8 overflow-hidden">
        <div className="border-border/70 grid auto-cols-fr border-r">
          {hours.map((hour, index) => (
            <div
              key={hour.toString()}
              className="border-border/70 relative min-h-[var(--week-cells-height)] border-b last:border-b-0"
            >
              {index > 0 && (
                <span className="bg-background text-muted-foreground/70 absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end pe-2 text-[10px] sm:pe-4 sm:text-xs">
                  {format(hour, "h a")}
                </span>
              )}
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => (
          <div
            key={day.toString()}
            className="border-border/70 relative grid auto-cols-fr border-r last:border-r-0"
            data-today={isToday(day) || undefined}
          >
            {hours.map((hour, index) => (
              <div
                key={hour.toString()}
                className="border-border/70 relative border-b last:border-b-0"
              />
            ))}
            {(processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
              <div
                key={positionedEvent.event.id}
                className="absolute z-10 px-0.5"
                style={{
                  top: `${positionedEvent.top}px`,
                  height: `${positionedEvent.height}px`,
                  left: `${positionedEvent.left * 100}%`,
                  width: `${positionedEvent.width * 100}%`,
                  zIndex: positionedEvent.zIndex,
                }}
              >
                <div className="size-full">
                  <EventItem
                    event={positionedEvent.event}
                    timeSlotIndex={positionedEvent.timeSlotIndex}
                    showTime
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
