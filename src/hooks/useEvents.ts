import { useState, useEffect } from 'react';
import { Event, DayEvents } from '@/types';

const STORAGE_KEY = 'calendar_events';

export const useEvents = () => {
  const [events, setEvents] = useState<DayEvents>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<DayEvents>({});

  // Load events from localStorage on initial mount
  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Persist events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Filter events whenever searchTerm or events change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEvents(events);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered: DayEvents = {};

    // Search through all events and match against title, description, and date
    Object.entries(events).forEach(([date, dateEvents]) => {
      const matchingEvents = dateEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTermLower) ||
          event.description?.toLowerCase().includes(searchTermLower) ||
          date.includes(searchTermLower)
      );

      if (matchingEvents.length > 0) {
        filtered[date] = matchingEvents;
      }
    });

    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const addEvent = (event: Event) => {
    const dateKey = event.date;
    const existingEvents = events[dateKey] || [];
    
    // Validate event times to prevent overlaps
    const hasOverlap = existingEvents.some(
      (e) =>
        (event.startTime >= e.startTime && event.startTime < e.endTime) ||
        (event.endTime > e.startTime && event.endTime <= e.endTime) ||
        (event.startTime <= e.startTime && event.endTime >= e.endTime)
    );

    if (hasOverlap) {
      throw new Error('Event time overlaps with an existing event');
    }

    // Add new event and sort by start time
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), event].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ),
    }));
  };

  const updateEvent = (event: Event) => {
    const dateKey = event.date;
    setEvents((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((e) => 
        e.id === event.id ? event : e
      ).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
  };

  const deleteEvent = (eventId: string, date: string) => {
    setEvents((prev) => ({
      ...prev,
      [date]: prev[date].filter((e) => e.id !== eventId),
    }));
  };

  // Move event from one day to another
  const moveEvent = (eventId: string, fromDate: string, toDate: string) => {
    const event = events[fromDate]?.find((e) => e.id === eventId);
    if (!event) return;

    // Create new event for the target date
    const movedEvent: Event = {
      ...event,
      date: toDate,
    };

    // Remove from source date and add to target date
    setEvents((prev) => {
      const newEvents = { ...prev };
      newEvents[fromDate] = prev[fromDate].filter((e) => e.id !== eventId);
      newEvents[toDate] = [...(prev[toDate] || []), movedEvent].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      return newEvents;
    });
  };

  const getEventsForDate = (date: string) => {
    return searchTerm ? filteredEvents[date] || [] : events[date] || [];
  };

  const getAllEvents = () => {
    return Object.values(events).flat();
  };

  const exportEvents = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(events, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `calendar-events-${new Date().toISOString()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      const headers = ['Date', 'Title', 'Description', 'Start Time', 'End Time', 'Color'];
      const rows = Object.entries(events).flatMap(([date, dateEvents]) =>
        dateEvents.map((event) => [
          date,
          event.title,
          event.description || '',
          event.startTime,
          event.endTime,
          event.color,
        ])
      );
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');
      const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
      const exportFileDefaultName = `calendar-events-${new Date().toISOString()}.csv`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return {
    events: filteredEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    getEventsForDate,
    getAllEvents,
    setSearchTerm,
    exportEvents,
  };
};