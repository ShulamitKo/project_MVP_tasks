import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Bell,
  Repeat,
  ChevronDown,
  Check
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory, TaskRepeat, NewTask } from '../types/task';


interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface NewTaskFormProps {
  onClose: () => void;
  onSubmit: (task: NewTask) => Promise<void>;
  initialTask?: Task;
  initialDate?: Date | null;
  categories: Category[];
}

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mt-1.5 flex items-center gap-1.5 text-sm">
    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
    <p className="font-medium text-red-600 dark:text-red-500">
      {message}
    </p>
  </div>
);

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose, onSubmit, initialTask, initialDate, categories }) => {
  const [task, setTask] = useState<NewTask>(() => {
    if (initialTask) {
      const { id, ...taskWithoutId } = initialTask;
      return taskWithoutId;
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
      category: '',
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
        type: 'error',
        message: 'נא להזין כותרת למשימה'
      });
      return false;
    }
    
    if (!task.category) {
      setNotification({
        type: 'error',
        message: 'נא לבחור קטגוריה למשימה'
      });
      return false;
    }
    
    if (!task.priority) {
      setNotification({
        type: 'error',
        message: 'נא לבחור עדיפות למשימה'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(task);
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'שגיאה ביצירת המשימה'
      });
    }
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700/50"
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
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
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
                    ${errors.title ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                />
                {errors.title && <ErrorMessage message={errors.title} />}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">תיאור</label>
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
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">תאריך</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 dark:text-gray-300" />
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => setTask({...task, dueDate: e.target.value})}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">שעה</label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 dark:text-gray-300" />
                  <input
                    type="time"
                    value={task.dueTime}
                    onChange={(e) => setTask({...task, dueTime: e.target.value})}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* קטגוריה ועדיפות */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                  קטגוריה
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <select
                  value={task.category}
                  onChange={(e) => {
                    setTask({ ...task, category: e.target.value as TaskCategory });
                    if (errors.category) {
                      setErrors(prev => ({ ...prev, category: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700
                    ${errors.category ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}
                >
                  <option value="">בחר קטגוריה</option>
                  {categories
                    .filter(cat => cat.id !== 'all')
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
                {errors.category && <ErrorMessage message={errors.category} />}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                  עדיפות
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTask({...task, priority: 'high'})}
                    className={`py-2 rounded-lg flex items-center justify-center gap-2 ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-700 border-2 border-red-700 relative'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {task.priority === 'high' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-700 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    גבוהה
                  </button>
                  <button
                    type="button"
                    onClick={() => setTask({...task, priority: 'medium'})}
                    className={`py-2 rounded-lg flex items-center justify-center gap-2 ${
                      task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-700 relative'
                        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                    }`}
                  >
                    {task.priority === 'medium' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-700 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    בינונית
                  </button>
                  <button
                    type="button"
                    onClick={() => setTask({...task, priority: 'low'})}
                    className={`py-2 rounded-lg flex items-center justify-center gap-2 ${
                      task.priority === 'low'
                        ? 'bg-green-100 text-green-700 border-2 border-green-700 relative'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {task.priority === 'low' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-700 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    נמוכה
                  </button>
                </div>
                {errors.priority && <ErrorMessage message={errors.priority} />}
              </div>
            </div>

            {/* מיקום */}
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">מיקום</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 dark:text-gray-300" />
                <input
                  type="text"
                  value={task.location}
                  onChange={(e) => setTask({...task, location: e.target.value})}
                  placeholder="הכנס מיקום (אוציונלי)"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* כפתור הגדרות נוספות */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span>{showAdvanced ? 'הסתר' : 'הצג'} הגדרות נוספות</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {/* הגדרות נוספות */}
            {showAdvanced && (
              <div className="space-y-4 bg-gray-100 p-4 rounded-lg dark:bg-gray-800">
                {/* תזכורת */}
                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">תזכורת</label>
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 dark:text-gray-300" />
                    <select
                      value={task.reminder}
                      onChange={(e) => setTask({...task, reminder: e.target.value})}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
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
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">חזרה</label>
                  <div className="relative">
                    <Repeat className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 dark:text-gray-300" />
                    <select
                      value={task.repeat}
                      onChange={handleRepeatChange}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
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

        {/* הודעת שגיאה/הצלחה */}
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