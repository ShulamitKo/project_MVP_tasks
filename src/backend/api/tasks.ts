import { supabase } from '../supabase/config';
import type { Task, DBResponse } from '../types/models';

export const tasksApi = {
  // הוספת משימה חדשה
  async create(task: Omit<Task, 'id' | 'created_at'>): Promise<DBResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // קבלת כל המשימות של המשתמש
  async getAll(userId: string): Promise<DBResponse<Task[]>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // עדכון משימה
  async update(id: string, updates: Partial<Task>): Promise<DBResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // מחיקת משימה
  async delete(id: string): Promise<DBResponse<null>> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      return { data: null, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}; 