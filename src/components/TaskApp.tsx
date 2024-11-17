import React, { useState } from 'react';
import {
  Home,
  Calendar,
  BarChart2,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  Menu
} from 'lucide-react';
import NewCategoryModal from './categories/NewCategoryModal';
import { ColorType, Category, NewCategory } from '../types/category';

interface TaskAppProps {
  onNewTask: () => void;
  onViewChange: (view: string) => void;
  categories: Category[];
  onAddCategory: (category: NewCategory) => void;
}

const TaskApp: React.FC<TaskAppProps> = ({ onNewTask, onViewChange, categories, onAddCategory }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Navigation Items
  const navItems = [
    { id: 'tasks', icon: Home, label: 'ראשי' },
    { id: 'calendar', icon: Calendar, label: 'יומן' },
    { id: 'analytics', icon: BarChart2, label: 'סטטיסטיקות' },
    { id: 'settings', icon: Settings, label: 'הגדרות' }
  ];

  // Color Utilities
  const getColorClass = (color: ColorType) => {
    const colors: Record<ColorType, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
      orange: 'bg-orange-500',
      cyan: 'bg-cyan-500'
    };
    return colors[color] || colors.blue;
  };

  // עדכון הטיפוס בפונקציה
  const handleAddCategory = (newCategory: NewCategory) => {
    onAddCategory(newCategory);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white border-l md:flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Menu className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">תפריט</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? 
              <ChevronRight className="w-5 h-5 text-gray-500" /> :
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            }
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <item.icon className={`w-5 h-5 ${
                  isSidebarOpen ? 'ml-3' : 'mx-auto'
                }`} />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              {isSidebarOpen && <h2 className="font-semibold text-gray-600">קטגוריות</h2>}
              <button 
                onClick={() => setShowNewCategory(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Plus className={`w-4 h-4 text-gray-500 ${
                  isSidebarOpen ? '' : 'mx-auto'
                }`} />
              </button>
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full px-3 py-2 rounded-lg text-right flex items-center ${
                    activeCategory === category.id 
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${getColorClass(category.color)}`} />
                  {isSidebarOpen && (
                    <>
                      <span className="ml-3 text-gray-700">{category.name}</span>
                      <span className="ml-auto text-sm text-gray-400">{category.count}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Add Task Button */}
        <div className="p-4 border-t">
          <button
            onClick={onNewTask}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
              !isSidebarOpen && 'p-2'
            }`}
          >
            <Plus className="w-5 h-5" />
            {isSidebarOpen && <span>משימה חדשה</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6">
          {/* Task List will be implemented here */}
          <div className="text-center text-gray-500 mt-8">
            <p>בחר משימה או צור משימה חדשה</p>
          </div>
        </div>
      </main>

      {/* מודאל הוספת קטגוריה */}
      {showNewCategory && (
        <NewCategoryModal
          onClose={() => setShowNewCategory(false)}
          onSubmit={(category: NewCategory) => {
            handleAddCategory(category);
            setShowNewCategory(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskApp;