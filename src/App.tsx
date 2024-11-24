import { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';
import NewTaskForm from './components/NewTaskForm';
import CalendarView from './components/CalendarView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsScreen from './components/SettingsScreen';
import TaskItem from './components/TaskItem';
import { Task } from './types/task';
import NewCategoryModal from './components/categories/NewCategoryModal';
import { Category, ColorType } from './types/category';

// עדכון הממשק של הסינונים
interface FilterState {
  date: 'today' | 'week' | 'month' | 'all';
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
}

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showNewTask, setShowNewTask] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'פגישת צוות שבועית',
      description: 'פגישה שבועית לסקירת התקדמות הפרויקט',
      dueDate: '2024-11-13',
      dueTime: '10:00',
      category: 'work',
      priority: 'high',
      location: 'חדר ישיבות ראשי',
      reminder: '15',
      repeat: 'weekly',
      isCompleted: false,
      isFavorite: true
    },
    {
      id: 2,
      title: 'הכנת מצגת לקוח',
      description: 'הכנת מצגת לפגישה עם לקוח חדש',
      dueDate: '2024-11-14',
      dueTime: '14:00',
      category: 'work',
      priority: 'medium',
      location: 'משרד',
      reminder: '30',
      repeat: 'none',
      isCompleted: false,
      isFavorite: false
    },
    {
      id: 3,
      title: 'עדכון דו"ח חודשי',
      description: 'הכנת דו"ח חודשי לפעילות המחלקה',
      dueDate: '2024-11-18',
      dueTime: '16:00',
      category: 'work',
      priority: 'low',
      location: '',
      reminder: '0',
      repeat: 'monthly',
      isCompleted: true,
      isFavorite: false
    },
    {
      id: 4,
      title: 'פגישת לקוח',
      description: 'פגישת היכרות עם לקוח פוטניאלי',
      dueDate: '2024-11-15',
      dueTime: '11:00',
      category: 'work',
      priority: 'high',
      location: 'משרדי הלקוח',
      reminder: '30',
      repeat: 'none',
      isCompleted: false,
      isFavorite: false
    },
    {
      id: 5,
      title: 'אימון כושר',
      description: 'אימון שבועי',
      dueDate: '2024-11-16',
      dueTime: '08:00',
      category: 'personal',
      priority: 'medium',
      location: 'חדר כושר',
      reminder: '15',
      repeat: 'weekly',
      isCompleted: false,
      isFavorite: true
    }
  ]);

  // קטגוריות - עם ערך התחלתי ל-count
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'הכל', color: 'blue', count: 0 },
    { id: 'work', name: 'עבודה', color: 'red', count: 0 },
    { id: 'personal', name: 'אישי', color: 'green', count: 0 },
    { id: 'study', name: 'לימודים', color: 'yellow', count: 0 },
    { id: 'family', name: 'משפחה', color: 'purple', count: 0 }
  ]);

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
  const handleTaskUpdate = (updatedTask: Task) => {
    if (updatedTask.id) {
      // עדכון משימה קיימת
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } else {
      // הוספת משימה חדשה (למקרה של שכפול)
      setTasks(prevTasks => [...prevTasks, { 
        ...updatedTask, 
        id: Math.max(...prevTasks.map(t => t.id ?? 0)) + 1 
      }]);
    }
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleTaskEdit = (taskId: number) => {
    const taskToEdit = tasks.find(t => t.id === taskId);
    if (taskToEdit) {
      setSelectedTaskId(taskId);
      setShowNewTask(true);
      setShowTaskDetails(false);
    }
  };

  // העברת המשימות ל-CalendarView
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const handleTaskClick = (taskId: number) => {
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
      
      // אם עברנו את בדיקת הקטגוריה, בודקים את החיפוש
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
          if (taskDate < weekStart || taskDate > today) return false;
          break;
        case 'month':
          if (taskDate < monthStart || taskDate > today) return false;
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

  // עדכון הרינדור של הדשבורד - החלק הרלוונטי
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
                className="w-full pr-12 pl-12 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-200 transition-all text-sm font-medium placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* כפתור צף להוספת משימה */}
            <button 
              onClick={() => setShowNewTask(true)}
              className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl group flex-shrink-0"
            >
              <div className="relative p-2.5 md:px-5 md:py-2.5 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline whitespace-nowrap">משימה חדשה</span>
              </div>
            </button>

            {/* התראות */}
            <button className="p-2 hover:bg-gray-50 rounded-full relative flex-shrink-0">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* שורה שנייה - פילטרים */}
          <div className="py-3">
            {/* הודעת סינון */}
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
                  className="text-blue-600 hover:text-blue-700 text-sm flex-shrink-0 mr-2"
                >
                  נקה
                </button>
              </div>
            )}

            {/* סרגל סינון - עיצוב משופר */}
            {!searchQuery && (
              <>
                {/* כותרת הסינון - כל השורה לחיצה */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between py-2 text-gray-500 hover:text-gray-700 transition-colors md:hidden"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">סינון משימות</span>
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
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
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
                                : 'text-gray-600 hover:bg-gray-50'
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
                                : 'text-gray-600 hover:bg-gray-50'
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
                                : 'text-gray-600 hover:bg-gray-50'
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

      {/* רשימת המשימות */}
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
                      נקה חיפוש וחזור לתצוגה רגילה
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

  // פונקציית עזר להמר עדיפות לטקסט וצבע - נעדכן את הצבעים
  const getPriorityDetails = (priority: string) => {
    switch (priority) {
      case 'high':
        return { text: 'גבוהה', color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'medium':
        return { text: 'בינונית', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      case 'low':
        return { text: 'נמוכה', color: 'text-green-600', bgColor: 'bg-green-50' };
      default:
        return { text: 'לא הוגדר', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const [showNewCategory, setShowNewCategory] = useState(false);

  // הוספת פונקציה לחישוב מספר המשימו בכל קטגוריה
  const updateCategoryCounts = () => {
    const newCategories = categories.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? tasks.length 
        : tasks.filter(task => task.category === category.id).length
    }));
    
    setCategories(newCategories);
  };

  // קריאה לפונקציה בכל שינוי של המשימות
  useEffect(() => {
    updateCategoryCounts();
  }, [tasks]);

  // עדכון הפונקציה לטיפול בלחיצה על קטגוריה
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);

    // אם נמצאים בהגדרות, לא עושים כלום
    if (currentView === 'settings') {
      return;
    }

    // אם נמצאים בדשבורד או יומן, רק מעדכנים את הקטגוריה הפעילה
    // אם נמצאים בסטטיסטיקות, נשארים שם
    // אין צורך לעבור לדשבורד
  };

  // עדכון הרינדור של הסרגל הצידי
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
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              title={!isSidebarOpen ? `${category.name} (${category.count})` : undefined}
              className={`w-full px-3 py-2 rounded-lg text-right flex items-center transition-all ${
                activeCategory === category.id 
                  ? 'bg-gray-100 font-medium'
                  : 'hover:bg-gray-50'
              } ${
                // מוסיפים disabled style כשנמצאים בהגדרות
                currentView === 'settings' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              // מבטלים את הלחיצה בהגדרות
              disabled={currentView === 'settings'}
            >
              <span className={`w-2 h-2 rounded-full ${getColorClass(category.color)}`} />
              {isSidebarOpen && (
                <>
                  <span className="mr-3 text-gray-700">{category.name}</span>
                  <span className={`mr-auto text-sm ${
                    activeCategory === category.id 
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                </>
              )}
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
      </nav>
    </aside>
  );

  // הוספת state לניהול התפריט הפתוח
  const [openMenuTaskId, setOpenMenuTaskId] = useState<number | null>(null);

  // פונקציה לטיפול בפתיחה/סגירה של תפריט
  const handleMenuToggle = (taskId: number | null) => {
    setOpenMenuTaskId(taskId);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // הוספת state להודעות
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // עדכון פונקציית השכפול במודל
  const handleDuplicate = (task: Task) => {
    const newTask = {
      ...task,
      id: Math.max(...tasks.map(t => t.id ?? 0)) + 1,
      title: `העתק של ${task.title}`
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskDetails(false);
    
    // הצגת הודעת הצלחה
    setNotification({
      message: 'המשימה שוכפלה בהצלחה',
      type: 'success'
    });

    // הסרת ההודעה אחרי 3 שניות
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // עדכון הפונקציה לסגירת מודל פרטי משימה
  const handleCloseTaskDetails = () => {
    setShowTaskDetails(false);
    setSelectedTaskId(null); // מאפס את ה-ID של המשימה הנבחרת
  };

  const [showFilters, setShowFilters] = useState(false);

  // הוספת state לתאריך ההתחלתי
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
        {currentView === 'settings' && (
          <SettingsScreen 
            categories={categories}
            onAddCategory={(category) => {
              setCategories(prev => [
                ...prev,
                {
                  id: category.name.toLowerCase().replace(/\s+/g, '-'),
                  name: category.name,
                  count: 0,
                  color: category.color
                }
              ]);
            }}
            onEditCategory={(id, updates) => {
              setCategories(prev => prev.map(cat => 
                cat.id === id ? { ...cat, ...updates } : cat
              ));
            }}
            onDeleteCategory={(id) => {
              setCategories(prev => prev.filter(cat => cat.id !== id));
            }}
          />
        )}
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
          initialDate={initialTaskDate} // העברת התאריך ההתחלתי
          onSubmit={(updatedTask) => {
            if (selectedTaskId) {
              // עדכון משימה קיימת
              handleTaskUpdate({ ...updatedTask, id: selectedTaskId });
            } else {
              // יצירת משימה חדשה
              setTasks(prev => [...prev, { 
                ...updatedTask, 
                id: Math.max(...prev.map(t => t.id ?? 0)) + 1 
              }]);
            }
            setShowNewTask(false);
            setSelectedTaskId(null);
            setInitialTaskDate(null);
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
                  aria-label="סגו חלון פרטי משימה"
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
                  aria-label="ערוך את פרטי המשימה"
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
                  aria-label="מחק את המשימה לצמיתו"
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
                title="סגור חלון"
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
          onSubmit={(newCategory) => {
            setCategories(prev => [
              ...prev,
              {
                id: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
                name: newCategory.name,
                count: 0,
                color: newCategory.color as ColorType
              }
            ]);
            setShowNewCategory(false);
          }}
        />
      )}

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
                onClick={() => {
                  if (selectedTaskId) {  // וידוא שיש ID למחיקה
                    handleTaskDelete(selectedTaskId);
                    setShowDeleteConfirm(false);
                    setShowTaskDetails(false);
                  }
                }}
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