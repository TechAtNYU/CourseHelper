"use client";

import { RiCalendarLine, RiDeleteBinLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TimeSlot, CalendarEvent, EventColor } from "./types";
import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from "./constants";
import { startOfWeek, addDays } from "date-fns";

export function addClassToCalendar(
  onSave: (event: CalendarEvent) => void,
  title: string,
  timeSlots: string[], // format: ["Wednesday 9 15 10 15"]
  color: EventColor = "emerald",
  isPreview: boolean,
  description: string,
) {
  const slots: { start: Date; end: Date }[] = [];
  const eventID = isPreview ? "preview" : "";

  // Map weekday names to 0-6 offset from start of week (Monday = 0)
  const weekdayMap: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  // Get the start of the current week (Monday)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday = 0

  for (const slot of timeSlots) {
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

  onSave({
    id: eventID,
    title,
    description: description,
    timeSlots: slots,
    allDay: false,
    location: "Room 101",
    color,
  });
}


interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`);
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [color, setColor] = useState<EventColor>("sky");
  const [error, setError] = useState<string | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Debug log to check what event is being passed
  useEffect(() => {
    console.log("EventDialog received event:", event);
  }, [event]);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");

      // Use first timeslot if available
      const firstSlot = event.timeSlots?.[0];
      const start = firstSlot ? new Date(firstSlot.start) : new Date();
      const end = firstSlot ? new Date(firstSlot.end) : new Date();


      setStartDate(start);
      setEndDate(end);
      setStartTime(formatTimeForInput(start));
      setEndTime(formatTimeForInput(end));
      setAllDay(event.allDay || false);
      setLocation(event.location || "");
      setColor((event.color as EventColor) || "sky");
      setError(null); // Reset error when opening dialog
    } else {
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(`${DefaultStartHour}:00`);
    setEndTime(`${DefaultEndHour}:00`);
    setAllDay(false);
    setLocation("");
    setColor("sky");
    setError(null);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Memoize time options so they're only calculated once
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        // Use a fixed date to avoid unnecessary date object creations
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []); // Empty dependency array ensures this only runs once

  const handleSave = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!allDay) {
      const [startHours = 0, startMinutes = 0] = startTime
        .split(":")
        .map(Number);
      const [endHours = 0, endMinutes = 0] = endTime.split(":").map(Number);

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(
          `Selected time must be between ${StartHour}:00 and ${EndHour}:00`,
        );
        return;
      }

      start.setHours(startHours, startMinutes, 0);
      end.setHours(endHours, endMinutes, 0);
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    // Validate that end date is not before start date
    if (isBefore(end, start)) {
      setError("End date cannot be before start date");
      return;
    }

    // Use generic title if empty
    const eventTitle = title.trim() ? title : "(no title)";

    onSave({
      id: event?.id || "",
      title: eventTitle,
      description,
      timeSlots: [{ start: start, end: end }],
      allDay,
      location,
      color,
    });
  };


  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  // Updated color options to match types.ts
  const colorOptions: Array<{
    value: EventColor;
    label: string;
    bgClass: string;
    borderClass: string;
  }> = [
    {
      value: "sky",
      label: "Sky",
      bgClass: "bg-sky-400 data-[state=checked]:bg-sky-400",
      borderClass: "border-sky-400 data-[state=checked]:border-sky-400",
    },
    {
      value: "amber",
      label: "Amber",
      bgClass: "bg-amber-400 data-[state=checked]:bg-amber-400",
      borderClass: "border-amber-400 data-[state=checked]:border-amber-400",
    },
    {
      value: "violet",
      label: "Violet",
      bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
      borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
    },
    {
      value: "rose",
      label: "Rose",
      bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
      borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
    },
    {
      value: "emerald",
      label: "Emerald",
      bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
      borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
    },
    {
      value: "orange",
      label: "Orange",
      bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
      borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
    },
    {
      value: "teal",
      label: "Teal",
      bgClass: "bg-teal-400 data-[state=checked]:bg-teal-400",
      borderClass: "border-teal-400 data-[state=checked]:border-teal-400",
    },
    {
      value: "lime",
      label: "Lime",
      bgClass: "bg-lime-400 data-[state=checked]:bg-lime-400",
      borderClass: "border-lime-400 data-[state=checked]:border-lime-400",
    },
    {
      value: "cyan",
      label: "Cyan",
      bgClass: "bg-cyan-400 data-[state=checked]:bg-cyan-400",
      borderClass: "border-cyan-400 data-[state=checked]:border-cyan-400",
    },
    {
      value: "fuchsia",
      label: "Fuchsia",
      bgClass: "bg-fuchsia-400 data-[state=checked]:bg-fuchsia-400",
      borderClass: "border-fuchsia-400 data-[state=checked]:border-fuchsia-400",
    },
    {
      value: "indigo",
      label: "Indigo",
      bgClass: "bg-indigo-400 data-[state=checked]:bg-indigo-400",
      borderClass: "border-indigo-400 data-[state=checked]:border-indigo-400",
    },
    {
      value: "pink",
      label: "Pink",
      bgClass: "bg-pink-400 data-[state=checked]:bg-pink-400",
      borderClass: "border-pink-400 data-[state=checked]:border-pink-400",
    },

  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Class Details" : "Create Event"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id
              ? "Edit the details of this event"
              : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="title">Title</Label>
            <p className="text-sm text-gray-700">{event?.title}</p>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Description</Label>
            <p className="text-sm text-gray-700">{event?.description}</p>
            
          </div>

          <div className="*:not-first:mt-1.5">
          <Label>Time Slots</Label>
          {event?.timeSlots?.length ? (
            <ul className="text-sm text-gray-700 space-y-1">
              {event.timeSlots.map((slot, index) => (
                <li key={index}>
                  {format(slot.start, "EEEE")}: {format(slot.start, "h:mm a")} - {format(slot.end, "h:mm a")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-700">No time slots</p>
          )}
        </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="location">Location</Label>
            <p className="text-sm text-gray-700">{event?.location}</p>
            
          </div>
          {/* <fieldset className="space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              Etiquette
            </legend>
            <RadioGroup
              className="flex gap-1.5"
              defaultValue={colorOptions[0]?.value}
              value={color}
              onValueChange={(value: EventColor) => setColor(value)}
            >
              {colorOptions.map((colorOption) => (
                <RadioGroupItem
                  key={colorOption.value}
                  id={`color-${colorOption.value}`}
                  value={colorOption.value}
                  aria-label={colorOption.label}
                  className={cn(
                    "size-6 shadow-none",
                    colorOption.bgClass,
                    colorOption.borderClass,
                  )}
                />
              ))}
            </RadioGroup>
          </fieldset> */}
        </div>
        <DialogFooter className="flex-row sm:justify-between">
          {event?.id && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              aria-label="Delete event"
            >
              <RiDeleteBinLine size={16} aria-hidden="true" />
            </Button>
          )}
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
