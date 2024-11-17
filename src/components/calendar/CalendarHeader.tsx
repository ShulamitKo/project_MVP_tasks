import React from 'react';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';

interface CalendarHeaderProps {
  viewType: 'month' | 'week';
  selectedDate: Date;
  onViewChange: (view: 'month' | 'week') => void;
  onDateChange: (direction: number) => void;
  onNewTask: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewType,
  selectedDate,
  onViewChange,
  onDateChange,
  onNewTask
}) => {
  return (
    <header className="bg-white border-b p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">יומן משימות</h1>
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange('month')}
            className={`px-4 py-2 rounded-lg ${
              viewType === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            חודשי
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-4 py-2 rounded-lg ${
              viewType === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            שבועי
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onDateChange(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium">
            {selectedDate.toLocaleString('he-IL', { 
              month: 'long', 
              year: 'numeric',
              ...(viewType === 'week' && { day: 'numeric' })
            })}
          </h2>
          <button 
            onClick={() => onDateChange(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={onNewTask}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          משימה חדשה
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;