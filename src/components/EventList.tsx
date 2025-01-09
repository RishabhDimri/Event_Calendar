import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Event } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EventDialog } from './EventDialog';

interface EventListProps {
  date: Date;
  events: Event[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteEvent: (eventId: string, date: string) => void;
  onUpdateEvent: (event: Event) => void;
}

export function EventList({
  date,
  events,
  open,
  onOpenChange,
  onDeleteEvent,
  onUpdateEvent,
}: EventListProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setShowEditDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Events for {format(date, 'MMMM d, yyyy')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg relative hover:shadow-md transition-shadow duration-200 ${
                    event.color === 'work'
                      ? 'bg-blue-100 text-blue-900'
                      : event.color === 'personal'
                      ? 'bg-green-100 text-green-900'
                      : 'bg-purple-100 text-purple-900'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                      <div className="text-sm mt-2 font-medium">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    <div className="flex gap-1 items-start">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                        className={`h-8 px-2 hover:bg-opacity-20 ${
                          event.color === 'work'
                            ? 'hover:bg-blue-200'
                            : event.color === 'personal'
                            ? 'hover:bg-green-200'
                            : 'hover:bg-purple-200'
                        }`}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        <span className="text-sm">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteEvent(event.id, dateStr)}
                        className={`h-8 px-2 hover:bg-opacity-20 ${
                          event.color === 'work'
                            ? 'hover:bg-blue-200'
                            : event.color === 'personal'
                            ? 'hover:bg-green-200'
                            : 'hover:bg-purple-200'
                        }`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-sm">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No events scheduled for this day
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {editEvent && (
        <EventDialog
          date={date}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onAddEvent={() => {}}
          onUpdateEvent={(event) => {
            onUpdateEvent(event);
            setShowEditDialog(false);
            setEditEvent(null);
          }}
          onDeleteEvent={(id, date) => {
            onDeleteEvent(id, date);
            setShowEditDialog(false);
            setEditEvent(null);
          }}
          editEvent={editEvent}
        />
      )}
    </>
  );
}