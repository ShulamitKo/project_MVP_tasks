import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Task } from '../../types/task';

type ColorType = 'blue' | 'green' | 'yellow' | 'red';

interface Category {
  id: string;
  name: string;
  count: number;
  color: ColorType;
}

interface CategoryChartProps {
  tasks: Task[];
  categories: Category[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ tasks, categories }) => {
  // הכנת הנתונים לגרף
  const categoryData = categories
    .filter(cat => cat.id !== 'all')
    .map(category => ({
      name: category.name,
      value: tasks.filter(task => task.category === category.id).length,
      color: category.color
    }));

  // צבעים לגרף
  const COLORS: Record<ColorType, string> = {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444'
  };

  return (
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
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.color]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} משימות`, '']}
            labelFormatter={(label: string) => `קטגוריה: ${label}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart; 