import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Bell,
  Repeat,
  ChevronDown
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
  initialDate?: Date | null;
  categories: Category[];
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose, onSubmit, initialTask, initialDate, categories }) => {
  const [task, setTask] = useState<Task>(() => {
    if (initialTask) {
      return initialTask;
    }

    const defaultDate = initialDate || new Date();
    const formattedDate = defaultDate.toISOString().split('T')[0];
    const formattedTime = defaultDate.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return {
      title: '',
      description: '',
      dueDate: formattedDate,
      dueTime: formattedTime,
      category: '' as TaskCategory,
      priority: '' as TaskPriority,
      location: '',
      reminder: '30',
      repeat: 'none',
      isCompleted: false,
      isFavorite: false
    };
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    priority?: string;
  }>({});

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateForm = () => {
    if (!task.title.trim()) {
      setNotification({
        message: 'נא להזין כותרת למשימה',
        type: 'error'
      });
      return false;
    }
    
    if (!task.category) {
      setNotification({
        message: 'נא לבחור קטגוריה למשימה',
        type: 'error'
      });
      return false;
    }
    
    if (!task.priority) {
      setNotification({
        message: 'נא לבחור עדיפות למשימה',
        type: 'error'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative animate-modal-slide-in overflow-hidden">
        {/* Header */}
        <header className="bg-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="סגור טופס"
              >
                <ChevronRight className="w-6 h-6 text-gray-500" />
              </button>
              <h1 className="text-xl font-bold">
                {initialTask ? 'עריכת משימה' : 'משימה חדשה'}
              </h1>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors hidden md:block"
            >
              {initialTask ? 'שמירת שינויים' : 'יצירת משימה'}
            </button>
          </div>
        </header>

        {/* Form Content */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* כותרת ותיאור */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  כותרת המשימה
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => {
                    setTask({...task, title: e.target.value});
                    if (errors.title) {
                      setErrors(prev => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="הכנס כותרת למשימה"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
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
                <label className="block font-medium mb-1 text-gray-700">
                  קטגוריה
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <select
                  value={task.category}
                  onChange={(e) => {
                    handleCategoryChange(e);
                    if (errors.category) {
                      setErrors(prev => ({ ...prev, category: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">בחר קטגוריה</option>
                  {categories
                    .filter(cat => cat.id !== 'all')
                    .map(category => (
                      <option key={category.id} value={category.id as TaskCategory}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  עדיפות
                  <span className="text-red-500 mr-1">*</span>
                </label>
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
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-500">{errors.priority}</p>
                )}
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
              className="w-full px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              <span>{showAdvanced ? 'הסתר' : 'הצג'} הגדרות נוספות</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
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
          </form>
        </div>

        {/* Footer - Mobile */}
        <div className="md:hidden p-4 border-t bg-white">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {initialTask ? 'שמירת שינויים' : 'יצירת משימה'}
          </button>
        </div>

        {/* הודעת שגיאה */}
        {notification && (
          <div className={`fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 
            px-4 py-2 rounded-lg shadow-lg z-[100] flex items-center gap-2
            ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            <div className="w-2 h-2 rounded-full bg-white"></div>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTaskForm; 