import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
}

const CategoryDistribution: React.FC = () => {
  const categoryData: CategoryData[] = [
    { name: 'עבודה', value: 6 },
    { name: 'אישי', value: 4 },
    { name: 'משפחה', value: 2 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

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
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistribution;