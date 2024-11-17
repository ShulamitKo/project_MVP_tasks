import React from 'react';
import { 
  Edit, 
  Trash2, 
  Clock, 
  Copy, 
  Calendar,
  Star,
  AlertCircle,
  Tag
} from 'lucide-react';
import { Task } from '../types/task';

interface TaskActionsMenuProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleFavorite: (taskId: number) => void;
  onDuplicate: (task: Task) => void;
  onChangeDate: (taskId: number) => void;
  onPostpone: (taskId: number) => void;
  onChangeCategory: (taskId: number) => void;
  onChangePriority: (taskId: number) => void;
}

const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDuplicate,
  onChangeDate,
  onPostpone,
  onChangeCategory,
  onChangePriority
}) => {
  return (
    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
      {/* Edit Actions */}
      <button 
        onClick={() => {
          onEdit(task);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Edit className="w-4 h-4 text-gray-500" />
        <span>עריכת משימה</span>
      </button>
      
      <button 
        onClick={() => {
          onToggleFavorite(task.id!);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Star className={`w-4 h-4 ${task.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} />
        <span>{task.isFavorite ? 'הסר מחשובים' : 'סמן כחשוב'}</span>
      </button>

      {/* Schedule Actions */}
      <div className="border-t border-gray-100 my-1"></div>
      
      <button 
        onClick={() => {
          onChangeDate(task.id!);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>שינוי תאריך</span>
      </button>
      
      <button 
        onClick={() => {
          onPostpone(task.id!);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Clock className="w-4 h-4 text-gray-500" />
        <span>דחיית משימה</span>
      </button>

      {/* Category Actions */}
      <div className="border-t border-gray-100 my-1"></div>
      
      <button 
        onClick={() => {
          onChangeCategory(task.id!);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Tag className="w-4 h-4 text-gray-500" />
        <span>שינוי קטגוריה</span>
      </button>
      
      <button 
        onClick={() => {
          onChangePriority(task.id!);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <AlertCircle className="w-4 h-4 text-gray-500" />
        <span>שינוי עדיפות</span>
      </button>

      {/* Additional Actions */}
      <div className="border-t border-gray-100 my-1"></div>
      
      <button 
        onClick={() => {
          onDuplicate(task);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Copy className="w-4 h-4 text-gray-500" />
        <span>שכפול משימה</span>
      </button>

      {/* Danger Zone */}
      <div className="border-t border-gray-100 my-1"></div>
      
      <button 
        onClick={() => {
          onDelete(task.id!);
          onClose();
        }}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-red-50 text-red-600"
      >
        <Trash2 className="w-4 h-4" />
        <span>מחיקת משימה</span>
      </button>
    </div>
  );
};

export default TaskActionsMenu; 