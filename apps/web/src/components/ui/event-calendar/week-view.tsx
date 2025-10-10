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
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import type React from "react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { type CalendarEvent, DraggableEvent, DroppableCell, EndHour, EventItem, isMultiDayEvent, StartHour, useCurrentTimeIndicator, WeekCellsHeight } from ".";
import { TimeSlot } from "./types";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
  timeSlotIndex: number;
}

export function WeekView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: WeekViewProps) {

  // const [previewEvents, setPreviewEvents] = useState<CalendarEvent[]>([]);

  // const mergedEvents = useMemo(
  //   () => [...events, ...previewEvents],
  //   [events, previewEvents]
  // );

  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 0 }),
    [currentDate],
  );

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  // Get all-day events and multi-day events for the week
  const allDayEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Include explicitly marked all-day events or multi-day events
        return event.allDay || isMultiDayEvent(event);
      })
      .filter((event) => {
        // Each event can have multiple time slots — include if ANY overlap with the current days
        return event.timeSlots?.some((slot) => {
          const eventStart = new Date(slot.start);
          const eventEnd = new Date(slot.end);

          return days.some(
            (day) =>
              isSameDay(day, eventStart) ||
              isSameDay(day, eventEnd) ||
              (day > eventStart && day < eventEnd)
          );
        });
      });
  }, [events, days]);

  const processedDayEvents = useMemo(() => {
    return days.map((day) => {
      const dayEvents: { event: CalendarEvent; slot: TimeSlot }[] = [];
      
      events.forEach((event) => {
        if (!event.timeSlots?.length) return;
        event.timeSlots.forEach((slot) => {
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
      const columns: { event: CalendarEvent; end: Date }[][] = [];

      // sortedEvents.forEach(({ event, slot }) => {
      //   const eventStart = new Date(slot.start);
      //   const eventEnd = new Date(slot.end);

      //   const adjustedStart = isSameDay(day, eventStart)
      //     ? eventStart
      //     : dayStart;
      //   const adjustedEnd = isSameDay(day, eventEnd)
      //     ? eventEnd
      //     : addHours(dayStart, 24);

      //   const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
      //   const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;

      //   const top = (startHour - StartHour) * WeekCellsHeight;
      //   const height = (endHour - startHour) * WeekCellsHeight;

      //   // Find column
      //   let columnIndex = 0;
      //   let placed = false;

      //   while (!placed) {
      //     const col = columns[columnIndex] || [];
      //     if (col.length === 0) {
      //       columns[columnIndex] = col;
      //       placed = true;
      //     } else {
      //       const overlaps = col.some((c) =>
      //         areIntervalsOverlapping(
      //           { start: adjustedStart, end: adjustedEnd },
      //           {
      //             start: new Date(c.event.timeSlots[0].start),
      //             end: new Date(c.event.timeSlots[0].end),
      //           }
      //         )
      //       );
      //       if (!overlaps) {
      //         placed = true;
      //       } else {
      //         columnIndex++;
      //       }
      //     }
      //   }

      //   const currentColumn = columns[columnIndex] || [];
      //   columns[columnIndex] = currentColumn;
      //   currentColumn.push({ event, end: adjustedEnd });

      //   const width = columnIndex === 0 ? 1 : 0.9;
      //   const left = columnIndex === 0 ? 0 : columnIndex * 0.1;

      //   positionedEvents.push({
      //     event,
      //     top,
      //     height,
      //     left,
      //     width,
      //     zIndex: 10 + columnIndex,
      //     timeSlotIndex: slotIndex,
      //     // timeSlotIndex: 1,
      //     // timeSlotIndex: event.timeSlots.indexOf(slot),
      //   });
      // });
      sortedEvents.forEach(({ event, slot }) => {
        const eventStart = new Date(slot.start);
        const eventEnd = new Date(slot.end);

        const adjustedStart = isSameDay(day, eventStart) ? eventStart : dayStart;
        const adjustedEnd = isSameDay(day, eventEnd) ? eventEnd : addHours(dayStart, 24);

        const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
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
                  start: new Date(c.event.timeSlots[0].start),
                  end: new Date(c.event.timeSlots[0].end),
                }
              )
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

        // ✅ Define slotIndex here
        const slotIndex = event.timeSlots.indexOf(slot);
        console.log("SLOT: " + slotIndex)

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
      //  console.log("EVENTs 0: " + positionedEvents[0].timeSlotIndex)

      return positionedEvents;
    });
  }, [days, events]);


  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const showAllDaySection = allDayEvents.length > 0;
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "week",
  );

  return (
    <div data-slot="week-view" className="flex h-full flex-col">
      <div className="bg-background/80 border-border/70 sticky top-0 z-30 grid grid-cols-8 border-b backdrop-blur-md">
        <div className="text-muted-foreground/70 py-2 text-center text-sm">
          {/* <span className="max-[479px]:sr-only">{format(new Date(), "O")}</span> */}
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
            {/* <span className="max-sm:hidden">{format(day, "EEE dd")}</span> */}
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
            {/* Positioned events */}
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="size-full">
                  <DraggableEvent
                    event={positionedEvent.event}
                    timeSlotIndex={positionedEvent.timeSlotIndex}
                    view="week"
                    onClick={(e) => handleEventClick(positionedEvent.event, e)}
                    showTime
                    height={positionedEvent.height}
                    draggable={false}
                  />
                </div>
              </div>
            ))}

            {/* Current time indicator - only show for today's column */}
            {/* {currentTimeVisible && isToday(day) && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="relative flex items-center">
                  <div className="bg-primary absolute -left-1 h-2 w-2 rounded-full"></div>
                  <div className="bg-primary h-[2px] w-full"></div>
                </div>
              </div>
            )} */}
            {/* {hours.map((hour) => {
              const hourValue = getHours(hour);
              return (
                <div
                  key={hour.toString()}
                  className="border-border/70 relative min-h-[var(--week-cells-height)] border-b last:border-b-0"
                >
                  {/* Quarter-hour intervals */}
                  {/* {[0, 1, 2, 3].map((quarter) => {
                    const quarterHourTime = hourValue + quarter * 0.25;
                    return (
                      <DroppableCell
                        key={`${hour.toString()}-${quarter}`}
                        id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
                        date={day}
                        time={quarterHourTime}
                        className={cn(
                          "absolute h-[calc(var(--week-cells-height)/4)] w-full",
                          quarter === 0 && "top-0",
                          quarter === 1 &&
                            "top-[calc(var(--week-cells-height)/4)]",
                          quarter === 2 &&
                            "top-[calc(var(--week-cells-height)/4*2)]",
                          quarter === 3 &&
                            "top-[calc(var(--week-cells-height)/4*3)]",
                        )}
                        onClick={() => {
                          const startTime = new Date(day);
                          startTime.setHours(hourValue);
                          startTime.setMinutes(quarter * 15);
                          onEventCreate(startTime);
                        }}
                      />
                    );
                  })}
                </div>
              );
            })} */} 
          </div>
        ))}
      </div>
    </div>
  );
}
