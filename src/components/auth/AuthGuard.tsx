import { ReactNode, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  console.log('AuthGuard - user:', user);
  console.log('AuthGuard - loading:', loading);

  // מציג מסך טעינה בזמן בדיקת המצב
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // מציג הודעת שגיאה אם יש בעיית חיבור
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center">שגיאת התחברות</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  // מעביר למסך התחברות אם אין משתמש מחובר
  if (!user) {
    // שומר את המיקום הנוכחי כדי לחזור אליו אחרי ההתחברות
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated:', user); // לוג לבדיקה
  // מציג את תוכן הדף אם המשתמש מחובר
  return <>{children}</>;
};