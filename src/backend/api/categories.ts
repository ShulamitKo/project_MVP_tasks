import { supabase } from '../supabase/config';
import type { Category, Task, DBResponse } from '../types/models';

export const categoriesApi = {
  // הוספת קטגוריה חדשה
  async create(category: Omit<Category, 'id' | 'created_at'>): Promise<DBResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // קבלת כל הקטגוריות של המשתמש
  async getAll(userId: string): Promise<DBResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // בדיקה אם יש משימות בקטגוריה
  async hasActiveTasks(categoryId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);

      if (error) throw error;
      return (count || 0) > 0;
    } catch (error) {
      console.error('שגיאה בבדיקת משימות בקטגוריה:', error);
      return false;
    }
  },

  // מחיקת קטגוריה
  async delete(categoryId: string): Promise<DBResponse<null>> {
    try {
      // בדיקה אם יש משימות בקטגוריה
      const hasTasks = await this.hasActiveTasks(categoryId);
      
      if (hasTasks) {
        return {
          data: null,
          error: new Error('לא ניתן למחוק קטגוריה שיש בה משימות פעילות')
        };
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      return { data: null, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // עדכון קטגוריה
  async update(id: string, updates: Partial<Category>): Promise<DBResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // ספירת משימות בקטגוריה
  async getTaskCount(categoryId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('שגיאה בספירת משימות:', error);
      return 0;
    }
  }
}; 