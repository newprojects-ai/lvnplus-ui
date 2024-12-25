import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAllowedRole = user && allowedRoles?.some(role => 
    user.roles.map(r => r.toUpperCase()).includes(role.toUpperCase())
  );

  console.log('ProtectedRoute - Has Allowed Role:', hasAllowedRole);

  if (allowedRoles && !hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}