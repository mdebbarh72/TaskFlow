import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { authenticated, loading, isBanned } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-surface)]">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--color-surface-container-high)] border-t-[var(--color-primary)] animate-spin"></div>
      </div>
    );
  }

  if (!authenticated) return <Navigate to="/login" replace />;
  if (isBanned) return <Navigate to="/banned" replace />;

  return <Outlet />;
};

export default PrivateRoute;
