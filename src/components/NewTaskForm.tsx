import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Bell,
  Repeat
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory, TaskRepeat } from '../types/task';

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface NewTaskFormProps {
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialTask?: Task;
  categories: Category[];
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose, onSubmit, initialTask, categories }) => {
  const [task, setTask] = useState<Task>(initialTask || {
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    category: '' as TaskCategory,
    priority: '' as TaskPriority,
    location: '',
    reminder: '30',
    repeat: 'none',
    isCompleted: false,
    isFavorite: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(task);
    }
    onClose();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTask({ ...task, category: e.target.value as TaskCategory });
  };

  const handleRepeatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskRepeat;
    setTask({ ...task, repeat: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-500" />
            </button>
            <h1 className="text-xl font-bold">
              {initialTask ? 'עריכת משימה' : 'משימה חדשה'}
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {initialTask ? 'שמירת שינויים' : 'יצירת משימה'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">
        {/* כותרת ותיאור */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">כותרת המשימה</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({...task, title: e.target.value})}
              placeholder="הכנס כותרת למשימה"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">תיאור</label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({...task, description: e.target.value})}
              placeholder="הוסף תיאור מפורט למשימה"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* תאריך ושעה */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">תאריך</label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({...task, dueDate: e.target.value})}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">שעה</label>
            <div className="relative">
              <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="time"
                value={task.dueTime}
                onChange={(e) => setTask({...task, dueTime: e.target.value})}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* קטגוריה ועדיפות */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">קטגוריה</label>
            <select
              value={task.category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories
                .filter(cat => cat.id !== 'all')
                .map(category => (
                  <option key={category.id} value={category.id as TaskCategory}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">עדיפות</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTask({...task, priority: 'high'})}
                className={`py-2 rounded-lg flex items-center justify-center ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-700 border-2 border-red-700'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                גבוהה
              </button>
              <button
                type="button"
                onClick={() => setTask({...task, priority: 'medium'})}
                className={`py-2 rounded-lg flex items-center justify-center ${
                  task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-700'
                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                }`}
              >
                בינונית
              </button>
              <button
                type="button"
                onClick={() => setTask({...task, priority: 'low'})}
                className={`py-2 rounded-lg flex items-center justify-center ${
                  task.priority === 'low'
                    ? 'bg-green-100 text-green-700 border-2 border-green-700'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                נמוכה
              </button>
            </div>
          </div>
        </div>

        {/* מיקום */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">מיקום</label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={task.location}
              onChange={(e) => setTask({...task, location: e.target.value})}
              placeholder="הכנס מיקום (אוציונלי)"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* כפתור הגדרות נוספות */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          הגדרות נוספות
        </button>

        {/* הגדרות נוספות */}
        {showAdvanced && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {/* תזכורת */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">תזכורת</label>
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
                <select
                  value={task.reminder}
                  onChange={(e) => setTask({...task, reminder: e.target.value})}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">ללא תזכורת</option>
                  <option value="0">בזמן המשימה</option>
                  <option value="15">15 דקות לפני</option>
                  <option value="30">30 דקות לפני</option>
                  <option value="60">שעה לפני</option>
                  <option value="1440">יום לפני</option>
                </select>
              </div>
            </div>

            {/* חזרה */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">חזרה</label>
              <div className="relative">
                <Repeat className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
                <select
                  value={task.repeat}
                  onChange={handleRepeatChange}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">ללא חזרה</option>
                  <option value="daily">כל יום</option>
                  <option value="weekly">כל שבוע</option>
                  <option value="monthly">כל חודש</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* כפתור שליחה - מובייל */}
        <div className="md:hidden">
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {initialTask ? 'שמירת שינויים' : 'יצירת משימה'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm; 