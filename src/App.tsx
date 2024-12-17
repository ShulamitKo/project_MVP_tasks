import { useState, useEffect, useCallback } from 'react';
import {
  Home,
  Calendar,
  BarChart2,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Bell,
  Clock,
  Filter,
  X,
  MapPin,
  AlertCircle,
  Edit,
  Copy,
  Trash2,
  ListTodo,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import NewTaskForm from './components/NewTaskForm';
import CalendarView from './components/CalendarView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsScreen from './components/SettingsScreen';
import TaskItem from './components/TaskItem';
import { Task } from './types/task';
import NewCategoryModal from './components/categories/NewCategoryModal';
import { ColorType } from './types/category';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useData } from './contexts/DataContext';

// עדכון הממשק של הסינונים
interface FilterState {
  date: 'today' | 'week' | 'month' | 'all';
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
}

// הוספת טיפוסים חסרים
interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

function App() {
  const { user, signOut } = useAuth();
  const { 
    tasks, 
    categories, 
    createTask,
    updateTask,
    deleteTask,
    createCategory,
    showNotification,
    setCategories
  } = useData();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showNewTask, setShowNewTask] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // פריטי תפריט
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'ראשי' },
    { id: 'calendar', icon: Calendar, label: 'יומן' },
    { id: 'analytics', icon: BarChart2, label: 'סטטיסטיקות' },
    { id: 'settings', icon: SettingsIcon, label: 'הגדרות' }
  ];

  // פונציית עזר לצבעים
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
    return colors[color];
  };

  // פונקציות לטיפול במשימות
  const handleTaskUpdate = async (updatedTask: Task) => {
    if (updatedTask.id) {
      // עדכון משימה קיימת
      await updateTask(updatedTask.id, updatedTask);
    } else {
      // הוספת משימה חדשה
      await createTask(updatedTask);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleTaskEdit = (taskId: string) => {
    const taskToEdit = tasks.find(t => t.id === taskId);
    if (taskToEdit) {
      setSelectedTaskId(taskId);
      setShowNewTask(true);
      setShowTaskDetails(false);
    }
  };

  // העברת המשימות ל-CalendarView
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowTaskDetails(true);
  };

  // פונקציה לסינון המשימות
  const [filters, setFilters] = useState<FilterState>({
    date: 'today',
    status: 'all',
    priority: 'all'
  });

  // הוספת state לחיפוש
  const [searchQuery, setSearchQuery] = useState('');

  // פונקציה נפרדת לחיפוש
  const searchTasks = (tasks: Task[]) => {
    if (!searchQuery) return tasks;
    
    const searchLower = searchQuery.toLowerCase();
    return tasks.filter(task => {
      // קודם בודקים את הקטגוריה
      if (activeCategory !== 'all' && task.category !== activeCategory) {
        return false;
      }
      
      // אם עבנו את ביקת הקטגוריה, בודקי את החיפוש
      return task.title.toLowerCase().includes(searchLower) ||
             task.description.toLowerCase().includes(searchLower) ||
             task.location?.toLowerCase().includes(searchLower);
    });
  };

  // פונקציה נפרדת לסינון
  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      // סינון לפי קטגוריה
      if (activeCategory !== 'all' && task.category !== activeCategory) {
        return false;
      }

      // סינון לפי תאריך
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      switch (filters.date) {
        case 'today':
          if (taskDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'week':
          if (taskDate < weekStart || taskDate > new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) return false;
          break;
        case 'month':
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          if (taskDate < monthStart || taskDate > monthEnd) return false;
          break;
      }

      // סינון לפי סטטוס
      if (filters.status !== 'all') {
        if (filters.status === 'completed' && !task.isCompleted) return false;
        if (filters.status === 'pending' && task.isCompleted) return false;
      }

      // סינון לפי עדיפות
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  };

  // פונקציה מא שקודם מפשת ואז מסננת
  const getFilteredTasks = () => {
    if (searchQuery) {
      // אם יש חיפוש, קודם מחפשים בכל המשימות
      return searchTasks(tasks);
    } else {
      // אם אין חיפוש, מפעילים את הסינונים
      return filterTasks(tasks);
    }
  };

  // עדכון הרנדו של הדשבורד - החל הרלוונטי
  const renderDashboard = () => (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* שורה ראשונה - כותרת, חיפוש וכפתורים */}
          <div className="flex items-center justify-between py-3 border-b gap-3">
            {/* כותרת */}
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 flex-shrink-0">המשימות שלי</h1>
            
            {/* חיפוש */}
            <div className="flex-1 max-w-xl relative group">
              <div className="absolute inset-0 bg-blue-100/10 rounded-2xl -m-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              <Search className="w-5 h-5 text-gray-400 absolute right-4 top-3.5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש משימות..."
                className="w-full pr-12 pl-12 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-200 transition-all text-sm font-medium placeholder:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200 rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* כפתור מצב לילה */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-50 rounded-full relative flex-shrink-0 transition-colors dark:hover:bg-gray-700/50 dark:text-gray-300"
                title={isDarkMode ? "עבור למצב יום" : "עבור למצב לילה"}
                aria-label={isDarkMode ? "עבור למצב יום" : "עבור למצב לילה"}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* כפתור צף להוספת משימה */}
              <button 
                onClick={() => setShowNewTask(true)}
                className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl group flex-shrink-0 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <div className="relative p-2.5 md:px-5 md:py-2.5 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="hidden md:inline whitespace-nowrap">משימה חדשה</span>
                </div>
              </button>

              {/* התראות */}
              <button className="p-2 hover:bg-gray-50 rounded-full relative flex-shrink-0 transition-colors dark:hover:bg-gray-700/50 dark:text-gray-300">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* שורה שנייה - פילטרים */}
          <div className="py-3">
            {/* הודת סינון */}
            {(searchQuery || activeCategory !== 'all') && (
              <div className="mb-3 py-2 px-4 bg-blue-50 rounded-xl text-blue-600 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  {activeCategory !== 'all' && (
                    <span className="flex items-center gap-2 truncate">
                      <span className="truncate">קטגוריה: {categories.find(c => c.id === activeCategory)?.name}</span>
                      {searchQuery && <span className="text-gray-400 mx-1">|</span>}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="truncate">חיפוש: "{searchQuery}"</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (searchQuery) setSearchQuery('');
                    if (activeCategory !== 'all') setActiveCategory('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm flex-shrink-0 mr-2 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-lg px-2 py-1 dark:hover:bg-gray-700/50"
                >
                  נקה
                </button>
              </div>
            )}

            {/* סרל סינון - עיצוב משור */}
            {!searchQuery && (
              <>
                {/* כותרת הסינון - כל השורה לחיצה */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between py-2 text-gray-500 hover:text-gray-700 transition-colors md:hidden dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 rounded-lg px-2"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">סנון משימות</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm">
                    <span>{showFilters ? 'הסתר פילטרים' : 'הצג פילטרים'}</span>
                    {showFilters ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* כותרת קבועה בדסקטופ */}
                <div className="hidden md:flex items-center gap-2 text-gray-500 mb-3">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">סינון משימות</span>
                </div>

                {/* פילטרים - מוסתרים כברירת מחדל במובייל */}
                <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    {/* סינון לפי קטגוריה - חדש */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 md:hidden">
                      <div className="text-xs text-gray-500 font-medium mb-2 px-1 flex items-center gap-1.5">
                        <ListTodo className="w-3.5 h-3.5" />
                        <span>קטגוריה</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setActiveCategory(category.id);
                              if (window.innerWidth < 768) setShowFilters(false);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              activeCategory === category.id
                                ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${getColorClass(category.color)}`} />
                            <span>{category.name}</span>
                            <span className="text-xs opacity-75">({category.count})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* סינון לפי תאריך */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 font-medium mb-2 px-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>תאריך</span>
                      </div>
                      <div className="flex gap-1">
                        {[
                          { id: 'today', label: 'היום' },
                          { id: 'week', label: 'השבוע' },
                          { id: 'month', label: 'החודש' },
                          { id: 'all', label: 'הכל' }
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, date: option.id as any }));
                              if (window.innerWidth < 768) setShowFilters(false);
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              filters.date === option.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* סינון לפי סטטוס */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 font-medium mb-2 px-1 flex items-center gap-1.5">
                        <ListTodo className="w-3.5 h-3.5" />
                        <span>סטטוס</span>
                      </div>
                      <div className="flex gap-1">
                        {[
                          { id: 'all', label: 'הכל' },
                          { id: 'pending', label: 'בתהליך' },
                          { id: 'completed', label: 'הושלמו' }
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, status: option.id as any }));
                              if (window.innerWidth < 768) setShowFilters(false);
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              filters.status === option.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* סינון לפי עדיפות */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 font-medium mb-2 px-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>עדיפות</span>
                      </div>
                      <div className="flex gap-1">
                        {[
                          { id: 'all', label: 'הכל', color: 'blue' },
                          { id: 'high', label: 'גבוהה', color: 'red' },
                          { id: 'medium', label: 'בינונית', color: 'yellow' },
                          { id: 'low', label: 'נמוכה', color: 'green' }
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, priority: option.id as any }));
                              if (window.innerWidth < 768) setShowFilters(false);
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                              filters.priority === option.id
                                ? `bg-${option.color}-500 text-white shadow-sm`
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            {option.id !== 'all' && (
                              <span className={`w-1.5 h-1.5 rounded-full bg-${option.color}-400`}></span>
                            )}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* רשימה המשימות */}
      <div className="flex-1 overflow-auto relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="space-y-3">
            {getFilteredTasks().map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleTaskEdit}
                onTaskClick={handleTaskClick}
                categories={categories}
                isMenuOpen={openMenuTaskId === task.id}
                onMenuToggle={handleMenuToggle}
                setNotification={setNotification}
                createTask={createTask}
              />
            ))}
            {getFilteredTasks().length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  {searchQuery 
                    ? 'לא נמצאו תוצאות לחיפוש זה'
                    : 'לא נמצאו משימות התואמות את הסינון'
                  }
                </p>
                <div className="mt-4">
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      נקה חיפוש וחזור לתצוה רגילה
                    </button>
                  ) : (
                    <button 
                      onClick={() => setFilters({ date: 'all', status: 'all', priority: 'all' })}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      נקה סינון
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // פונציית עזר להמר עדיפות לטקסט וצבע - נעדכן את הצבעים
  const getPriorityDetails = (priority: string) => {
    const details = {
      high: { text: 'גבוהה', color: 'text-red-800', bgColor: 'bg-red-100' },
      medium: { text: 'בינונית', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      low: { text: 'נמוכה', color: 'text-green-800', bgColor: 'bg-green-100' }
    };
    return details[priority as keyof typeof details] || details.medium;
  };

  const [showNewCategory, setShowNewCategory] = useState(false);

  // עדכון פונקציית updateCategoryCounts
  const updateCategoryCounts = useCallback(() => {
    const newCounts = categories.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? tasks.length 
        : tasks.filter(task => task.category === category.id).length
    }));

    // עדכון רק ב-UI, בלי לשלוח לשרת
    setCategories(newCounts);
  }, [tasks, categories]);

  // עדכון ה-useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCategoryCounts();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tasks, updateCategoryCounts]);

  // עדכון פונקציית השכפול
  const handleDuplicate = async (task: Task) => {
    const { id, ...taskWithoutId } = task;
    const newTask = {
      ...taskWithoutId,
      title: `העתק של ${task.title}`
    };
    
    try {
      await createTask(newTask);
      setShowTaskDetails(false);
      setNotification({ type: 'success', message: 'המשימה שוכפלה בהצלחה' });
    } catch (error) {
      setNotification({ type: 'error', message: 'שגיאה בשכפול המשימה' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  // עדכון הפונקציה לסגירת מודל פרי משימה
  const handleCloseTaskDetails = () => {
    setShowTaskDetails(false);
    setSelectedTaskId(null);
  };

  const [showFilters, setShowFilters] = useState(false);

  // עדכון טיפוס ה-state של התאריך ההתחלתי ל-Date
  const [initialTaskDate, setInitialTaskDate] = useState<Date | null>(null);

  // עדכון הפונקציה להוספת משימה חדשה
  const handleNewTask = (dateOrEvent?: React.MouseEvent | Date) => {
    if (dateOrEvent instanceof Date) {
      setInitialTaskDate(dateOrEvent);
    } else {
      setInitialTaskDate(null);
    }
    setShowNewTask(true);
  };

  // ווסיף את ה-state למצב התפריט
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);

  // נוסיף את ה-state להודעות
  const [notification, setNotification] = useState<NotificationType | null>(null);

  // נעדכן את פונקציית השכפול
  const handleMenuToggle = (taskId: string | null) => {
    setOpenMenuTaskId(taskId);
  };

  // נוסיף את פונקציית renderSidebar
  const renderSidebar = () => (
    <aside className="bg-white border-l hidden md:flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-blue-500" />
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
        <div className="space-y-2 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={!isSidebarOpen ? item.label : undefined}
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                currentView === item.id 
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'ml-3' : 'mx-auto'}`} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                activeCategory === category.id 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getColorClass(category.color)}`} />
                <span className="font-medium">{category.name}</span>
              </div>
              
              {/* מספר המשימות */}
              <span className={`text-sm ${
                    activeCategory === category.id 
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {category.count}
                  </span>
            </button>
          ))}
          <button 
            onClick={() => setShowNewCategory(true)}
            title={!isSidebarOpen ? "הוסף קטגוריה חדשה" : undefined}
            className="w-full px-3 py-2 text-right flex items-center text-gray-500 hover:bg-gray-50 rounded-lg"
          >
            <Plus className={`w-4 h-4 ${isSidebarOpen ? 'ml-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span>קטגוריה חדשה</span>}
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t">
          <button 
            onClick={async () => {
              try {
                await signOut();
                navigate('/login');
              } catch (error) {
                console.error('שגיאה בהתנתקות:', error);
              }
            }}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={!isSidebarOpen ? "התנתק" : undefined}
          >
            <LogOut className={`w-5 h-5 ${isSidebarOpen ? 'ml-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span>התנתק</span>}
          </button>
        </div>
      </nav>
    </aside>
  );

  // הוספת state לחלון אישור מחיקה
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // עדכון פונקציית הטיפול במחיקה
  const handleDeleteConfirm = () => {
    if (selectedTaskId) {
      handleTaskDelete(selectedTaskId);
      setShowDeleteConfirm(false);
      setShowTaskDetails(false);
      setNotification({ type: 'success', message: 'המשימה נמחקה בהצלחה' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // הדפסה רק בטעינה הראשונית של הקומפוננטה
  useEffect(() => {
    if (user) {
      console.log('User authenticated:', user.email);
    }
  }, [user?.id]); // תלוי רק ב-ID של המשתמש

  return (
    <div className="h-screen flex bg-gray-50 text-right" dir="rtl">
      {renderSidebar()}

      {/* Main Content - תמיד מוצג */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {currentView === 'calendar' && (
          <CalendarView 
            tasks={tasks}
            activeCategory={activeCategory}
            categories={categories}
            onTaskClick={handleTaskClick}
            onNewTask={handleNewTask}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        {currentView === 'analytics' && (
          <AnalyticsDashboard 
            tasks={tasks}
            categories={categories}
            activeCategory={activeCategory}
          />
        )}
        {currentView === 'settings' && <SettingsScreen />}
        {currentView === 'dashboard' && renderDashboard()}
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="bg-white border-t py-2 px-4 fixed bottom-0 left-0 right-0 block md:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`p-2 flex flex-col items-center ${
                currentView === item.id ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
          {/* כפתור התנתקות למוביל */}
          <button 
            onClick={async () => {
              try {
                await signOut();
                navigate('/login');
              } catch (error) {
                console.error('שגיאה בהתנתקות:', error);
              }
            }}
            className="p-2 flex flex-col items-center text-red-500"
            aria-label="התנתק"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs mt-1">התנתק</span>
          </button>
        </div>
      </nav>

      {/* Modals - מוצגים מעל התוכן הקיים */}
      {showNewTask && (
        <NewTaskForm 
          onClose={() => {
            setShowNewTask(false);
            setSelectedTaskId(null);
      setInitialTaskDate(null);
          }}
          initialTask={selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : undefined}
          initialDate={initialTaskDate}
          onSubmit={async (taskData) => {
            try {
              if (selectedTaskId) {
                await updateTask(selectedTaskId, taskData);
    } else {
                await createTask(taskData);
              }
              setShowNewTask(false);
              setSelectedTaskId(null);
              showNotification('success', selectedTaskId ? 'המשימה עודכנה בהצלחה' : 'המשימה נוספה בהצלחה');
            } catch (error) {
              showNotification('error', 'שגיאה בשמירת המשימה');
            }
          }}
          categories={categories}
        />
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTaskId && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseTaskDetails(); // שימוש בפונקציה החדשה
            }
          }}
        >
          <div className="bg-white rounded-lg w-full max-w-xl animate-modal-slide-in">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{tasks.find(t => t.id === selectedTaskId)?.title}</h2>
                    {(() => {
                      const task = tasks.find(t => t.id === selectedTaskId);
                      const category = categories.find(c => c.id === task?.category);
                      if (category) {
                        const colors: Record<ColorType, { bg: string; text: string }> = {
                          blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
                          green: { bg: 'bg-green-100', text: 'text-green-800' },
                          yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
                          red: { bg: 'bg-red-100', text: 'text-red-800' },
                          purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
                          pink: { bg: 'bg-pink-100', text: 'text-pink-800' },
                          indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
                          teal: { bg: 'bg-teal-100', text: 'text-teal-800' },
                          orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
                          cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800' }
                        };
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[category.color].bg} ${colors[category.color].text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-${category.color}-500 mr-2`}></span>
                            {category.name}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      <span>{tasks.find(t => t.id === selectedTaskId)?.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>{tasks.find(t => t.id === selectedTaskId)?.dueTime}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleCloseTaskDetails} // שימוש בפונקציה החדשה
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors group"
                  title="סגור חלון"
                  aria-label="סגור חלון פרטי משימה"
                >
                  <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Details */}
              <div className="space-y-4">
                {tasks.find(t => t.id === selectedTaskId)?.location && (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <MapPin className="w-5 h-5" />
                    <span>{tasks.find(t => t.id === selectedTaskId)?.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span className={`px-2 py-1 rounded-full ${
                    getPriorityDetails(tasks.find(t => t.id === selectedTaskId)?.priority || '').bgColor
                  } ${getPriorityDetails(tasks.find(t => t.id === selectedTaskId)?.priority || '').color}`}>
                    עדיפות {getPriorityDetails(tasks.find(t => t.id === selectedTaskId)?.priority || '').text}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span>תזכורת {tasks.find(t => t.id === selectedTaskId)?.reminder} דקות לפני</span>
                </div>
              </div>

              {/* Description */}
              {tasks.find(t => t.id === selectedTaskId)?.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{tasks.find(t => t.id === selectedTaskId)?.description}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => {
    setShowNewTask(true);
                    setShowTaskDetails(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                  title="ערוך משימ"
                  aria-label="ערוך את פרי המשימה"
                >
                  <Edit className="w-4 h-4" />
                  עריכה
                </button>
                <button 
                  onClick={() => {
                    const task = tasks.find(t => t.id === selectedTaskId);
                    if (task) {
                      handleDuplicate(task);
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                  title="שכפל משימה"
                  aria-label="צור העתק של המשימה"
                >
                  <Copy className="w-4 h-4" />
                  שכפול
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors"
                  title="מחק משימה"
                  aria-label="מחק את המשימה לצמיתות"
                >
                  <Trash2 className="w-4 h-4" />
                  מחיקה
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={handleCloseTaskDetails} // שימוש בפונקציה החדשה
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="סגור ח��ון"
                aria-label="סגור חלון פרטי משימה"
              >
                סגירה
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewCategory && (
        <NewCategoryModal
          onClose={() => setShowNewCategory(false)}
          onSubmit={async (newCategory) => {
            try {
              await createCategory(newCategory);
              setShowNewCategory(false);
            } catch (error) {
              setNotification({ type: 'error', message: 'שגיאה ביצירת קטגוריה' });
            }
          }}
        />
      )}

      {/* חלון אישור מחיקה */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <span className="text-lg font-medium">אישור מחיקה</span>
            </div>
            <p className="text-gray-600 mb-6">
              האם אתה בטוח שברצונך למחוק את המשימה "{tasks.find(t => t.id === selectedTaskId)?.title}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                כן, מחק
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* הודעת הצלחה */}
      {notification && (
        <div className={`fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 
          px-4 py-2 rounded-lg shadow-lg z-[100] flex items-center gap-2
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          <div className="w-2 h-2 rounded-full bg-white"></div>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;