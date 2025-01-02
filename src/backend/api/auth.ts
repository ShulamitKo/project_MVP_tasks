import { supabase } from '../supabase/config';
import { environment } from '../config/environment';

export const authApi = {
  // הפונקציות הקיימות נשארות
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // נוסיף את הפונקציות החדשות
  async sendResetPasswordEmail(email: string): Promise<void> {
    console.log('Starting password reset for email:', email);
    
    try {
      // בסביבת ייצור נשתמש בדומיין הספציפי
      const redirectUrl = import.meta.env.PROD 
        ? 'https://project-mvp-tasks-git-main-yamyafe-gmailcoms-projects.vercel.app/auth/reset-password'
        : `${window.location.origin}/auth/reset-password`;

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      console.log('Reset password response:', { data, error });

      if (error) {
        console.error('Error sending reset password email:', error);
        if (error.message.includes('Email not found')) {
          throw new Error('כתובת האימייל לא נמצאה במערכת');
        }
        throw new Error('שגיאה בשליחת המייל לאיפוס סיסמה');
      }
    } catch (error: any) {
      console.error('Error sending reset password email:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('אין חיבור לאינטרנט, אנא בדוק את החיבור שלך ונסה שוב');
      }
      throw error;
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Error updating password:', error);
      throw new Error('שגיאה בעדכון הסיסמה');
    }
  }
}; 