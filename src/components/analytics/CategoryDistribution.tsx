import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Task } from '../../types/task';
import { Category } from '../../types/category';
import ExportButton from './ExportButton';

interface CategoryDistributionProps {
  tasks: Task[];
  categories: Category[];
  activeCategory: string;
  startDate: Date;
  endDate: Date;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({
  tasks,
  categories,
  activeCategory,
  startDate,
  endDate
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // הכנת הנתונים לגרף
  const categoryData = categories
    .filter(cat => cat.id !== 'all')
    .map(category => {
      const categoryTasks = tasks.filter(task => task.category === category.id);
      return {
        id: category.id,
        name: category.name,
        total: categoryTasks.length,
        completed: categoryTasks.filter(task => task.isCompleted).length,
        color: category.color,
        isActive: category.id === activeCategory
      };
    })
    .filter(category => category.total > 0); // מסנן קטגוריות ריקות

  // צבעים לגרף
  const COLORS: Record<string, string> = {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899',
    indigo: '#6366F1',
    teal: '#14B8A6',
    orange: '#F97316',
    cyan: '#06B6D4'
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const completionRate = Math.round((data.completed / data.total) * 100);
      
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[data.color] }}
            />
            <p className="font-semibold text-gray-900">{data.name}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">סה"כ משימות:</span>
              <span className="font-medium text-gray-900">{data.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">הושלמו:</span>
              <span className="font-medium text-green-600">{data.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ממתינות:</span>
              <span className="font-medium text-red-600">{data.total - data.completed}</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">אחוז השלמה:</span>
                <span className="font-medium text-gray-900">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 text-sm mt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              entry.payload.isActive ? 'bg-gray-50' : ''
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">התפלגות לפי קטגוריות</h3>
        <ExportButton 
          type="categories"
          tasks={tasks}
          categories={categories}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      
      <div className="h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.color]}
                  opacity={activeCategory !== 'all' && !entry.isActive ? 0.3 : 1}
                  stroke={entry.isActive ? '#3B82F6' : 'white'}
                  strokeWidth={entry.isActive ? 2 : 1}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  style={{
                    transformOrigin: 'center',
                    transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              position={window.innerWidth <= 768 ? 
                { x: window.innerWidth / 2, y: 20 } : 
                { x: 350, y: 50 }
              }
              wrapperStyle={{
                maxWidth: "320px",
                zIndex: 10,
                ...(window.innerWidth <= 768 ? {
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "0"
                } : {})
              }}
              isAnimationActive={false}
              cursor={false}
            />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistribution;