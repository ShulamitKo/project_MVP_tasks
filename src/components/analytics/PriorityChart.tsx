import React from 'react';
import { Task } from '../../types/task';

interface PriorityChartProps {
  tasks: Task[];
}

const PriorityChart: React.FC<PriorityChartProps> = ({ tasks }) => {
  const priorities = [
    { name: 'גבוהה', value: tasks.filter(t => t.priority === 'high').length, color: '#EF4444' },
    { name: 'בינונית', value: tasks.filter(t => t.priority === 'medium').length, color: '#F59E0B' },
    { name: 'נמוכה', value: tasks.filter(t => t.priority === 'low').length, color: '#10B981' }
  ];

  const total = priorities.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-6">פילוח לפי עדיפות</h2>
      <div className="space-y-4">
        {priorities.map((priority) => (
          <div key={priority.name} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">{priority.name}</span>
              <span className="text-sm font-medium text-gray-600">{priority.value} משימות</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(priority.value / total) * 100}%`,
                  backgroundColor: priority.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityChart;