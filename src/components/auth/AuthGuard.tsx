import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // מציג מסך טעינה בזמן בדיקת המצב
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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