"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    PlusIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    CalendarDndProvider,
    EventDialog,
    WeekView
} from ".";
import {
    EventGap,
    EventHeight,
    WeekCellsHeight
} from "./constants";
import { addClassToCalendar } from './event-dialog';
import type { CalendarEvent, CalendarView, EventColor } from "./types";

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
  description: string;
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

  

  const allColors: EventColor[] = ["sky", "amber", "violet", "rose", "emerald", "orange", "teal", "lime", "indigo", "fuchsia", "pink", "cyan"];

  const pickColor = (): EventColor => {
    const randomIndex = Math.floor(Math.random() * allColors.length);
    return allColors[randomIndex];
  };
  
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
      id: "basic-algo-ba",
      title: "CSCI-UA 310 Basic Algorithms",
      color: pickColor(),
      times: ["Monday 9 15 10 30", "Wednesday 9 15 10 30", "Friday 14 0 15 15"],
      description: "An introduction to the study of algorithms. Two main themes are presented: designing appropriate data structures, and analyzing the efficiency of the algorithms which use them. Algorithms for basic problems are studied. These include sorting, searching, graph algorithms and maintaining dynamic data structures. Homework assignments, not necessarily involving programming.",
      selected: false,
    },
    {
      id: "french-tth",
      title: "FREN-UA 30 French Grammar and Composition",
      color: pickColor(),
      times: ["Tuesday 11 0 12 15", "Thursday 11 0 12 15"],
      description: "Systematizes and reinforces the language skills presented in earlier-level courses through an intensive review of grammar, written exercises, an introduction to composition, lexical enrichment, and literary analysis.",
      
      selected: false,
    },
    {
      id: "cs-mw",
      title: "CS-UH 1002 Discrete Mathematics",
      color: pickColor(),
      times: ["Monday 14 10 15 25", "Wednesday 14 10 15 25"],
      description: "Discrete mathematics concerns the study of mathematical structures that are discrete rather than continuous, and provides a powerful language for investigating many areas of computer science. Discrete structures are characterized by distinct elements, which are often represented by integers. Continuous mathematics on the other hand deals with real numbers. Topics in this course include: sets, counting techniques, logic, proof techniques, solving recurrence relations, number theory, probability, statistics, graph theory, and discrete geometry. These mathematical tools are illustrated with applications in computer science.",
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

  // TODO: fix so that titles are unique to the sections!!! Right now there is a bug 
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
            {/* <Button
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
            </Button> */}

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
                        addClassToCalendar(handleEventSave, cls.title, cls.times, cls.color as EventColor, false, cls.description);
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
                          addClassToCalendar(handleEventSave, cls.title, cls.times, cls.color as EventColor, true, cls.description);
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
          {<WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
              onEventDelete={handleEventDelete}
            />
          }
          
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
