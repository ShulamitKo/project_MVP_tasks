import React from 'react';
import { ChevronRight, ChevronLeft, CalendarClock } from 'lucide-react';

type TimeRangeType = 'today' | 'week' | 'month';

interface TimeRangeSelectorProps {
  selectedRange: TimeRangeType;
  startDate: Date;
  endDate: Date;
  onRangeChange: (range: TimeRangeType) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onResetToToday: () => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  startDate,
  endDate,
  onRangeChange,
  onNavigate,
  onResetToToday
}) => {
  const formatDateRange = () => {
    const formatter = new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    if (selectedRange === 'today') {
      return formatter.format(startDate);
    }
    
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  };

  const ranges = [
    { id: 'today', label: 'יום' },
    { id: 'week', label: 'שבוע' },
    { id: 'month', label: 'חודש' }
  ] as const;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden"
      role="region" 
      aria-label="בורר טווח זמן"
    >
      <div className="border-b border-gray-100 p-2 md:p-4">
        <div 
          className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full"
          role="radiogroup"
          aria-label="בחירת טווח זמן"
        >
          {ranges.map(range => (
            <button
              key={range.id}
              onClick={() => onRangeChange(range.id)}
              className={`
                flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                ${selectedRange === range.id
                  ? 'bg-white text-blue-600 shadow-md scale-105 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              role="radio"
              aria-checked={selectedRange === range.id}
              aria-label={`הצג סטטיסטיקות ל${range.label}`}
              title={`הצג סטטיסטיקות ל${range.label}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-2 md:p-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-base md:text-lg font-medium text-gray-900 text-center">
            סטטיסטיקות {selectedRange === 'today' ? 'ליום' : selectedRange === 'week' ? 'לשבוע' : 'לחודש'}
          </h2>
          
          <div className="flex flex-col items-center gap-2">
            <div 
              className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg"
              role="group"
              aria-label="ניווט בין תקופות"
            >
              <button
                onClick={() => onNavigate('prev')}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="עבור לתקופה הקודמת"
                title="עבור לתקופה הקודמת"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <span 
                className="text-gray-900 font-medium min-w-[160px] md:min-w-[200px] text-center text-sm md:text-base px-2"
                aria-live="polite"
                role="status"
                aria-label={`טווח תאריכים נוכחי: ${formatDateRange()}`}
              >
                {formatDateRange()}
              </span>
              
              <button
                onClick={() => onNavigate('next')}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="עבור לתקופה הבאה"
                title="עבור לתקופה הבאה"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <button
              onClick={onResetToToday}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="חזור לתאריך הנוכחי"
              title="חזור לתאריך הנוכחי"
            >
              <CalendarClock className="w-4 h-4" aria-hidden="true" />
              <span>חזור להיום</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeSelector; 