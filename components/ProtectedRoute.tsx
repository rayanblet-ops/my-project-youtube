import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  let userContext;
  try {
    userContext = useUser();
  } catch {
    return <Navigate to="/" replace />;
  }
  
  const { appwriteUser, isLoading } = userContext;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-black dark:text-white">Загрузка...</div>
      </div>
    );
  }

  if (!appwriteUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

