import React, { useState } from 'react';
import { 
  CheckCircle,
  Clock,
  Star,
  MoreHorizontal,
  MapPin
} from 'lucide-react';
import { Task } from '../types/task';
import TaskActionsMenu from './TaskActionsMenu';

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleComplete = () => {
    onTaskUpdate({ ...task, isCompleted: !task.isCompleted });
  };

  const handleToggleFavorite = () => {
    onTaskUpdate({ ...task, isFavorite: !task.isFavorite });
  };

  const handleDuplicate = (task: Task) => {
    const newTask = {
      ...task,
      id: undefined,
      title: `העתק של ${task.title}`,
      isCompleted: false
    };
    onTaskUpdate(newTask);
  };

  return (
    <div className={`bg-white p-4 rounded-lg ${
      task.priority === 'high' ? 'border-2 border-red-200' : ''
    } ${task.isCompleted ? 'bg-gray-50' : ''} shadow-sm hover:shadow transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleComplete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CheckCircle className={`w-6 h-6 ${
              task.isCompleted 
                ? 'text-green-500 fill-green-500' 
                : 'text-gray-400'
            }`} />
          </button>
          <div>
            <h3 className={`font-semibold text-lg ${
              task.isCompleted ? 'line-through text-gray-500' : ''
            }`}>{task.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4" />
              <span>{task.dueTime}</span>
              {task.location && (
                <>
                  <span className="text-gray-300">|</span>
                  <MapPin className="w-4 h-4" />
                  <span>{task.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {task.isFavorite && (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          )}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <TaskActionsMenu
                task={task}
                onClose={() => setShowMenu(false)}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onToggleFavorite={handleToggleFavorite}
                onDuplicate={handleDuplicate}
                onChangeDate={(taskId) => {
                  // TODO: Implement date change
                  console.log('Change date for task:', taskId);
                }}
                onPostpone={(taskId) => {
                  // TODO: Implement postpone
                  console.log('Postpone task:', taskId);
                }}
                onChangeCategory={(taskId) => {
                  // TODO: Implement category change
                  console.log('Change category for task:', taskId);
                }}
                onChangePriority={(taskId) => {
                  // TODO: Implement priority change
                  console.log('Change priority for task:', taskId);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {task.category}
        </span>
        {task.priority === 'high' && (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
            דחוף
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem; 