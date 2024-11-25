import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2, PieChart } from 'lucide-react';
import TimeRangeSelector from './analytics/TimeRangeSelector';
import StatsCard from './analytics/StatsCard';
import PriorityChart from './analytics/PriorityChart';
import CategoryDistribution from './analytics/CategoryDistribution';
import { Task } from '../types/task';
import { Category } from '../types/category';
import { AnimatePresence, motion } from 'framer-motion';
import ExportButton from './analytics/ExportButton';

interface AnalyticsDashboardProps {
  tasks: Task[];
  categories: Category[];
  activeCategory: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tasks,
  categories,
  activeCategory
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [currentDate, setCurrentDate] = useState(new Date());

  // חישוב תאריכי התחלה וסיום
  const { startDate, endDate } = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (timeRange === 'today') {
      // רק היום הנוכחי
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (timeRange === 'week') {
      // התחלת השבוע (יום ראשון)
      start.setDate(currentDate.getDate() - currentDate.getDay());
      // סוף השבוע (שבת)
      end.setDate(start.getDate() + 6);
    } else {
      // התחלת החודש
      start.setDate(1);
      // סוף החודש
      end.setMonth(currentDate.getMonth() + 1, 0);
    }

    return { startDate: start, endDate: end };
  }, [currentDate, timeRange]);

  // חישוב סטטיסטיקות
  const stats = useMemo(() => {
    const dateInRange = (date: string, start: Date, end: Date) => {
      const taskDate = new Date(date);
      return taskDate >= start && taskDate <= end;
    };

    // התקופה הנוכחית
    const tasksInRange = tasks.filter(task => dateInRange(task.dueDate, startDate, endDate));
    const completedTasks = tasksInRange.filter(task => task.isCompleted);
    const currentCompletionRate = tasksInRange.length > 0
      ? (completedTasks.length / tasksInRange.length) * 100
      : 0;

    // התקופה הקודמת
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(endDate);
    if (timeRange === 'today') {
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
    } else if (timeRange === 'week') {
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      previousEndDate.setDate(previousEndDate.getDate() - 7);
    } else {
      previousStartDate.setMonth(previousStartDate.getMonth() - 1);
      previousEndDate.setMonth(previousEndDate.getMonth() - 1);
    }

    const previousTasksInRange = tasks.filter(task => 
      dateInRange(task.dueDate, previousStartDate, previousEndDate)
    );
    const previousCompletedTasks = previousTasksInRange.filter(task => task.isCompleted);
    const previousCompletionRate = previousTasksInRange.length > 0
      ? (previousCompletedTasks.length / previousTasksInRange.length) * 100
      : 0;

    // חישוב המגמה - השוואה בין אחוזי ההשלמה
    const completionTrend = previousCompletionRate > 0
      ? currentCompletionRate - previousCompletionRate
      : 0;

    return {
      completed: completedTasks.length,
      pending: tasksInRange.length - completedTasks.length,
      completionRate: currentCompletionRate,
      trend: {
        value: Math.abs(Math.round(completionTrend)),
        isPositive: completionTrend >= 0
      }
    };
  }, [tasks, startDate, endDate, timeRange]);

  // ניווט בי תקופות
  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (timeRange === 'today') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (timeRange === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleResetToToday = () => {
    setCurrentDate(new Date());
    setTimeRange('today');
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 p-4 md:p-6">
      {/* כותרת */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">סטטיסטיקות</h1>
        <ExportButton 
          type="all"
          tasks={tasks}
          categories={categories}
          startDate={startDate}
          endDate={endDate}
          variant="full"
        />
      </header>

      {/* בורר טווח זמן */}
      <TimeRangeSelector
        selectedRange={timeRange}
        startDate={startDate}
        endDate={endDate}
        onRangeChange={setTimeRange}
        onNavigate={handleNavigate}
        onResetToToday={handleResetToToday}
      />

      {/* כרטיסי סטטיסטיקות עם אנימציה */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={timeRange + currentDate.toString()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-2 md:gap-6 mb-6"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <StatsCard
              title="הושלמו בתקופה"
              value={stats.completed}
              icon={CheckCircle2}
              iconColor="bg-green-100 text-green-600"
              tasks={tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate >= startDate && taskDate <= endDate && task.isCompleted;
              })}
              type="completed"
            />
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <StatsCard
              title="משימות שנותרו"
              value={stats.pending}
              icon={AlertCircle}
              iconColor="bg-red-100 text-red-600"
              secondaryValue={`${tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate >= startDate && 
                       taskDate <= endDate && 
                       !task.isCompleted && 
                       task.priority === 'high';  // מסנן רק משימות בעדיפות גבוהה
              }).length} משימות דחופות`}
              tasks={tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate >= startDate && taskDate <= endDate && !task.isCompleted;
              })}
              type="pending"
            />
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <StatsCard
              title="אחוז השלמה"
              value={`${Math.round(stats.completionRate)}%`}
              icon={PieChart}
              iconColor="bg-blue-100 text-blue-600"
              showProgress
              progress={stats.completionRate}
              trend={stats.trend}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* גרפים עם אנימציה */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={timeRange + currentDate.toString()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CategoryDistribution
              tasks={tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate >= startDate && taskDate <= endDate;
              })}
              categories={categories}
              activeCategory={activeCategory}
              startDate={startDate}
              endDate={endDate}
            />
          </motion.div>
          <motion.div 
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PriorityChart
              tasks={tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate >= startDate && taskDate <= endDate;
              })}
              categories={categories}
              startDate={startDate}
              endDate={endDate}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsDashboard;