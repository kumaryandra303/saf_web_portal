import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saf-red-50 to-saf-red-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-saf-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-saf-dark-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;











