import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import { EventDialog } from '@/components/EventDialog';
import { EventList } from '@/components/EventList';
import { format } from 'date-fns';
import { Event } from '@/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar() {
  const { currentDate, getAllDaysInMonth, goToPreviousMonth, goToNextMonth } = useCalendar();
  const { addEvent, updateEvent, deleteEvent, moveEvent, getEventsForDate } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<{ id: string; date: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventDialog(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event, date: Date) => {
    e.stopPropagation();
    setSelectedDate(date);
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleShowEvents = (date: Date) => {
    setSelectedDate(date);
    setShowEventList(true);
  };

  const handleDragStart = (e: React.DragEvent, eventId: string, date: string) => {
    e.stopPropagation();
    setDraggedEvent({ id: eventId, date });
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    if (!draggedEvent) return;

    const { id, date: sourceDate } = draggedEvent;
    if (sourceDate !== targetDate) {
      moveEvent(id, sourceDate, targetDate);
    }
    setDraggedEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={goToPreviousMonth}
            className="group relative h-12 w-12 rounded-full border-2 border-gray-200 bg-white/80 p-0 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-blue-400 dark:hover:bg-gray-700/80"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-400">
              Previous
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={goToNextMonth}
            className="group relative h-12 w-12 rounded-full border-2 border-gray-200 bg-white/80 p-0 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-blue-400 dark:hover:bg-gray-700/80"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-400">
              Next
            </span>
          </Button>
        </div>
            
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center font-semibold p-2 text-sm text-gray-500 dark:text-gray-400 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {getAllDaysInMonth().map((day, index) => {
          const dateStr = format(day.date, 'yyyy-MM-dd');
          const dayEvents = getEventsForDate(dateStr);
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
          const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr;

          return (
            <div
              key={index}
              className={`
                relative group
                bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700
                p-2 min-h-[120px] cursor-pointer transition-all hover:shadow-md
                ${!day.isCurrentMonth ? 'opacity-40' : ''}
                ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                ${isSelected ? 'bg-gray-50/80 dark:bg-gray-700/80' : ''}
                hover:scale-[1.02] hover:bg-gray-50/90 dark:hover:bg-gray-700/90
              `}
              onClick={() => handleDayClick(day.date)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {format(day.date, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowEvents(day.date);
                    }}
                  >
                    {dayEvents.length}
                  </Badge>
                )}
              </div>
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id, dateStr)}
                    onClick={(e) => handleEventClick(e, event, day.date)}
                    className={`
                      text-xs p-2 rounded-lg cursor-move
                      transition-all duration-200 group-hover:translate-x-1
                      hover:ring-2 hover:ring-opacity-50 hover:shadow-sm
                      ${event.color === 'work'
                        ? 'bg-blue-100/80 text-blue-800 hover:ring-blue-500 dark:bg-blue-900/80 dark:text-blue-100'
                        : event.color === 'personal'
                        ? 'bg-green-100/80 text-green-800 hover:ring-green-500 dark:bg-green-900/80 dark:text-green-100'
                        : 'bg-purple-100/80 text-purple-800 hover:ring-purple-500 dark:bg-purple-900/80 dark:text-purple-100'
                      }
                    `}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pl-2 italic">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <>
          <EventDialog
            date={selectedDate}
            open={showEventDialog}
            onOpenChange={setShowEventDialog}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            editEvent={selectedEvent || undefined}
          />
          <EventList
            date={selectedDate}
            events={getEventsForDate(format(selectedDate, 'yyyy-MM-dd'))}
            open={showEventList}
            onOpenChange={setShowEventList}
            onDeleteEvent={deleteEvent}
            onUpdateEvent={updateEvent}
          />
        </>
      )}
    </div>
  );
}