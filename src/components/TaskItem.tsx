import React from 'react';
import { 
  CheckCircle,
  Clock,
  Star,
  MoreHorizontal,
  MapPin
} from 'lucide-react';
import { Task } from '../types/task';
import TaskActionsMenu from './TaskActionsMenu';
import { ColorType, Category } from '../types/category';
import { useData } from '../contexts/DataContext';

interface NotificationType {
  message: string;
  type: 'success' | 'error';
}

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (id: string) => void;
  onTaskClick: (id: string) => void;
  categories: Category[];
  isMenuOpen: boolean;
  onMenuToggle: (id: string | null) => void;
  setNotification: (notification: NotificationType | null) => void;
  createTask: (task: Omit<Task, 'id'>) => Promise<Task>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskDelete,
  onTaskEdit,
  onTaskClick,
  categories,
  isMenuOpen,
  onMenuToggle,
  setNotification,
  createTask
}) => {
  const { toggleTaskCompletion, toggleTaskFavorite } = useData();

  const handleToggleComplete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await toggleTaskCompletion(task.id);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  const handleToggleFavorite = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await toggleTaskFavorite(task.id);
    } catch (error) {
      console.error('Failed to toggle task favorite:', error);
    }
  };

  const handleDuplicate = async (task: Task) => {
    const { id: _, ...taskWithoutId } = task;
    const newTask = {
      ...taskWithoutId,
      title: `העתק של ${task.title}`,
      isCompleted: false,
      isFavorite: false
    };
    
    try {
      await createTask(newTask);
      setNotification({
        message: 'המשימה שוכפלה בהצלחה',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'שגיאה בשכפול המשימה',
        type: 'error'
      });
    }
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getCategory = () => {
    return categories.find(cat => cat.id === task.category);
  };

  const getCategoryColorClass = () => {
    const category = getCategory();
    if (!category) return '';
    
    const colors: Record<ColorType, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
      green: { bg: 'bg-green-100', text: 'text-green-800' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      red: { bg: 'bg-red-100', text: 'text-red-800' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-800' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800' }
    };
    
    return `${colors[category.color].bg} ${colors[category.color].text}`;
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={() => onTaskClick(task.id!)}
      className={`bg-white p-4 rounded-2xl shadow-sm border transition-all duration-200 relative
        ${task.isCompleted 
          ? 'border-green-100 bg-green-50/30' 
          : 'border-gray-100 hover:border-blue-200'
        } 
        hover:shadow-md cursor-pointer`}
    >
      {!task.isCompleted && (
        <div className={`absolute right-0 top-0 bottom-0 w-1 rounded-tr-2xl rounded-br-2xl
          ${task.priority === 'high' 
            ? 'bg-red-500' 
            : task.priority === 'medium'
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
        />
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={(e) => {
              handleActionClick(e);
              handleToggleComplete(e);
            }}
            className={`p-2 rounded-full transition-colors
              ${task.isCompleted 
                ? 'bg-green-100 hover:bg-green-200' 
                : 'hover:bg-gray-100'
              }`}
          >
            <CheckCircle className={`w-6 h-6 ${
              task.isCompleted 
                ? 'text-green-500 fill-green-500' 
                : 'text-gray-400'
            }`} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-lg truncate ${
                task.isCompleted ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              {task.priority === 'high' && !task.isCompleted && (
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full animate-pulse">
                  דחוף
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>{task.dueTime}</span>
              </div>
              {task.location && (
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{task.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              handleActionClick(e);
              handleToggleFavorite(e);
            }}
            className={`p-2 rounded-full transition-colors
              ${task.isFavorite 
                ? 'bg-yellow-100 hover:bg-yellow-200' 
                : 'hover:bg-gray-100'
              }`}
          >
            <Star className={`w-5 h-5 ${
              task.isFavorite 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-400 hover:text-yellow-500'
            }`} />
          </button>
          <div className="relative">
            <button 
              onClick={(e) => {
                handleActionClick(e);
                onMenuToggle(isMenuOpen ? null : task.id!);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute top-0 right-full mr-[-120px] z-[9999]">
                <TaskActionsMenu 
                  task={task}
                  onClose={() => onMenuToggle(null)}
                  onEdit={() => onTaskEdit(task.id!)}
                  onDelete={onTaskDelete}
                  onDuplicate={handleDuplicate}
                  setNotification={setNotification}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {getCategory() && (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColorClass()}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getCategory()?.color.startsWith('bg-') ? getCategory()?.color : `bg-${getCategory()?.color}-500`} mr-2`}></span>
            {getCategory()?.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem; 