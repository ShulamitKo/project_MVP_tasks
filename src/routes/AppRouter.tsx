import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthGuard } from '../components/auth/AuthGuard';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import App from '../App';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* ראוטים ציבוריים */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/auth/callback" element={<Navigate to="/" replace />} />
            
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
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRouter; 