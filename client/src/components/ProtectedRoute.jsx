import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from './ui/Skeleton';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen page-fade-in px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
