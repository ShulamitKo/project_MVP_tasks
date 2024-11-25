import React, { useState } from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';
import { Task } from '../../types/task';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  secondaryValue?: string;
  showProgress?: boolean;
  progress?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  tasks?: Task[];
  type?: 'completed' | 'pending';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  secondaryValue,
  showProgress,
  progress = 0,
  trend,
  tasks = [],
  type
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const renderTooltipContent = () => {
    if (!tasks.length || !type) return null;

    const sortedTasks = [...tasks]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    return (
      <div className="absolute z-50 top-[calc(100%+8px)] right-0 w-72 bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900 mb-2">
          {type === 'completed' ? 'משימות שהושלמו:' : 'משימות ממתינות:'}
        </p>
        <div className="space-y-2">
          {sortedTasks.map(task => (
            <div key={task.id} className="text-sm">
              <div className="flex items-start gap-2">
                {type === 'pending' && task.priority === 'high' && (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-gray-700 font-medium line-clamp-1">{task.title}</span>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {new Date(task.dueDate).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tasks.length > 5 && (
            <p className="text-xs text-gray-500 mt-2 text-center border-t border-gray-100 pt-2">
              + עוד {tasks.length - 5} משימות נוספות
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="bg-white p-3 md:p-6 rounded-xl shadow-sm relative overflow-visible group hover:shadow-md transition-shadow"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className={`${iconColor} p-2 md:p-3 rounded-xl transition-transform group-hover:scale-110`}>
          <Icon className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs md:text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-0.5 md:space-y-1">
        <p className="text-xs md:text-sm font-medium text-gray-500">{title}</p>
        <p className="text-lg md:text-2xl font-bold text-gray-800">{value}</p>
        {secondaryValue && (
          <p className="text-xs md:text-sm text-gray-500">{secondaryValue}</p>
        )}
      </div>

      {showProgress && (
        <div className="mt-2 md:mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] md:text-xs text-gray-500">התקדמות</span>
            <span className="text-[10px] md:text-xs font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
            <div
              className="bg-blue-500 h-1.5 md:h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {showTooltip && renderTooltipContent()}
    </div>
  );
};

export default StatsCard;