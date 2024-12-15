import { supabase } from '../supabase/config';
import { Category } from '../../types/category';

export interface CategoryDTO {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const categoriesApi = {
  // קבלת כל הקטגוריות של המשתמש
  async getCategories(): Promise<Category[]> {
    try {
      console.log('Fetching categories...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log('Categories fetched:', data);
      return [
        { id: 'all', name: 'הכל', color: 'blue', count: 0 },
        ...(data?.map(categoryDTO => ({
          id: categoryDTO.id,
          name: categoryDTO.name,
          color: categoryDTO.color,
          count: 0
        })) || [])
      ];

    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // במקרה של בעיית חיבור, נחזיר לפחות את קטגוריית 'הכל'
      return [{ id: 'all', name: 'הכל', color: 'blue', count: 0 }];
    }
  },

  // הוספת קטגוריה חדשה
  async createCategory(category: Omit<Category, 'id' | 'count'>): Promise<Category> {
    try {
      console.log('Creating category:', category);
      
      // בדיקת חיבור לאינטרנט
      if (!navigator.onLine) {
        throw new Error('אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שוב.');
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('לא נמצא משתמש מחובר. אנא התחבר מחדש.');
      }

      // בדיקה אם כבר קיימת קטגוריה עם אותו שם למשתמש זה
      const { data: existingCategories, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', category.name);

      if (checkError) {
        console.error('Error checking existing category:', checkError);
        throw new Error('שגיאה בבדיקת קטגוריות קיימות');
      }

      if (existingCategories && existingCategories.length > 0) {
        throw new Error('קטגוריה בשם זה כבר קיימת');
      }

      // יצירת הקטגוריה החדשה
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          color: category.color,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        throw new Error('שגיאה ביצירת הקטגוריה');
      }

      console.log('Category created:', data);
      return {
        id: data.id,
        name: data.name,
        color: data.color,
        count: 0
      };

    } catch (error) {
      console.error('Failed to create category:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('שגיאה ביצירת קטגוריה. אנא נסה שוב מאוחר יותר.');
    }
  },

  // עדכון קטגוריה קיימת
  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'count'>>): Promise<Category> {
    console.log('Updating category:', { id, updates });
    
    // קבלת המשתמש הנוכחי
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    // בדיקה שהקטגוריה שייכת למשתמש
    if (id !== 'all') {  // מתעלם מקטגוריית 'הכל' המיוחדת
      const { data: categoryData, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (checkError || !categoryData) {
        console.error('Error checking category ownership:', checkError);
        throw new Error('Category not found or unauthorized');
      }
    }

    // אם זו קטגוריית 'הכל', לא מבצעים עדכון בדאטאבייס
    if (id === 'all') {
      return {
        id: 'all',
        name: 'הכל',
        color: 'blue',
        count: 0
      };
    }

    // עדכון הקטגוריה
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)  // וידוא שמעדכנים רק קטגוריות של המשתמש
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    console.log('Category updated:', data);
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      count: 0  // מתעדכן בצד הקליינט
    };
  },

  // מחיקת קטגוריה
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 