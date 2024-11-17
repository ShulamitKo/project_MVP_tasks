import React from 'react';
import { Calendar, Clock, Target } from 'lucide-react';
import StatsCard from './analytics/StatsCard';
import PriorityChart from './analytics/PriorityChart';
import CategoryDistribution from './analytics/CategoryDistribution';
import { Task } from '../types/task';
import {Category } from '../types/category';

interface AnalyticsDashboardProps {
  tasks: Task[];
  categories: Category[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks, categories }) => {
  const stats = [
    {
      title: 'משימות להיום',
      value: 8,
      icon: Calendar,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'משימות בתהליך',
      value: 12,
      icon: Clock,
      iconColor: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'הושלמו השבוע',
      value: 15,
      icon: Target,
      iconColor: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">סטטיסטיקות</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryDistribution tasks={tasks} categories={categories} />
        <PriorityChart tasks={tasks} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;