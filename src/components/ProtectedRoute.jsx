import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallbackPath = '/login' 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Initialize auth service if not already done
        await authService.init();
        
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Check role-based access
          let accessGranted = true;

          if (requiredRole) {
            accessGranted = authService.hasRole(requiredRole);
          }

          if (requiredPermission && accessGranted) {
            accessGranted = authService.hasPermission(requiredPermission);
          }

          setHasAccess(accessGranted);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user, profile) => {
      setIsAuthenticated(!!user);
      
      if (user && profile) {
        let accessGranted = true;

        if (requiredRole) {
          accessGranted = profile.role === requiredRole;
        }

        if (requiredPermission && accessGranted) {
          accessGranted = authService.hasPermission(requiredPermission);
        }

        setHasAccess(accessGranted);
      } else {
        setHasAccess(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) {unsubscribe();}
    };
  }, [requiredRole, requiredPermission]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Show access denied if authenticated but lacks required permissions
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            {requiredRole && ` Required role: ${requiredRole}`}
            {requiredPermission && ` Required permission: ${requiredPermission}`}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
}

// Higher-order component for easier usage
export function withProtection(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking permissions in components
export function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
    profile: authService.getUserProfile(),
    loading: false
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user, profile) => {
      setAuthState({
        isAuthenticated: !!user,
        user,
        profile,
        loading: false
      });
    });

    return unsubscribe;
  }, []);

  const hasRole = (role) => authService.hasRole(role);
  const hasPermission = (permission) => authService.hasPermission(permission);
  const signOut = () => authService.signOut();
  const updateProfile = (profileData) => authService.updateProfile(profileData);

  return {
    ...authState,
    hasRole,
    hasPermission,
    signOut,
    updateProfile
  };
} 