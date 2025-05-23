import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../backend/supabase/config';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // אימות הסשן הנוכחי
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('שגיאה באימות הקישור');
          return;
        }

        // אם יש סשן תקין, לא נציג שגיאה
        if (session) {
          setError(null);
          return;
        }

        // קבלת הטוקן מה-URL
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        // רק אם אין סשן, נבדוק את הטוקן והסוג
        if (!token || (type !== 'recovery' && type !== 'passwordReset')) {
          setError('הקישור לא תקין או פג תוקף');
          return;
        }

        // שמירת הטוקן לשימוש בעדכון הסיסמה
        sessionStorage.setItem('reset_password_token', token);
      } catch (error) {
        console.error('Error in token verification:', error);
        setError('שגיאה באימות הקישור');
      }
    };

    verifyToken();
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setIsLoading(true);

    try {
      const token = sessionStorage.getItem('reset_password_token');
      if (!token) {
        throw new Error('לא נמצא טוקן תקין לאיפוס סיסמה');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      sessionStorage.removeItem('reset_password_token');
      navigate('/login', { 
        state: { message: 'הסיסמה שונתה בהצלחה. אנא התחבר עם הסיסמה החדשה.' }
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error instanceof Error ? error.message : 'שגיאה באיפוס הסיסמה');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            איפוס סיסמה
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              סיסמה חדשה
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="הכנס סיסמה חדשה"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              אימות סיסמה
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="הכנס את הסיסמה שוב"
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'מאפס...' : 'אפס סיסמה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 