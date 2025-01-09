import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { X } from 'lucide-react';

// Define the Event type
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color: 'work' | 'personal' | 'other';
}

// Define categories configuration
const categories = [
  { 
    value: 'work' as const, 
    label: 'Work', 
    color: 'blue',
    icon: '💼'
  },
  { 
    value: 'personal' as const, 
    label: 'Personal', 
    color: 'green',
    icon: '🏠'
  },
  { 
    value: 'other' as const, 
    label: 'Other', 
    color: 'purple',
    icon: '📌'
  }
];

interface EventDialogProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string, date: string) => void;
  editEvent?: Event;
}

export function EventDialog({
  date,
  open,
  onOpenChange,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  editEvent,
}: EventDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState<'work' | 'personal' | 'other'>('work');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setStartTime(editEvent.startTime);
      setEndTime(editEvent.endTime);
      setColor(editEvent.color);
    } else {
      resetForm();
    }
  }, [editEvent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const eventData: Event = {
        id: editEvent?.id || crypto.randomUUID(),
        title,
        description,
        startTime,
        endTime,
        date: format(date, 'yyyy-MM-dd'),
        color,
      };

      if (editEvent) {
        onUpdateEvent(eventData);
      } else {
        onAddEvent(eventData);
      }
      onOpenChange(false);
      resetForm();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = () => {
    if (editEvent) {
      onDeleteEvent(editEvent.id, editEvent.date);
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setColor('work');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[400px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800/95 shadow-2xl border-0 rounded-2xl backdrop-blur-sm">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4 text-red-500" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {editEvent ? 'Edit Event' : 'Add Event'} - {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 rounded-xl border-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] rounded-xl border-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-9 rounded-xl border-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-9 rounded-xl border-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </Label>
            <RadioGroup
              value={color}
              onValueChange={(value: 'work' | 'personal' | 'other') => setColor(value)}
              className="grid grid-cols-3 gap-2"
            >
              {categories.map((category) => (
                <div
                  key={category.value}
                  className={`
                    relative flex items-center justify-center
                    rounded-xl border-2 p-3 transition-all duration-200
                    ${color === category.value 
                      ? `border-${category.color}-500 bg-${category.color}-50 dark:border-${category.color}-400 dark:bg-${category.color}-900/20` 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'}
                  `}
                >
                  <RadioGroupItem
                    value={category.value}
                    id={category.value}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={category.value}
                    className="cursor-pointer text-center space-y-1"
                  >
                    <div className="text-xl">{category.icon}</div>
                    <div className={`
                      text-sm font-medium transition-colors
                      ${color === category.value 
                        ? `text-${category.color}-700 dark:text-${category.color}-300` 
                        : 'text-gray-600 dark:text-gray-400'}
                    `}>
                      {category.label}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </p>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              className={`
                flex-1 h-10 text-sm font-medium rounded-xl
                ${editEvent 
                  ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                }
                text-white shadow-lg hover:shadow-xl
                transform transition-all duration-200 hover:-translate-y-0.5
              `}
            >
              {editEvent ? 'Update Event' : 'Add Event'}
            </Button>
            {editEvent && (
              <Button
                type="button"
                onClick={handleDelete}
                className="h-10 px-4 text-sm font-medium rounded-xl
                  bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700
                  text-white shadow-lg hover:shadow-xl
                  transform transition-all duration-200 hover:-translate-y-0.5"
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}