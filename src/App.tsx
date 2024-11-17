import { useState } from 'react';
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
  PlusCircle,
  CheckCircle,
  Clock,
  Filter,
  X,
  MapPin,
  AlertCircle,
  Edit,
  Copy,
  Trash2,
  ListTodo
} from 'lucide-react';
import NewTaskForm from './components/NewTaskForm';
import CalendarView from './components/CalendarView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsScreen from './components/SettingsScreen';
import TaskItem from './components/TaskItem';
import { Task } from './types/task';

// הגדרת טיפוסים
type ColorType = 'blue' | 'green' | 'yellow' | 'red';
type CategoryType = {
  id: string;
  name: string;
  count: number;
  color: ColorType;
};

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showNewTask, setShowNewTask] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
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
      description: 'פגישת היכרות עם לקוח פוטנציאלי',
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

  // קטגוריות
  const categories: CategoryType[] = [
    { id: 'all', name: 'כל המשימות', count: 12, color: 'blue' },
    { id: 'personal', name: 'אישי', count: 4, color: 'green' },
    { id: 'work', name: 'עבודה', count: 6, color: 'yellow' },
    { id: 'family', name: 'משפחה', count: 2, color: 'red' }
  ];

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
      red: 'bg-red-500'
    };
    return colors[color];
  };

  // פונקציות לטיפול במשימות
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleTaskEdit = () => {
    setSelectedTaskId(selectedTaskId);
    setShowNewTask(true);
  };

  // העברת המשימות ל-CalendarView
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowTaskDetails(true);
  };

  // רינדור הדשבורד
  const renderDashboard = () => (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">המשימות שלי</h1>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowNewTask(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <PlusCircle className="w-5 h-5" />
                <span>משימה חדשה</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="...חיפוש משימות"
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`p-2 border rounded-lg ${
                showAdvancedFilter 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {['today', 'week', 'month', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'today' && 'היום'}
                {tab === 'week' && 'השבוע'}
                {tab === 'month' && 'החודש'}
                {tab === 'all' && 'הכל'}
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">משימות להיום</div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-700">8</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-yellow-600 text-sm font-medium">בתהליך</div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-2xl font-bold text-yellow-700">12</span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 text-sm font-medium">הושלמו השבוע</div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-2xl font-bold text-green-700">15</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Filter */}
      {showAdvancedFilter && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">סינון מתקדם</h3>
            <button 
              onClick={() => setShowAdvancedFilter(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">סטטוס</label>
              <select className="w-full p-2 border rounded-lg">
                <option>הכל</option>
                <option>ממתין</option>
                <option>בתהליך</option>
                <option>הושלם</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">עדיפות</label>
              <select className="w-full p-2 border rounded-lg">
                <option>הכל</option>
                <option>גבוהה</option>
                <option>בינונית</option>
                <option>נמוכה</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">קטגוריה</label>
              <select className="w-full p-2 border rounded-lg">
                <option>הכל</option>
                <option>עבודה</option>
                <option>אישי</option>
                <option>לימודים</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                החל סינון
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={handleTaskEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // פונקציית עזר להמרת עדיפות לטקסט וצבע - נעדכן את הצבעים
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

  return (
    <div className="h-screen flex bg-gray-50 text-right" dir="rtl">
      {/* Sidebar */}
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
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
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
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              {isSidebarOpen && <h2 className="font-semibold text-gray-600">קטגוריות</h2>}
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Plus className={`w-4 h-4 text-gray-500 ${isSidebarOpen ? '' : 'mx-auto'}`} />
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {showNewTask ? (
          <NewTaskForm 
            onClose={() => {
              setShowNewTask(false);
              setSelectedTaskId(null);
            }}
            initialTask={tasks.find(t => t.id === selectedTaskId)}
            onSubmit={(updatedTask) => {
              if (selectedTaskId) {
                // עדכון משימה קיימת
                handleTaskUpdate(updatedTask);
              } else {
                // יצירת משימה חדשה
                setTasks(prev => [...prev, { ...updatedTask, id: Math.max(...prev.map(t => t.id ?? 0)) + 1 }]);
              }
            }}
          />
        ) : (
          <>
            {currentView === 'calendar' && (
              <CalendarView 
                tasks={tasks}
                onTaskClick={handleTaskClick}
                onNewTask={() => setShowNewTask(true)}
              />
            )}
            {currentView === 'analytics' && <AnalyticsDashboard />}
            {currentView === 'settings' && <SettingsScreen />}
            {currentView === 'dashboard' && renderDashboard()}
          </>
        )}
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

      {/* Task Details Modal */}
      {showTaskDetails && selectedTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{tasks.find(t => t.id === selectedTaskId)?.title}</h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tasks.find(t => t.id === selectedTaskId)?.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{tasks.find(t => t.id === selectedTaskId)?.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tasks.find(t => t.id === selectedTaskId)?.dueTime}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTaskDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Details */}
              <div className="space-y-4">
                {tasks.find(t => t.id === selectedTaskId)?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{tasks.find(t => t.id === selectedTaskId)?.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className={`px-2 py-1 rounded-full ${
                    getPriorityDetails(tasks.find(t => t.id === selectedTaskId)?.priority || '').bgColor
                  } ${getPriorityDetails(tasks.find(t => t.id === selectedTaskId)?.priority || '').color}`}>
                    עדיפות {getPriorityDetails(tasks.find(t => t.id === selectedTaskId)?.priority || '').text}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
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
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200"
                >
                  <Edit className="w-4 h-4" />
                  עריכה
                </button>
                <button 
                  onClick={() => {
                    const task = tasks.find(t => t.id === selectedTaskId);
                    if (task) {
                      const newTask = {
                        ...task,
                        id: Math.max(...tasks.map(t => t.id ?? 0)) + 1,
                        title: `העתק של ${task.title}`
                      };
                      setTasks(prev => [...prev, newTask]);
                    }
                    setShowTaskDetails(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-200"
                >
                  <Copy className="w-4 h-4" />
                  שכפול
                </button>
                <button 
                  onClick={() => {
                    handleTaskDelete(selectedTaskId);
                    setShowTaskDetails(false);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  מחיקה
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowTaskDetails(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                סגירה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;