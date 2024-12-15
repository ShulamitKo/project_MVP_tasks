import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  X
} from 'lucide-react';
import { Task } from '../types/task';
import { Category } from '../types/category';

interface CalendarViewProps {
  tasks: Task[];
  activeCategory: string;
  categories: Category[];
  onTaskClick: (taskId: string) => void;
  onNewTask: (date?: Date) => void;
  onTaskUpdate: (task: Task) => void;
}

// עדכון טיפוס למצבי תצוגה
type ViewMode = 'month' | 'week' | 'day' | 'agenda';

// הוספת טיפוס ColorType
type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo' | 'teal' | 'orange' | 'cyan';

// פונקציה חדשה לקבלת צבעי הקטגוריה
const getCategoryColors = (color: ColorType) => {
  const colors: Record<ColorType, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    green: { bg: 'bg-green-50', text: 'text-green-700' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    red: { bg: 'bg-red-50', text: 'text-red-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-700' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700' }
  };
  return colors[color];
};

const CalendarView: React.FC<CalendarViewProps> = ({ 
  tasks, 
  activeCategory,
  categories,
  onTaskClick,
  onNewTask,
  onTaskUpdate 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDayPopup, setSelectedDayPopup] = useState<{
    day: number;
    tasks: Task[];
    isActive: boolean;
    date: Date;
  } | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateChange = (direction: number) => {
    const newDate = new Date(selectedDate);
    
    switch (viewMode) {
      case 'week':
        // מעבר של 7 ימים קדימה או אחורה
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'day':
        // מעבר של יום אחד
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'month':
      default:
        // מעבר של חודש שלם
        newDate.setMonth(newDate.getMonth() + direction);
        break;
    }
    
    setSelectedDate(newDate);
  };

  // מחזיר את המערך של ימי החודש
  const getMonthDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // מוסיף את הימים הריקים בתחילת החודש
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // מוסיף את ימי החודש
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // בודק אם יש משימות לתאריך מסוים
  const getTasksForDate = (day: number) => {
    if (!day) return [];
    
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getFullYear() === today.getFullYear();
  };

  // פונציה חדשה לקבלת הימים בשבוע הנוכחי
  const getCurrentWeekDays = () => {
    const curr = new Date(selectedDate);
    const week = [];
    
    // התחלה מיום ראשון
    curr.setDate(curr.getDate() - curr.getDay());
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    
    return week;
  };

  // עדכון פונקציית getTaskStyle
  const getTaskStyle = (task: Task) => {
    // מציאת הקטגוריה הנוכחית
    const category = categories.find((cat: Category) => cat.id === task.category);
    const categoryColors = category ? getCategoryColors(category.color) : { bg: 'bg-gray-50', text: 'text-gray-700' };
    
    const priorityBorderColor = task.priority === 'high' 
      ? 'border-red-500'
      : task.priority === 'medium'
        ? 'border-yellow-500'
        : 'border-green-500';

    const baseStyle = `w-full p-2 rounded text-sm mb-1 transition-all duration-300 hover:shadow-md cursor-pointer
      ${categoryColors.bg} ${categoryColors.text} border-r-4 ${priorityBorderColor}
      ${task.isCompleted ? 'opacity-50 line-through' : ''}`;

    if (activeCategory !== 'all' && task.category === activeCategory) {
      return `${baseStyle} transform scale-105 shadow-md ring-2 ring-blue-400 ring-opacity-50`;
    }

    if (activeCategory !== 'all' && task.category !== activeCategory) {
      return `${baseStyle} opacity-40`;
    }

    return baseStyle;
  };

  // פונקציה חדשה לקבלת משימות ליום ספציפי
  const getTasksForSpecificDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  // פדכון פונקציית getHoursOfDay כך שתחזיר את כל השעות
  const getHoursOfDay = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  // הוספת פונקציה לבדיקה אם השעה היא השעה הנוכחית
  const isCurrentHour = (hour: number) => {
    const now = new Date();
    return now.getHours() === hour;
  };

  // פונקציה חשופרת לגלילה לשעה הנוכחית
  const scrollToCurrentTime = () => {
    const currentHour = new Date().getHours();
    const container = document.querySelector('.calendar-hours-container');
    
    if (container) {
      // מחשב את הגובה של כל שעה (80px לפי ה-className שלנו)
      const hourHeight = 80;
      
      // מחשב את המיקום הרצוי - שעתיים לפני השעה הנוכחית
      const scrollPosition = Math.max(0, (currentHour - 2) * hourHeight);
      
      // מבצע את הגלילה
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // פונקציה חדשה לגלילה ליום הנוכחי בתצוגה החודשית
  const scrollToCurrentDay = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentDayElement = document.getElementById(`day-${currentDay}`);
    
    if (currentDayElement) {
      currentDayElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // עדכון useEffect
  React.useEffect(() => {
    if (viewMode === 'week' || viewMode === 'day') {
      const timer = setTimeout(() => {
        scrollToCurrentTime();
      }, 100);
      return () => clearTimeout(timer);
    } else if (viewMode === 'month') {
      const timer = setTimeout(() => {
        scrollToCurrentDay();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [viewMode, selectedDate]);

  // עונקציה חשופרת לבדיקה אם השעה עברה
  const isPastHour = (hour: number, date: Date) => {
    const now = new Date();
    const compareDate = new Date(date);
    
    // אם התאריך הוא לפני היום - כל השעות עברו
    if (compareDate.setHours(0,0,0,0) < now.setHours(0,0,0,0)) {
      return true;
    }
    
    // אם זה היום - וודק אם השעה עברה
    if (compareDate.setHours(0,0,0,0) === now.setHours(0,0,0,0)) {
      return hour < new Date().getHours();
    }
    
    // אם התאריך בעתיד - אף שעה לא עברה
    return false;
  };

  // פונקציה חדשה לבדיקה אם היום עבר
  const isPastDay = (day: number) => {
    const today = new Date();
    const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    
    // מאפס את השעות לצורך השוואה מדויקת
    checkDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return checkDate < today;
  };

  // פונקציה לבדיקה אם התאריך עתידי או היום
  const isActiveDay = (day: number) => {
    const today = new Date();
    const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    
    // מאפס את השעות לצורך השוואה מדויקת
    checkDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return checkDate >= today;
  };

  // עדכון הפונקציה לפתיחת הפופאפ
  const handleDayClick = (day: number) => {
    const dayTasks = getTasksForDate(day);
    const isActive = isActiveDay(day);
    
    // יצירת תאריך חדש עם התחשבות באזור הזמן המקומי
    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day,
      12, // הוספת שעה 12 בצהריים כדי להימנע מבעיות אזור זמן
      0,
      0
    );

    setSelectedDayPopup({ 
      day, 
      tasks: dayTasks, 
      isActive,
      date: selectedDay // שמירת התאריך המלא
    });
  };

  // פוקצה שה לקבלת כל המשימות בחודש הנוכחי
  const getMonthTasks = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= firstDay && taskDate <= lastDay;
    });
  };

  // פונקציה לקבלת המשימות מסודרות לפי ימים בחודש
  const getGroupedMonthTasks = () => {
    const monthTasks = getMonthTasks();
    const grouped = new Map<string, Task[]>();

    monthTasks.forEach(task => {
      if (!grouped.has(task.dueDate)) {
        grouped.set(task.dueDate, []);
      }
      grouped.get(task.dueDate)?.push(task);
    });

    // מיון לפי תאריך
    return Array.from(grouped.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
  };

  // פונקציה חדשה לטיפול בשינוי סטטוס המשימה
  const handleTaskComplete = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation(); // מניעת פתיחת המודל
    onTaskUpdate({
      ...task,
      isCompleted: !task.isCompleted
    });
  };

  // עדכון רינדור המשימה בכל התצוגות
  const renderTask = (task: Task) => (
    <button
      key={task.id}
      onClick={(e) => {
        e.stopPropagation(); // מונע את הפתיחה של מודל היום
        onTaskClick?.(task.id!);
      }}
      className={getTaskStyle(task)}
    >
      <div className="flex items-center gap-2">
        {/* כפתור סימון ביצוע */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // מונע את הפתיחה של מודל היום
            handleTaskComplete(e, task);
          }}
          className={`w-5 h-5 rounded border ${
            task.isCompleted 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'border-gray-300 hover:border-blue-500'
          } flex items-center justify-center flex-shrink-0`}
        >
          {task.isCompleted && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="flex-1 text-right">
          <div className="font-medium truncate">{task.title}</div>
          <div className="flex items-center justify-between text-xs mt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.dueTime}</span>
            </div>
            {task.location && (
              <div className="hidden md:flex items-center text-gray-500">
                <MapPin className="w-3 h-3 ml-1" />
                <span className="truncate max-w-[80px]">{task.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          {/* שורה ראשונה - כותרת וכפתור משימה חדשה */}
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">יומן משימות</h1>
            <button 
              onClick={() => onNewTask(new Date())}
              className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl group flex-shrink-0"
            >
              <div className="relative p-2.5 md:px-5 md:py-2.5 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline whitespace-nowrap">משימה חדשה</span>
              </div>
            </button>
          </div>

          {/* שורה שנייה - בחירת תצוגה */}
          <div className="px-4 md:px-6 py-3 border-t">
            <div className="bg-gray-100 p-1 rounded-xl flex justify-between md:justify-start gap-1">
              <button
                onClick={() => setViewMode('month')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'month' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm">חודשי</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'week' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">שבועי</span>
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'day' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">יומי</span>
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'agenda' 
                    ? 'bg-white text-blue-600 shadow-sm font-medium' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">רשימה</span>
              </button>
            </div>
          </div>

          {/* שורה שלישית - ניווט בתאריכים */}
          <div className="px-4 md:px-6 py-3 border-t flex items-center justify-between">
            <button 
              onClick={() => handleDateChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-medium text-gray-800">
                {viewMode === 'agenda' 
                  ? selectedDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })
                  : selectedDate.toLocaleString('he-IL', { 
                      month: 'long', 
                      year: 'numeric',
                      ...(viewMode !== 'month' && { day: 'numeric' })
                    })
              }
              </h2>
              <button 
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors mt-1"
              >
                חזור להיום
              </button>
            </div>
            <button 
              onClick={() => handleDateChange(1)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* תוכן הלוח - לפי מצב תצוגה */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {viewMode === 'month' && (
            // תצוגה חודשית - קיימת
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {/* ימי השבוע - משופר */}
              {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
                <div key={day} className="text-center text-gray-500 font-medium py-2 hidden md:block">
                  {day}
                </div>
              ))}
              {/* גרסה מקוצרת למובייל */}
              {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
                <div key={day} className="text-center text-gray-500 font-medium py-2 md:hidden">
                  {day}
                </div>
              ))}

              {/* ימי החודש - משופר */}
              {getMonthDays().map((day, index) => (
                <div
                  key={index}
                  id={day ? `day-${day}` : undefined}
                  onClick={() => day && handleDayClick(day)}
                  className={`min-h-[100px] md:min-h-[150px] ${
                    day ? 'bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow' : ''
                  } ${isToday(day!) ? 'ring-2 ring-blue-400' : ''} ${
                    day && !isActiveDay(day!) ? 'opacity-60 cursor-default' : 'cursor-pointer'
                  }`}
                >
                  {day && (
                    <div className="h-full flex flex-col">
                      {/* תאריך */}
                      <div className={`p-2 md:p-3 border-b ${
                        isToday(day) ? 'bg-blue-50 text-blue-600 font-medium' : ''
                      }`}>
                        {day}
                      </div>
                      
                      {/* מקע אפור לימים שעברו */}
                      <div className={`flex-1 p-1 md:p-2 space-y-1 overflow-y-auto relative ${
                        isPastDay(day) ? 'bg-gray-100' : ''
                      }`}>
                        {getTasksForDate(day)
                          .sort((a, b) => a.dueTime.localeCompare(b.dueTime))
                          .map(task => renderTask(task))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'week' && (
            <div className="flex flex-col">
              <div className="grid grid-cols-8 gap-2 md:gap-4">
                {/* עותרות הימים - קבועות למעלה */}
                <div className="col-span-8 grid grid-cols-8 sticky top-0 bg-white z-20">
                  {/* תא ריק מעל עמודת השעות */}
                  <div className="p-4"></div>
                  
                  {/* כותרות הימים */}
                  {getCurrentWeekDays().map((date, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`p-2 text-center border-b ${
                        isToday(date.getDate()) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="text-gray-500 text-sm">
                        {date.toLocaleString('he-IL', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg font-medium ${
                        isToday(date.getDate()) ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* אזור הגלילה - כולל עמודת השעות */}
                <div className="col-span-8 calendar-hours-container overflow-auto max-h-[calc(100vh-16rem)]">
                  <div className="grid grid-cols-8 gap-2">
                    {/* עמודת שעות - נגללת עם התוכן */}
                    <div>
                      {getHoursOfDay().map(hour => (
                        <div key={hour} className="h-20 text-sm text-gray-500 text-center">
                          {`${hour.toString().padStart(2, '0')}:00`}
                        </div>
                      ))}
                    </div>

                    {/* ימי השבוע */}
                    {getCurrentWeekDays().map((date, dayIndex) => (
                      <div key={dayIndex} className="flex flex-col">
                        <div className="flex-1">
                          {getHoursOfDay().map(hour => (
                            <div key={hour} className="relative">
                              <div 
                                id={`hour-${dayIndex}-${hour}`}
                                className={`h-20 border-b border-gray-100 relative`}
                              >
                                {/* רקע אפור לשעות שעברו */}
                                <div className={`absolute inset-0 ${
                                  isPastHour(hour, date) ? 'bg-gray-100' : ''
                                }`}></div>
                                
                                {/* קו אדום לשעה הנוכחית */}
                                {isCurrentHour(hour) && isToday(date.getDate()) && (
                                  <div className="absolute left-0 right-0 border-t-2 border-red-500 top-0 z-10">
                                    <div className="absolute -right-2 -top-1 w-2 h-2 bg-red-500 rounded-full" />
                                  </div>
                                )}
                              </div>
                              {getTasksForSpecificDate(date)
                                .filter(task => parseInt(task.dueTime.split(':')[0]) === hour)
                                .map(task => renderTask(task))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'day' && (
            <div className="flex gap-4">
              {/* לוח זמנים */}
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="calendar-hours-container overflow-auto max-h-[calc(100vh-12rem)]">
                    {getHoursOfDay().map(hour => (
                      <div key={hour} id={`hour-${hour}`} className="flex border-b last:border-b-0">
                        {/* עמודת השעות */}
                        <div className="w-16 py-4 px-2 text-sm text-gray-500 text-center border-l sticky left-0 bg-white">
                          {`${hour.toString().padStart(2, '0')}:00`}
                        </div>
                        {/* תא המשימות */}
                        <div className="flex-1 min-h-[5rem] p-2 relative">
                          {/* רקע אפור לשעות שעברו */}
                          <div className={`absolute inset-0 ${
                            isPastHour(hour, selectedDate) ? 'bg-gray-100' : ''
                          }`}></div>
                          
                          {/* ו אדום לשעה הנוכחית */}
                          {isCurrentHour(hour) && (
                            <div className="absolute left-0 right-0 border-t-2 border-red-500 top-0 z-10">
                              <div className="absolute -right-2 -top-1 w-2 h-2 bg-red-500 rounded-full" />
                            </div>
                          )}
                          
                          {/* משימות */}
                          {getTasksForSpecificDate(selectedDate)
                            .filter(task => parseInt(task.dueTime.split(':')[0]) === hour)
                            .map(task => renderTask(task))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* סיכום יומי - רק בדסקטופ */}
              <div className="hidden lg:block w-80">
                <div className="bg-white rounded-xl p-4 shadow-sm sticky top-4">
                  <h3 className="text-lg font-medium mb-4">סיכום יומי</h3>
                  <div className="space-y-2">
                    {getTasksForSpecificDate(selectedDate)
                      .sort((a, b) => a.dueTime.localeCompare(b.dueTime))
                      .map(task => renderTask(task))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'agenda' && (
            // תצוגת רשימה - חדשה
            <div className="space-y-4">
              {/* כותרת החודש */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    {getMonthTasks().length} משימות בחודש זה
                  </div>
                </div>

                {/* רשימת המשימות לפי ימים */}
                <div className="divide-y">
                  {getGroupedMonthTasks().map(([date, tasks]) => (
                    <div key={date} className="bg-white">
                      <div className="px-6 py-3 flex items-center justify-between bg-gray-50 border-b">
                        <div className="font-medium">
                          {new Date(date).toLocaleDateString('he-IL', {
                            weekday: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tasks.length} משימות
                        </div>
                      </div>
                      <div className="divide-y">
                        {tasks
                          .sort((a, b) => a.dueTime.localeCompare(b.dueTime))
                          .map(task => renderTask(task))}
                      </div>
                    </div>
                  ))}

                  {/* הודעה כשאין משימות */}
                  {getMonthTasks().length === 0 && (
                    <div className="px-6 py-12 text-center text-gray-500">
                      <div className="text-lg font-medium">אין משימו�� בחודש זה</div>
                      <button 
                        onClick={() => onNewTask(new Date())}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        הוסף משימה חדשה
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* הוספת הפופאפ */}
          {selectedDayPopup && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedDayPopup(null);
                }
              }}
            >
              <div className="bg-white rounded-lg w-full max-w-lg animate-modal-slide-in overflow-hidden">
                {/* כותרת הפופאפ */}
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDayPopup.day)
                        .toLocaleDateString('he-IL', { 
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                    </h3>
                    <button 
                      onClick={() => setSelectedDayPopup(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* תוכן הפופאפ */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                  {selectedDayPopup.tasks.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDayPopup.tasks
                        .sort((a, b) => a.dueTime.localeCompare(b.dueTime))
                        .map(task => renderTask(task))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-lg">אין משימות ביום זה</div>
                      {selectedDayPopup.isActive && (
                        <button
                          onClick={() => {
                            // שימוש בתאריך השמור במקום יצירת תאריך חדש
                            onNewTask(selectedDayPopup.date);
                            setSelectedDayPopup(null);
                          }}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          משימה חדשה
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* כפתורי פעולה */}
                <div className="px-6 py-4 border-t bg-gray-50">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedDayPopup(null)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      סגור
                    </button>
                    {selectedDayPopup.isActive && (
                      <button
                        onClick={() => {
                          // שימוש בתאריך השמור במקום יצירת תאריך חדש
                          onNewTask(selectedDayPopup.date);
                          setSelectedDayPopup(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        משימה חדשה
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;