import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Clock
} from 'lucide-react';
import { Task } from '../types/task';

interface CalendarViewProps {
  tasks: Task[];
  activeCategory: string;
  onTaskClick: (taskId: number) => void;
  onNewTask: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  tasks, 
  activeCategory,
  onTaskClick,
  onNewTask 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // מחזיר את המערך של ימי החודש
  const getMonthDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // מוסיף את הימים הריקים בתחילת החודש
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // מוסיף את ימי החודש
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // בודק אם יש משימות לתאריך מסוים
  const getTasksForDate = (day: number) => {
    if (!day) return [];
    
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getFullYear() === today.getFullYear();
  };

  // פונקציה להחזרת סטייל למשימה בהתאם לקטגוריה
  const getTaskStyle = (task: Task) => {
    const baseStyle = `w-full p-2 rounded text-sm transition-all duration-300 ${
      task.priority === 'high' 
        ? 'bg-red-50 text-red-700'
        : task.priority === 'medium'
          ? 'bg-yellow-50 text-yellow-700'
          : 'bg-green-50 text-green-700'
    }`;

    // אם זו הקטגוריה הפעילה, נוסיף הדגשה
    if (activeCategory !== 'all' && task.category === activeCategory) {
      return `${baseStyle} transform scale-105 shadow-md ring-2 ring-blue-400 ring-opacity-50`;
    }

    // אם יש קטגוריה פעילה אבל זו לא המשימה ממנה, נעמעם קצת
    if (activeCategory !== 'all' && task.category !== activeCategory) {
      return `${baseStyle} opacity-40`;
    }

    return baseStyle;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">יומן משימות</h1>
          <button 
            onClick={onNewTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            משימה חדשה
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleMonthChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium">
              {selectedDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => handleMonthChange(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-7 gap-2">
          {/* ימי השבוע */}
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
            <div key={day} className="text-center text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}

          {/* ימי החודש */}
          {getMonthDays().map((day, index) => (
            <div
              key={index}
              className={`min-h-32 ${
                day ? 'bg-white rounded-lg border p-2 transition-shadow hover:shadow-md' : ''
              } ${isToday(day!) ? 'border-blue-500' : 'border-gray-200'}`}
            >
              {day && (
                <>
                  <div className={`text-right mb-2 ${
                    isToday(day) ? 'text-blue-500 font-bold' : 'text-gray-600'
                  }`}>
                    {day}
                  </div>
                  {/* משימות של היום - עם סטיילינג מעודכן */}
                  <div className="space-y-1">
                    {getTasksForDate(day).map(task => (
                      <button
                        key={task.id}
                        onClick={() => onTaskClick?.(task.id!)}
                        className={getTaskStyle(task)}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Clock className="w-3 h-3 ml-1" />
                          <span>{task.dueTime}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;