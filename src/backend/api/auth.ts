import { supabase } from '../supabase/config';

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
    console.log('Sending reset password email with redirect to:', `${window.location.origin}/reset-password`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('Error sending reset password email:', error);
      if (error.message.includes('Email not found')) {
        throw new Error('כתובת האימייל לא נמצאה במערכת');
      }
      throw new Error('שגיאה בשליחת המייל לאיפוס סיסמה');
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