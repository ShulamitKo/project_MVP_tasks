import React from 'react';
import { 
  Edit, 
  Trash2, 
  Copy,
  AlertCircle
} from 'lucide-react';
import { Task } from '../types/task';

interface TaskActionsMenuProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onDuplicate: (task: Task) => void;
  setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>;
}

const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.task-actions-menu')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  if (showDeleteConfirm) {
    return (
      <div 
        className="actions-menu absolute left-0 mt-1 w-64 rounded-lg shadow-lg overflow-hidden z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">אישור מחיקה</span>
          </div>
          <p className="text-sm text-gray-600">
            האם אתה בטוח שברצונך למחוק את המשימה "{task.title}"?
          </p>
        </div>
        
        <div className="p-3 flex gap-2">
          <button 
            onClick={(e) => handleClick(e, () => {
              onDelete(task.id!);
              onClose();
            })}
            className="action-item danger flex-1 px-3 py-1.5 text-sm"
          >
            כן, מחק
          </button>
          <button 
            onClick={(e) => handleClick(e, () => setShowDeleteConfirm(false))}
            className="action-item flex-1 px-3 py-1.5 text-sm"
          >
            ביטול
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="actions-menu absolute left-0 mt-1 w-48 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="py-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="action-item w-full text-right px-4 py-2"
        >
          <span className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            עריכה
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(task);
          }}
          className="action-item w-full text-right px-4 py-2"
        >
          <span className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            שכפול
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="action-item danger w-full text-right px-4 py-2"
        >
          <span className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            מחיקה
          </span>
        </button>
      </div>
    </div>
  );
}

export default TaskActionsMenu; 