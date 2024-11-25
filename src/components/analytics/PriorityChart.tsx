import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { Task } from '../../types/task';
import ExportButton from './ExportButton';
import { Category } from '../../types/category';

interface PriorityChartProps {
  tasks: Task[];
  categories: Category[];
  startDate: Date;
  endDate: Date;
}

const PriorityChart: React.FC<PriorityChartProps> = ({
  tasks,
  categories,
  startDate,
  endDate
}) => {
  // הכנת הנתונים לגרף - סידור לפי סדר העדיפויות מגבוה לנמוך
  const priorityData = [
    { id: 'high', name: 'גבוהה', color: '#EF4444' },    // אדום לגבוהה
    { id: 'medium', name: 'בינונית', color: '#F59E0B' }, // כתום לבינונית
    { id: 'low', name: 'נמוכה', color: '#10B981' }      // ירוק לנמוכה
  ].map(priority => {
    const priorityTasks = tasks.filter(task => task.priority === priority.id);
    return {
      id: priority.id,
      name: priority.name,
      total: priorityTasks.length,
      completed: priorityTasks.filter(task => task.isCompleted).length,
      pending: priorityTasks.filter(task => !task.isCompleted).length,
      color: priority.color
    };
  });

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
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
              <span className="font-medium text-red-600">{data.pending}</span>
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
  const CustomLegend = () => {
    return (
      <div className="flex justify-center gap-6 text-sm mt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-current opacity-100" />
            <span className="text-gray-700">הושלמו</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-current opacity-30" />
            <span className="text-gray-700">ממתינות</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">פילוח לפי עדיפות</h3>
        <ExportButton 
          type="priority"
          tasks={tasks}
          categories={categories}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={priorityData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="completed"
              name="הושלמו"
              stackId="a"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_: any, index: number) => {
                const bars = document.querySelectorAll(`[name="group-${index}"]`);
                bars.forEach(bar => {
                  (bar as HTMLElement).style.transform = 'scaleY(1.2)';
                  (bar as HTMLElement).style.transformOrigin = 'bottom';
                  (bar as HTMLElement).style.transition = 'transform 0.3s ease';
                  (bar as HTMLElement).style.cursor = 'pointer';
                });
              }}
              onMouseLeave={(_: any, index: number) => {
                const bars = document.querySelectorAll(`[name="group-${index}"]`);
                bars.forEach(bar => {
                  (bar as HTMLElement).style.transform = 'scaleY(1)';
                });
              }}
            >
              {priorityData.map((entry, index) => (
                <Cell 
                  key={`cell-completed-${index}`} 
                  fill={entry.color}
                  name={`group-${index}`}
                  className="cursor-pointer"
                />
              ))}
            </Bar>
            <Bar
              dataKey="pending"
              name="ממתינות"
              stackId="a"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_: any, index: number) => {
                const bars = document.querySelectorAll(`[name="group-${index}"]`);
                bars.forEach(bar => {
                  (bar as HTMLElement).style.transform = 'scaleY(1.2)';
                  (bar as HTMLElement).style.transformOrigin = 'bottom';
                  (bar as HTMLElement).style.transition = 'transform 0.3s ease';
                  (bar as HTMLElement).style.cursor = 'pointer';
                });
              }}
              onMouseLeave={(_: any, index: number) => {
                const bars = document.querySelectorAll(`[name="group-${index}"]`);
                bars.forEach(bar => {
                  (bar as HTMLElement).style.transform = 'scaleY(1)';
                });
              }}
            >
              {priorityData.map((entry, index) => (
                <Cell 
                  key={`cell-pending-${index}`} 
                  fill={entry.color} 
                  fillOpacity={0.3}
                  name={`group-${index}`}
                  className="cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityChart;