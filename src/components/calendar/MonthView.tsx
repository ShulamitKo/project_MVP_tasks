import React from 'react';
import { Clock } from 'lucide-react';

interface MonthViewProps {
  selectedDate: Date;
  onTaskClick: (taskId: number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ selectedDate, onTaskClick }) => {
  const tasks = {
    '2024-05-15': [
      { 
        id: 1, 
        title: 'פגישת צוות',
        time: '10:00',
        priority: 'high'
      }
    ]
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Days of week */}
      {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
        <div key={day} className="text-center text-gray-500 font-medium py-2">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {Array.from({ length: 42 }).map((_, index) => {
        const dayNumber = index - (new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()) + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        const isToday = dayNumber === new Date().getDate() && 
                      selectedDate.getMonth() === new Date().getMonth() &&
                      selectedDate.getFullYear() === new Date().getFullYear();
        const formattedDate = `2024-05-${String(dayNumber).padStart(2, '0')}`;
        const dayTasks = tasks[formattedDate] || [];

        return (
          <div
            key={index}
            className={`min-h-32 bg-white rounded-lg border p-2 transition-shadow hover:shadow-md ${
              isCurrentMonth ? '' : 'bg-gray-50'
            } ${isToday ? 'border-blue-500' : 'border-gray-200'}`}
          >
            {isCurrentMonth && (
              <>
                <div className={`text-right mb-2 ${
                  isToday ? 'text-blue-500 font-bold' : 'text-gray-600'
                }`}>
                  {dayNumber}
                </div>
                {/* Tasks for the day */}
                <div className="space-y-1">
                  {dayTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => onTaskClick(task.id)}
                      className={`w-full p-2 rounded text-sm ${
                        task.priority === 'high' 
                          ? 'bg-red-50 text-red-700'
                          : task.priority === 'medium'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="flex items-center text-xs mt-1">
                        <Clock className="w-3 h-3 ml-1" />
                        <span>{task.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;