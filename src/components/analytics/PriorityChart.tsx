import React from 'react';

interface PriorityItem {
  name: string;
  value: number;
  color: string;
}

const PriorityChart: React.FC = () => {
  const priorities: PriorityItem[] = [
    { name: 'גבוהה', value: 4, color: '#EF4444' },
    { name: 'בינונית', value: 6, color: '#F59E0B' },
    { name: 'נמוכה', value: 2, color: '#10B981' }
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