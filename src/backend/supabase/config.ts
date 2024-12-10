import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../config/environment';

// יצירת מופע יחיד של הקליינט
const createSupabaseClient = (): SupabaseClient => {
  try {
    const client = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        // הגדרות אבטחה נוספות
        db: {
          schema: 'public'
        }
      }
    );
    
    return client;
  } catch (error) {
    console.error('שגיאה ביצירת חיבור ל-Supabase:', error);
    throw new Error('נכשל ביצירת חיבור לדאטאבייס');
  }
};

// יצירת מופע יחיד של הקליינט
export const supabase = createSupabaseClient();

// פונקציית עזר לבדיקת חיבור
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('health_check').select('count');
    if (error) throw error;
    console.log('חיבור לדאטאבייס תקין');
    return true;
  } catch (error) {
    console.error('שגיאה בחיבור לדאטאבייס:', error);
    return false;
  }
}; 