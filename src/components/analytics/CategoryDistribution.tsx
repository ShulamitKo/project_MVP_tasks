import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Task } from '../../types/task';
import { ColorType, Category } from '../../types/category';

interface CategoryDistributionProps {
  tasks: Task[];
  categories: Category[];
  activeCategory: string;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ 
  tasks, 
  categories,
  activeCategory 
}) => {
  // הכנת הנתונים לגרף
  const categoryData = categories
    .filter(cat => cat.id !== 'all')
    .map(category => ({
      name: category.name,
      value: tasks.filter(task => task.category === category.id).length,
      color: category.color,
      isActive: category.id === activeCategory
    }));

  // צבעים לגרף
  const COLORS: Record<ColorType, string> = {
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-6">התפלגות לפי קטגוריות</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              innerRadius={60}
              outerRadius={120}
              dataKey="value"
              nameKey="name"
              label={({name, value}) => `${name} (${value})`}
            >
              {categoryData.map((entry) => (
                <Cell 
                  key={`cell-${entry.name}`} 
                  fill={COLORS[entry.color]}
                  // הוספת אפקט הדגשה לקטגוריה הפעילה
                  opacity={activeCategory !== 'all' && !entry.isActive ? 0.3 : 1}
                  stroke={entry.isActive ? '#3B82F6' : 'none'}
                  strokeWidth={entry.isActive ? 3 : 0}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} משימות`, '']}
              labelFormatter={(label: string) => `קטגוריה: ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistribution;