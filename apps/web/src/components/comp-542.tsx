"use client";

import { useState } from "react";
import { type CalendarEvent, EventCalendar } from "./ui/event-calendar";

interface ScheduleProps {
  classes: Class[];
}

interface Class {
  id: string; // unique identifier
  title: string;
  color: string;
  times: string[]; // e.g. ["Monday 9 15 11 15"]
  selected: boolean;
  description: string;
}


export default function Schedule({ classes: initialClasses }: ScheduleProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [classes, setClasses] = useState<Class[]>(initialClasses);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      classes={classes} // Pass classes to EventCalendar
    />
  );
}
