import React from 'react';
import { X, Calendar, Clock, MapPin, Users, AlertCircle, Bell, Edit, Star, Copy, Trash2 } from 'lucide-react';

interface TaskDetailsModalProps {
  taskId: number;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ taskId, onClose }) => {
  // Mock task data - will be replaced with real data later
  const task = {
    id: taskId,
    title: 'פגישת צוות',
    time: '10:00',
    endTime: '11:30',
    category: 'עבודה',
    location: 'חדר ישיבות',
    priority: 'high',
    description: 'פגישה שבועית לסקירת התקדמות הפרויקט ותכנון משימות להמשך השבוע.',
    participants: ['יעל', 'משה', 'דנה', 'רון'],
    reminder: '15'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{task.title}</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {task.category}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>יום רביעי, 15 במאי</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{task.time} - {task.endTime}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{task.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{task.participants?.length} משתתפים</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-5 h-5" />
              <span>עדיפות גבוהה</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Bell className="w-5 h-5" />
              <span>תזכורת {task.reminder} דקות לפני</span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">{task.description}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200">
              <Edit className="w-4 h-4" />
              עריכה
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200">
              <Star className="w-4 h-4" />
              סימון כחשוב
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200">
              <Copy className="w-4 h-4" />
              שכפול
            </button>
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 hover:bg-red-100">
              <Trash2 className="w-4 h-4" />
              מחיקה
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              סגירה
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              שמירת שינויים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;