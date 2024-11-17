import React from 'react';
import { Clock } from 'lucide-react';

interface WeekViewProps {
  selectedDate: Date;
  onTaskClick: (taskId: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ selectedDate, onTaskClick }) => {
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(selectedDate);
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00
  const currentHour = new Date().getHours();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header - Days of week */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 text-gray-500 font-medium border-l"></div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`p-4 text-center border-l ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium">
                  {date.toLocaleString('he-IL', { weekday: 'short' })}
                </div>
                <div className={`text-2xl ${isToday ? 'text-blue-600' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid - Hours and Tasks */}
        <div className="grid grid-cols-8">
          {/* Hours */}
          <div className="border-l">
            {hours.map(hour => (
              <div
                key={hour}
                className={`h-20 border-b p-2 text-sm text-gray-500 ${
                  hour === currentHour ? 'bg-blue-50' : ''
                }`}
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Time slots for each day */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="border-l relative">
              {hours.map(hour => (
                <div key={hour} className="h-20 border-b relative">
                  {hour === 10 && dayIndex === 3 && (
                    <button
                      onClick={() => onTaskClick(1)}
                      className="absolute inset-x-0 top-0 mx-1 bg-blue-100 text-blue-800 rounded p-2 cursor-pointer text-sm hover:bg-blue-200"
                    >
                      <div className="font-medium">פגישת צוות</div>
                      <div className="flex items-center text-xs mt-1">
                        <Clock className="w-3 h-3 ml-1" />
                        <span>10:00 - 11:30</span>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;