import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '../types/task';
import { Category } from '../types/category';
import { tasksApi } from '../backend/api/tasks';
import { categoriesApi } from '../backend/api/categories';
import { useAuth } from './AuthContext';

// הוספת הטיפוס
interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

interface DataContextType {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  createTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'count'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  notification: NotificationType | null;
  showNotification: (type: 'success' | 'error', message: string) => void;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  toggleTaskFavorite: (taskId: string) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// פונקציית עזר לניהול תור הסנכרון
const syncQueue: (() => Promise<void>)[] = [];
let isSyncing = false;

const processSyncQueue = async () => {
  if (isSyncing || syncQueue.length === 0) return;
  
  isSyncing = true;
  try {
    const action = syncQueue.shift();
    if (action) await action();
  } finally {
    isSyncing = false;
    if (syncQueue.length > 0) {
      processSyncQueue();
    }
  }
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const initRef = useRef(false);  // משתנה לבדיקה אם כבר אותחל
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  // מנע ריצות כפולות של refreshData
  const [isRefreshing, setIsRefreshing] = useState(false);

  // נוסיף דגל שיציין אם זה עדכון ראשוני
  const [isInitialized, setIsInitialized] = useState(false);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // פונקציה לרענון הנתונים
  const refreshData = useCallback(async () => {
    if (isRefreshing || !user) return;
    
    try {
      setIsRefreshing(true);
      
      // קבלת הנתונים מהשרת
      const [newTasks, newCategories] = await Promise.all([
        tasksApi.getTasks(),
        categoriesApi.getCategories()
      ]);

      // עישוב מחדש של הקאונטרים
      const categoriesWithCounts = newCategories.map(category => ({
        ...category,
        count: category.id === 'all' 
          ? newTasks.length 
          : newTasks.filter(task => task.category === category.id).length
      }));

      // עדכון ה-state
      setTasks(newTasks);
      setCategories(categoriesWithCounts);

      // עדכון ה-localStorage
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      localStorage.setItem('categories', JSON.stringify(categoriesWithCounts));

    } catch (error) {
      console.error('Error refreshing data:', error);
      showNotification('error', 'שגיאה בטעינת הנתונים');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [user, isRefreshing, showNotification]);

  // טעינה ראשונית - רק פעם אחת
  useEffect(() => {
    const initializeData = async () => {
      if (!user || initRef.current) return;
      
      try {
        const savedTasks = localStorage.getItem('tasks');
        const savedCategories = localStorage.getItem('categories');
        
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }
        
        initRef.current = true;
        setIsInitialized(true);
        await refreshData();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [user]);

  // עדכון תקופתי של הנתונים
  useEffect(() => {
    if (!user || !isInitialized) return;

    const intervalId = setInterval(refreshData, 30000); // עדכון כל 30 שניות

    return () => clearInterval(intervalId);
  }, [user, isInitialized, refreshData]);

  // עונקציית עזר לעדכון מנה המשימות בקטגוריות
  const updateCategoryCounts = useCallback((currentTasks: Task[]) => {
    setCategories(prev => prev.map(category => ({
      ...category,
      count: currentTasks.filter(task => task.category === category.id).length
    })));
  }, []);

  // עדכון בכל פעולה שמשנה משימות
  useEffect(() => {
    updateCategoryCounts(tasks);
  }, [tasks, updateCategoryCounts]);

  const addToSyncQueue = (action: () => Promise<void>) => {
    syncQueue.push(action);
    processSyncQueue();
  };

  // עדכון הפונקציות עם הודעות
  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    const originalTask = tasks.find(t => t.id === id);
    if (!originalTask) return;
    
    // עדכון מיידי של ה-UI
    setTasks(prev => {
      const newTasks = prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      );
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return newTasks;
    });
    showNotification('success', 'המשימה עודכנה בהצלחה');

    // סנכרון עם השרת ברקע
    addToSyncQueue(async () => {
      try {
        await tasksApi.updateTask(id, updates);
      } catch (error) {
        setTasks(prev => {
          const newTasks = prev.map(task => task.id === id ? originalTask : task);
          localStorage.setItem('tasks', JSON.stringify(newTasks));
          return newTasks;
        });
        showNotification('error', 'שגיאה בעדכון המשימה');
      }
    });
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // עדכון מיידי בל ה-UI
    const newIsCompleted = !task.isCompleted;
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, isCompleted: newIsCompleted } : t
    ));
    showNotification('success', newIsCompleted ? 'המשימה הושלמה' : 'המשימה לא הושלמה');

    // הוספת הסנכרון לתור
    addToSyncQueue(async () => {
      try {
        await tasksApi.updateTask(taskId, { isCompleted: newIsCompleted });
      } catch (error) {
        // במקרה של שגיאה - החזרת המצב הקודם
        setTasks(prev => prev.map(t => 
          t.id === taskId ? task : t
        ));
        showNotification('error', 'שגיאה בעדכון סטטוס המשימה');
      }
    });
  };

  const toggleTaskFavorite = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newIsFavorite = !task.isFavorite;
    
    // עדכון מיידי של ה-UI
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, isFavorite: newIsFavorite } : t
    ));
    showNotification('success', newIsFavorite ? 'נוסף למועדפים' : 'הוסר מהמועדפי');

    // סנכרון עם השרת ברקע
    addToSyncQueue(async () => {
      try {
        await tasksApi.updateTask(taskId, { isFavorite: newIsFavorite });
      } catch (error) {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? task : t
        ));
        showNotification('error', 'שגיאה בעדכון המועדפים');
      }
    });
  };

  const contextValue: DataContextType = {
    tasks,
    categories,
    isLoading,
    error,
    refreshData,
    createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
      const tempId = `temp-${Date.now()}`;
      const tempTask = { ...task, id: tempId };
      
      // עודם כל מוסיפים ל-UI
      setTasks(prev => {
        const newTasks = [...prev, tempTask];
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        return newTasks;
      });
      
      // מציגים הודעת הצלחה מיד
      showNotification('success', 'המשימה נוספה בהצלחה');

      // מנסים לשמור בשרת ברקע
      addToSyncQueue(async () => {
        try {
          const result = await tasksApi.createTask(task);
          // מעדכנים את ה-ID האמיתי בשקט
          setTasks(prev => {
            const newTasks = prev.map(t => t.id === tempId ? result : t);
            localStorage.setItem('tasks', JSON.stringify(newTasks));
            return newTasks;
          });
        } catch (error) {
          // אם יש שגיאה - מוחקים את המשימה הזמנית
          setTasks(prev => {
            const newTasks = prev.filter(t => t.id !== tempId);
            localStorage.setItem('tasks', JSON.stringify(newTasks));
            return newTasks;
          });
          showNotification('error', 'שגיאה ביצירת המשימה');
        }
      });

      // מחזירים את המשימה הזמנית מיד
      return tempTask;
    },
    updateTask,
    deleteTask: async (id: string): Promise<void> => {
      const taskToDelete = tasks.find(t => t.id === id);
      if (!taskToDelete) return;

      // מודם כל מוחקים מה-UI
      setTasks(prev => {
        const newTasks = prev.filter(t => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        return newTasks;
      });
      
      // מציגים הודעת הצלחה מיד
      showNotification('success', 'המשימה נמחקה בהצלחה');

      // רק מנסים למחוק מהשרת
      addToSyncQueue(async () => {
        try {
          await tasksApi.deleteTask(id);
        } catch (error) {
          // אם יש שגיאה - מחזירים את המשימה ל-UI
          setTasks(prev => {
            const newTasks = [...prev, taskToDelete];
            localStorage.setItem('tasks', JSON.stringify(newTasks));
            return newTasks;
          });
          showNotification('error', 'שגיאה במחיקת המשימה');
        }
      });
    },
    createCategory: async (formData: Omit<Category, 'id' | 'count'>) => {
      const tempId = `temp-${Date.now()}`;
      const tempCategory: Category = {
        id: tempId,
        name: formData.name,
        color: formData.color,
        count: 0
      };

      try {
        // עדכון מיידי של ה-UI
        setCategories(prev => [...prev, tempCategory]);
        
        // יצירת הקטגוריה בשרת
        const newCategory = await categoriesApi.createCategory(formData);
        
        // עדכון ה-ID האמיתי
        setCategories(prev => prev.map(cat => 
          cat.id === tempId ? newCategory : cat
        ));
        
        // עדכון ה-localStorage
        const updatedCategories = categories.map(cat => 
          cat.id === tempId ? newCategory : cat
        );
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        showNotification('success', 'הקטגוריה נוספה בהצלחה');
        return newCategory;
        
      } catch (error) {
        // במקרה של שגיאה - הסרת הקטגוריה הזמנית
        setCategories(prev => prev.filter(cat => cat.id !== tempId));
        console.error('Error creating category:', error);
        showNotification('error', error instanceof Error ? error.message : 'שגיאה ביצירת הקטגוריה');
        throw error;
      }
    },
    updateCategory: async (id: string, updates: Partial<Category>): Promise<void> => {
      const { count, ...serverUpdates } = updates;
      const originalCategory = categories.find(cat => cat.id === id);
      if (!originalCategory) return;

      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      ));

      if (Object.keys(serverUpdates).length > 0) {
        addToSyncQueue(async () => {
          try {
            await categoriesApi.updateCategory(id, serverUpdates);
          } catch (error) {
            setCategories(prev => prev.map(cat => 
              cat.id === id ? originalCategory : cat
            ));
            showNotification('error', 'שגיאה בעדכון הקטגוריה');
          }
        });
      }
    },
    deleteCategory: async (id: string) => {
      const categoryToDelete = categories.find(cat => cat.id === id);
      if (!categoryToDelete) return;

      // מחיקה מיידית מה-UI
      setCategories(prev => prev.filter(cat => cat.id !== id));
      showNotification('success', 'הקטגוריה נמחקה בהצלחה');

      // סנכרון עם השרת ברקע
      addToSyncQueue(async () => {
        try {
          await categoriesApi.deleteCategory(id);
        } catch (error) {
          // החזרת המצב הקודם במקרה של שגיאה
          if (categoryToDelete) {
            setCategories(prev => [...prev, categoryToDelete]);
          }
          showNotification('error', 'שגיאה במחיקת הקטגוריה');
        }
      });
    },
    notification,
    showNotification,
    toggleTaskCompletion,
    toggleTaskFavorite,
    setCategories,
  };

  // עדכון אוטומטי של הקאונטרים כשהמשימות משתנות
  useEffect(() => {
    const updateCounts = () => {
      setCategories(prev => prev.map(category => ({
        ...category,
        count: category.id === 'all' 
          ? tasks.length 
          : tasks.filter(task => task.category === category.id).length
      })));
    };
    
    updateCounts();
  }, [tasks]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
      {notification && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 
          px-4 py-2 rounded-lg shadow-lg z-[100] flex items-center gap-2
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          <div className="w-2 h-2 rounded-full bg-white"></div>
          {notification.message}
        </div>
      )}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 