import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'count'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  notification: NotificationType | null;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // פונקציה לרענון הנתונים
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [newTasks, newCategories] = await Promise.all([
        tasksApi.getTasks(),
        categoriesApi.getCategories()
      ]);

      // עדכון מונה המשימות בקטגוריות
      const updatedCategories = newCategories.map(category => ({
        ...category,
        count: category.id === 'all' 
          ? newTasks.length 
          : newTasks.filter(task => task.category === category.id).length
      }));

      setTasks(newTasks);
      setCategories(updatedCategories);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // טעינת נתונים ראשונית
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  // עדכון הפונקציות עם הודעות
  const contextValue = {
    tasks,
    categories,
    isLoading,
    error,
    refreshData,
    createTask: async (task: Omit<Task, 'id'>) => {
      // יצירת ID זמני
      const tempId = crypto.randomUUID();
      
      try {
        // עדכון אופטימי של ה-state
        const tempTask = { ...task, id: tempId };
        setTasks(prev => [...prev, tempTask]);
        
        // שליחה לשרת
        const result = await tasksApi.createTask(task);
        
        // עדכון ה-state עם המשימה האמיתית
        setTasks(prev => prev.map(t => t.id === tempId ? result : t));
        
        showNotification('success', 'המשימה נוספה בהצלחה');
        return result;
      } catch (error) {
        // במקרה של שגיאה - מחיקת המשימה הזמנית
        setTasks(prev => prev.filter(t => t.id !== tempId));
        const message = error instanceof Error ? error.message : 'שגיאה ביצירת המשימה';
        showNotification('error', message);
        throw error;
      }
    },
    updateTask: async (id: string, updates: Partial<Task>) => {
      try {
        // עדכון אופטימי
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ));
        
        // שליחה לשרת
        const result = await tasksApi.updateTask(id, updates);
        showNotification('success', 'המשימה עודכנה בהצלחה');
        return result;
      } catch (error) {
        // במקרה של שגיאה - החזרת המצב הקודם
        await refreshData();
        const message = error instanceof Error ? error.message : 'שגיאה בעדכון המשימה';
        showNotification('error', message);
        throw error;
      }
    },
    deleteTask: async (id: string) => {
      // שמירת המשימה למקרה של שגיאה
      const taskToDelete = tasks.find(t => t.id === id);
      
      try {
        // מחיקה אופטימית
        setTasks(prev => prev.filter(t => t.id !== id));
        
        // מחיקה מהשרת
        await tasksApi.deleteTask(id);
        showNotification('success', 'המשימה נמחקה בהצלחה');
      } catch (error) {
        // במקרה של שגיאה - החזרת המשימה
        if (taskToDelete) {
          setTasks(prev => [...prev, taskToDelete]);
        }
        const message = error instanceof Error ? error.message : 'שגיאה במחיקת המשימה';
        showNotification('error', message);
        throw error;
      }
    },
    createCategory: async (category: Omit<Category, 'id' | 'count'>) => {
      try {
        const result = await categoriesApi.createCategory(category);
        showNotification('success', 'הקטגוריה נוספה בהצלחה');
        await refreshData();
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'שגיאה ביצירת הקטגוריה';
        showNotification('error', message);
        throw error;
      }
    },
    updateCategory: async (id: string, updates: Partial<Category>) => {
      try {
        const result = await categoriesApi.updateCategory(id, updates);
        showNotification('success', 'הקטגוריה עודכנה בהצלחה');
        await refreshData();
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'שגיאה בעדכון הקטגוריה';
        showNotification('error', message);
        throw error;
      }
    },
    deleteCategory: async (id: string) => {
      try {
        await categoriesApi.deleteCategory(id);
        showNotification('success', 'הקטגוריה נמחקה בהצלחה');
        await refreshData();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'שגיאה במחיקת הקטגוריה';
        showNotification('error', message);
        throw error;
      }
    },
    notification,
    showNotification
  };

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