import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardRoute } from '../../utils/roles';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  // If user is already logged in and role is resolved, redirect to their dashboard
  if (user && role) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }

  return <>{children}</>;
}
