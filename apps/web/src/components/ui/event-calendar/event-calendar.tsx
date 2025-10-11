"use client";

import { RiCalendarCheckLine } from "@remixicon/react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AgendaView,
  addHoursToDate,
  CalendarDndProvider,
  DayView,
  EventDialog,
  // MonthView,
  WeekView,
} from ".";
import {
  AgendaDaysToShow,
  EventGap,
  EventHeight,
  WeekCellsHeight,
} from "./constants";
import type { CalendarEvent, CalendarView } from "./types";
import {addClassToCalendar,addBasicAlgorithms} from './event-dialog';

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

interface Class {
  id: string; // unique identifier
  title: string;
  color: string;
  times: string[]; // e.g. ["Monday 9 15 11 15"]
  selected: boolean;
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "week",
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  
  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const [classes, setClassesState] = useState<Class[]>([
    {
      id: "math-mt",
      title: "Math",
      color: "emerald",
      times: ["Monday 9 15 11 15", "Tuesday 8 0 10 0"],
      selected: false,
    },
    {
      id: "french-tth",
      title: "French",
      color: "rose",
      times: ["Tuesday 14 15 16 15", "Thursday 14 15 16 15"],
      selected: false,
    },
    {
      id: "cs-mw",
      title: "CS",
      color: "sky",
      times: ["Monday 14 15 15 45", "Wednesday 8 0 10 0"],
      selected: false,
    },
  ]);

  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Event selected:", event); // Debug log
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    console.log("Creating new event at:", startTime); // Debug log

    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder);
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    // const newEvent: CalendarEvent = {
    //   id: "",
    //   title: "",
    //   start: startTime,
    //   end: addHoursToDate(startTime, 1),
    //   allDay: false,
    // };
    // setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: CalendarEvent) => {
    if(event.id && event.id=="preview"){
      onEventAdd?.({
        ...event,
        id: "preview", 
      });
    }
    else if (event.id) {
      onEventUpdate?.(event);
      // Show toast notification when an event is updated
      // toast(`Event "${event.title}" updated`, {
      //   description: format(new Date(event.start), "MMM d, yyyy"),
      //   position: "bottom-left",
      // });
    } else {
      onEventAdd?.({
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      });
      // Show toast notification when an event is added
      // toast(`Event "${event.title}" added`, {
      //   description: format(new Date(event.start), "MMM d, yyyy"),
      //   position: "bottom-left",
      // });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId);
    onEventDelete?.(eventId);
    setIsEventDialogOpen(false);
    setSelectedEvent(null);

    // If the deleted event is a class (not a user-created event)
    if (deletedEvent?.id !== "preview") {
      setClassesState((prev) =>
        prev.map((cls) =>
          cls.title === deletedEvent?.title
            ? { ...cls, selected: false } // re-enable button
            : cls
        )
      );
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);

    // Show toast notification when an event is updated via drag and drop
    // toast(`Event "${updatedEvent.title}" moved`, {
    //   description: format(new Date(updatedEvent.start), "MMM d, yyyy"),
    //   position: "bottom-left",
    // });
  };

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
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={cn(
            "flex items-center justify-between p-2 sm:p-4",
            className,
          )}
        >
          <div className="flex items-center gap-1 sm:gap-4">
            <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
              Spring 2026
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="max-[479px]:aspect-square max-[479px]:p-0!"
              size="sm"
              onClick={() => {
                setSelectedEvent(null); // Ensure we're creating a new event
                setIsEventDialogOpen(true);
              }}
            >
              <PlusIcon
                className="opacity-60 sm:-ms-1"
                size={16}
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">New event</span>
            </Button>

             <div className="flex items-center gap-2">
              {classes.map((cls) => {

                return (
                  <Button
                    key={cls.id}
                    className="max-[479px]:aspect-square max-[479px]:p-0!"
                    size="sm"
                    disabled={cls.selected} 
                    onClick={() => 
                      {
                        addClassToCalendar(handleEventSave, cls.title, cls.times, "emerald", false);
                        setClassesState(prev =>
                          prev.map(c =>
                            c.id === cls.id ? { ...c, selected: true } : c
                          )
                        );
                      }
                    }
                    onMouseEnter={() => 
                      {
                        if (!cls.selected) {
                          addClassToCalendar(handleEventSave, cls.title, cls.times, "sky", true);
                        }
                      }
                    }
                    onMouseLeave={() => 
                      {
                        handleEventDelete("preview")
                      }
                    }
                  >
                    <PlusIcon
                      className="opacity-60 sm:-ms-1"
                      size={16}
                      aria-hidden="true"
                    />
                    <span className="max-sm:sr-only">{cls.title}</span>
                  </Button>
                );
              })}
            </div>

          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {/* {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )} */}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
        />
      </CalendarDndProvider>
    </div>
  );
}
