import React, { useEffect, useRef } from 'react';
import { Task } from '../../types/task';
import { Category } from '../../types/category';
import { Clock, MapPin } from 'lucide-react';

interface DayViewProps {
  selectedDate: Date;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
  onNewTask: (date: Date) => void;
  categories: Category[];
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  tasks,
  onTaskClick,
  onNewTask,
  categories
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);

  // יצירת מערך של שעות היום
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // פילטור משימות ליום הנבחר
  const dayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  // פונקציה לחישוב המיקום האנכי של המשימה לפי השעה
  const getTaskPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60 + minutes) * (100 / (24 * 60)); // המרה לאחוזים
  };

  // פונקציה לבדיקה אם השעה עברה
  const isPastTime = (hour: number) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() < today.getTime()) {
      return true;
    }
    
    if (selectedDate.getTime() > today.getTime()) {
      return false;
    }
    
    return hour < now.getHours();
  };

  // גלילה לשעה הנוכחית בטעינה
  useEffect(() => {
    if (containerRef.current && currentTimeRef.current) {
      const now = new Date();
      const scrollPosition = (now.getHours() * 60 + now.getMinutes()) * (100 / (24 * 60));
      containerRef.current.scrollTop = (containerRef.current.scrollHeight * scrollPosition) / 100;
    }
  }, []);

  // עדכון מיקום הסמן של השעה הנוכחית
  useEffect(() => {
    const updateCurrentTime = () => {
      if (currentTimeRef.current) {
        const now = new Date();
        const percent = ((now.getHours() * 60 + now.getMinutes()) * 100) / (24 * 60);
        currentTimeRef.current.style.top = `${percent}%`;
      }
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // עדכון כל דקה

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* כותרת */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {selectedDate.toLocaleDateString('he-IL', { 
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </h2>
      </div>

      {/* רשת השעות */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto relative"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        {/* סמן השעה הנוכחית */}
        {selectedDate.toDateString() === new Date().toDateString() && (
          <div
            ref={currentTimeRef}
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ transform: 'translateY(-50%)' }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="flex-1 border-t border-red-500 border-dashed"></div>
            </div>
          </div>
        )}

        {/* רשת השעות */}
        <div className="relative">
          {hours.map(hour => (
            <div 
              key={hour}
              className={`flex h-20 border-b relative ${
                isPastTime(hour) ? 'bg-gray-50/50' : ''
              }`}
            >
              {/* תווית השעה */}
              <div className="w-16 flex-shrink-0 px-2 py-1 text-sm text-gray-500 text-center">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              
              {/* תא השעה */}
              <div 
                className="flex-1 border-r relative group"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setHours(hour, 0, 0, 0);
                  onNewTask(newDate);
                }}
              >
                {/* כפתור הוספה מרחף */}
                <button className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50/50 transition-opacity flex items-center justify-center">
                  <span className="sr-only">הוסף משימה בשעה {hour}:00</span>
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    +
                  </div>
                </button>
              </div>
            </div>
          ))}

          {/* משימות */}
          {dayTasks.map(task => {
            const category = categories.find(c => c.id === task.category);
            const top = getTaskPosition(task.dueTime || '00:00');
            
            if (!task.id) return null;
            
            return (
              <div
                key={task.id}
                className={`absolute left-16 right-0 p-1 ${
                  task.isCompleted ? 'opacity-50' : ''
                }`}
                style={{ top: `${top}%` }}
                onClick={() => onTaskClick(task.id!)}
              >
                <div 
                  className={`
                    p-2 rounded-lg shadow-sm cursor-pointer
                    transition-transform hover:scale-[1.02]
                    ${task.isCompleted ? 'bg-gray-100' : 'bg-white'}
                    border-r-4 border-${category?.color || 'gray'}-500
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {task.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{task.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{task.dueTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView; 