import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { UserRole } from './types';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EVOwnerDashboard } from './pages/ev-owner/Dashboard';
import { BuyerDashboard } from './pages/buyer/Dashboard';
import { CVADashboard } from './pages/cva/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case UserRole.EvOwner:
      return <Navigate to="/ev-owner/dashboard" replace />;
    case UserRole.Buyer:
      return <Navigate to="/buyer/dashboard" replace />;
    case UserRole.Cva:
      return <Navigate to="/cva/dashboard" replace />;
    case UserRole.Admin:
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600">Bạn không có quyền truy cập trang này</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/" element={<DashboardRouter />} />

          <Route
            path="/ev-owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.EvOwner]}>
                <EVOwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.Buyer]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cva/dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.Cva]}>
                <CVADashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
