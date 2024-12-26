import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DataProvider } from '../contexts/DataContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { AuthGuard } from '../components/auth/AuthGuard';
import { LoginForm } from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import ResetPassword from '../components/auth/ResetPassword';
import App from '../App';
import { EmailVerificationHandler } from '../components/auth/EmailVerificationHandler';

// קומפוננטת עטיפה לבדיקת הטוקן
const ResetPasswordWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(() => {
    // בדיקה אם כבר יש טוקן תקין ב-sessionStorage
    return sessionStorage.getItem('reset_password_token') !== null;
  });

  useEffect(() => {
    console.log('Reset Password Route:', location);
    console.log('Search params:', location.search);
    console.log('Hash:', location.hash);

    // אם כבר יש טוקן תקין, לא צריך לבדוק שוב
    if (sessionStorage.getItem('reset_password_token')) {
      console.log('Valid token found in session storage');
      setIsValidToken(true);
      return;
    }

    const hash = location.hash;
    const hashParams = new URLSearchParams(hash.replace('#', ''));

    // בדיקה אם יש שגיאה בהאש
    if (hashParams.get('error') === 'access_denied' || hashParams.get('error_code') === 'otp_expired') {
      console.log('Token expired or invalid, redirecting to forgot password');
      navigate('/forgot-password', { 
        state: { 
          error: 'הקישור לאיפוס הסיסמה פג תוקף. אנא בקש קישור חדש.',
          expired: true
        },
        replace: true
      });
      return;
    }

    // בדיקת האש תקין - אם יש access_token
    const accessToken = hashParams.get('access_token');
    if (accessToken) {
      console.log('Valid access token found, saving to session storage');
      sessionStorage.setItem('reset_password_token', accessToken);
      setIsValidToken(true);
      return;
    }

    // אם הגענו לכאן, אין טוקן תקין
    console.log('No valid token found, redirecting to forgot password');
    navigate('/forgot-password', { 
      state: { 
        error: 'הקישור לאיפוס הסיסמה אינו תקין. אנא בקש קישור חדש.',
        invalid: true
      },
      replace: true
    });
  }, [location, navigate]);

  // מציגים את הקומפוננטה רק אם יש טוקן תקין
  return isValidToken ? <ResetPassword /> : null;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AccessibilityProvider>
              <Routes>
                {/* ראוטים ציבוריים */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordWrapper />} />
                <Route path="/auth/callback" element={<EmailVerificationHandler />} />
                <Route 
                  path="/auth/reset-password" 
                  element={<Navigate to={`/reset-password${window.location.search}${window.location.hash}`} replace />} 
                />
                
                {/* ראוטים מאובטחים */}
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <App />
                    </AuthGuard>
                  }
                />

                {/* הפניה לדף הבית במקרה של נתיב לא ים */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AccessibilityProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRouter; 