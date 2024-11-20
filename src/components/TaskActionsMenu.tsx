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
  setNotification
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
        className="task-actions-menu bg-white rounded-lg shadow-lg border border-gray-100 z-[9999] w-64"
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
            className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            כן, מחק
          </button>
          <button 
            onClick={(e) => handleClick(e, () => setShowDeleteConfirm(false))}
            className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            ביטול
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="task-actions-menu bg-white rounded-lg shadow-lg border border-gray-100 z-[9999] w-48"
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={(e) => handleClick(e, () => {
          onEdit();
          onClose();
        })}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Edit className="w-4 h-4 text-gray-500" />
        <span>עריכה</span>
      </button>

      <button 
        onClick={(e) => handleClick(e, () => {
          onDuplicate(task);
          onClose();
          setNotification({
            message: 'המשימה שוכפלה בהצלחה',
            type: 'success'
          });
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        })}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-gray-50"
      >
        <Copy className="w-4 h-4 text-gray-500" />
        <span>שכפול משימה</span>
      </button>

      <div className="border-t border-gray-100 my-1"></div>
      
      <button 
        onClick={(e) => handleClick(e, () => setShowDeleteConfirm(true))}
        className="w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-red-50 text-red-600"
      >
        <Trash2 className="w-4 h-4" />
        <span>מחיקת משימה</span>
      </button>
    </div>
  );
}

export default TaskActionsMenu; 