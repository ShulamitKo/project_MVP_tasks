import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DataProvider } from '../contexts/DataContext';
import { AuthGuard } from '../components/auth/AuthGuard';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import App from '../App';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* ראוטים ציבוריים */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/auth/callback" element={<Navigate to="/" replace />} />
              <Route path="/auth/reset-password" element={<Navigate to="/login" replace />} />
              
              {/* ראוטים מאובטחים */}
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <App />
                  </AuthGuard>
                }
              />

              {/* הפניה לדף הבית במקרה של נתיב לא קיים */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRouter; 