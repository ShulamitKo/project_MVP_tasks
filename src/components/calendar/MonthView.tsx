import React from 'react';
import { Clock } from 'lucide-react';
import { Task } from '../../types/task';
import { Category } from '../../types/category';

interface MonthViewProps {
  selectedDate: Date;
  tasks: Task[];
  categories: Category[];
  onTaskClick: (taskId: number) => void;
  onNewTask?: (date: Date) => void;
}

interface DayTask {
  id: number;
  title: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
}

interface TasksByDate {
  [key: string]: DayTask[];
}

const MonthView: React.FC<MonthViewProps> = ({ 
  selectedDate, 
  tasks,
  onTaskClick 
}) => {
  // המרת המשימות למבנה נתונים מאורגן לפי תאריכים
  const tasksByDate: TasksByDate = tasks.reduce((acc: TasksByDate, task) => {
    const dateKey = task.dueDate;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      id: task.id!,
      title: task.title,
      time: task.dueTime || '',
      priority: task.priority || 'medium',
      category: task.category
    });
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* ימי השבוע */}
      {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
        <div key={day} className="text-center text-gray-500 font-medium py-2">
          {day}
        </div>
      ))}

      {/* ימי החודש */}
      {Array.from({ length: 42 }).map((_, index) => {
        const dayNumber = index - (new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()) + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        const isToday = dayNumber === new Date().getDate() && 
                       selectedDate.getMonth() === new Date().getMonth() &&
                       selectedDate.getFullYear() === new Date().getFullYear();
        
        // יצירת מפתח תאריך בפורמט YYYY-MM-DD
        const formattedDate = isCurrentMonth ? 
          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}` : '';
        
        const dayTasks = formattedDate ? (tasksByDate[formattedDate] || []) : [];

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
                {/* משימות היום */}
                <div className="space-y-1">
                  {dayTasks.map((task: DayTask) => (
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
                      {task.time && (
                        <div className="flex items-center text-xs mt-1">
                          <Clock className="w-3 h-3 ml-1" />
                          <span>{task.time}</span>
                        </div>
                      )}
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