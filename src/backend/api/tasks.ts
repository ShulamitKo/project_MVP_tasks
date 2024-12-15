import { supabase } from '../supabase/config';
import { Task } from '../../types/task';

export interface TaskDTO {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  due_time: string | null;
  priority: 'high' | 'medium' | 'low';
  location: string | null;
  reminder: number | null;
  repeat: string | null;
  is_completed: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export const tasksApi = {
  // קבלת כל המשימות של המשתמש
  async getTasks(): Promise<Task[]> {
    try {
      console.log('Fetching tasks...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log('Tasks fetched:', data);
      return data?.map(taskDTO => ({
        id: taskDTO.id,
        title: taskDTO.title,
        description: taskDTO.description || '',
        dueDate: taskDTO.due_date,
        dueTime: taskDTO.due_time || '',
        category: taskDTO.category_id || 'all',
        priority: taskDTO.priority,
        location: taskDTO.location || '',
        reminder: taskDTO.reminder?.toString() || '0',
        repeat: taskDTO.repeat || 'none',
        isCompleted: taskDTO.is_completed,
        isFavorite: taskDTO.is_favorite
      })) || [];

    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw new Error('שגיאה בטעינת המשימות. אנא בדוק את החיבור לאינטרנט ונסה שוב.');
    }
  },

  // הוספת משימה חדשה
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    console.log('Creating task:', task);
    const taskDTO = {
      title: task.title,
      description: task.description || null,
      due_date: task.dueDate,
      due_time: task.dueTime || null,
      category_id: task.category === 'all' ? null : task.category as string,
      priority: task.priority,
      location: task.location || null,
      reminder: task.reminder ? parseInt(task.reminder) : null,
      repeat: task.repeat || null,
      is_completed: task.isCompleted,
      is_favorite: task.isFavorite
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskDTO])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      dueDate: data.due_date,
      dueTime: data.due_time || '',
      category: data.category_id || 'all',
      priority: data.priority,
      location: data.location || '',
      reminder: data.reminder?.toString() || '0',
      repeat: data.repeat || 'none',
      isCompleted: data.is_completed,
      isFavorite: data.is_favorite
    };
  },

  // עדכון משימה קיימת
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const updateDTO = {
      ...(updates.title && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description || null }),
      ...(updates.dueDate && { due_date: updates.dueDate }),
      ...(updates.dueTime !== undefined && { due_time: updates.dueTime || null }),
      ...(updates.category && { category_id: updates.category === 'all' ? null : updates.category as string }),
      ...(updates.priority && { priority: updates.priority }),
      ...(updates.location !== undefined && { location: updates.location || null }),
      ...(updates.reminder && { reminder: parseInt(updates.reminder) }),
      ...(updates.repeat && { repeat: updates.repeat }),
      ...(updates.isCompleted !== undefined && { is_completed: updates.isCompleted }),
      ...(updates.isFavorite !== undefined && { is_favorite: updates.isFavorite })
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateDTO)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      dueDate: data.due_date,
      dueTime: data.due_time || '',
      category: data.category_id || 'all',
      priority: data.priority,
      location: data.location || '',
      reminder: data.reminder?.toString() || '0',
      repeat: data.repeat || 'none',
      isCompleted: data.is_completed,
      isFavorite: data.is_favorite
    };
  },

  // מחיקת משימה
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 