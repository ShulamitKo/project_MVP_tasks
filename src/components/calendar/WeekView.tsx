import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Task } from '../../types/task';
import { Category } from '../../types/category';

interface WeekViewProps {
  selectedDate: Date;
  tasks: Task[];
  categories: Category[];
  onTaskClick: (taskId: number) => void;
  onNewTask?: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ 
  selectedDate, 
  tasks, 
  categories,
  onTaskClick,
  onNewTask 
}) => {
  // פונקציה להשגת תאריכי השבוע
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  // פונקציה לפורמט תאריך לפורמט YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // פונקציה לבדיקה אם משימה שייכת לשעה מסוימת
  const getTasksForTimeSlot = (date: Date, hour: number) => {
    const dateStr = formatDate(date);
    return tasks.filter(task => {
      if (task.dueDate !== dateStr) return false;
      const taskHour = task.dueTime ? parseInt(task.dueTime.split(':')[0]) : null;
      return taskHour === hour;
    });
  };

  const weekDates = getWeekDates(selectedDate);
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00
  const currentHour = new Date().getHours();
  const now = new Date();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <div className="min-w-[800px]">
        {/* Header - ימי השבוע */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 text-gray-500 font-medium border-l"></div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === now.toDateString();
            const dayTasks = tasks.filter(task => task.dueDate === formatDate(date));
            
            return (
              <div
                key={index}
                className={`p-4 text-center border-l ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium text-gray-600">
                  {date.toLocaleString('he-IL', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </div>
                {dayTasks.length > 0 && (
                  <div className="mt-1 text-sm text-gray-500">
                    {dayTasks.length} משימות
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid - שעות ומשימות */}
        <div className="grid grid-cols-8">
          {/* עמודת השעות */}
          <div className="border-l">
            {hours.map(hour => (
              <div
                key={hour}
                className={`h-24 border-b p-2 text-sm text-gray-500 ${
                  hour === currentHour ? 'bg-blue-50' : ''
                }`}
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* תאי זמן לכל יום */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="border-l relative">
              {hours.map(hour => {
                const timeSlotTasks = getTasksForTimeSlot(date, hour);
                const isCurrentTimeSlot = date.toDateString() === now.toDateString() && hour === currentHour;
                
                return (
                  <div 
                    key={hour} 
                    className={`h-24 border-b relative group ${
                      isCurrentTimeSlot ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (onNewTask) {
                        const newDate = new Date(date);
                        newDate.setHours(hour, 0, 0, 0);
                        onNewTask(newDate);
                      }
                    }}
                  >
                    {/* כפתור הוספה מרחף */}
                    {onNewTask && (
                      <button className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50/50 transition-opacity flex items-center justify-center">
                        <span className="sr-only">הוסף משימה בשעה {hour}:00</span>
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          +
                        </div>
                      </button>
                    )}

                    {/* משימות */}
                    {timeSlotTasks.map(task => {
                      const category = categories.find(c => c.id === task.category);
                      if (!task.id) return null;

                      return (
                        <button
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task.id!);
                          }}
                          className={`absolute inset-x-0 mx-1 p-2 rounded cursor-pointer text-sm
                            transition-transform hover:scale-[1.02] ${
                            task.isCompleted 
                              ? 'bg-gray-100 text-gray-600'
                              : `bg-${category?.color || 'blue'}-100 text-${category?.color || 'blue'}-800`
                          }`}
                        >
                          <div className="font-medium truncate">{task.title}</div>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 ml-1" />
                              <span>{task.dueTime}</span>
                            </div>
                            {task.location && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 ml-1" />
                                <span className="truncate">{task.location}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;