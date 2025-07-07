// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// 🔐 Auth checker
const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
};

// 🔒 Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/signup" replace />;
};

function App() {
  return (
    <Routes>
      {/* Default route: if authenticated, go to dashboard; otherwise, go to signup */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? "/dashboard" : "/signup"} replace />}
      />

      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
