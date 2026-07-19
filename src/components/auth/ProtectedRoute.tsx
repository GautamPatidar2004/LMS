import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';
import { getDashboardRoute } from '../../utils/roles';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but role isn't resolved yet, block render (modal complete profile or fetch active)
  if (!role) {
    return null;
  }

  // If user's role does not match allowed roles, redirect to their corresponding dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }

  return <>{children}</>;
}
