import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types/auth';

/**
 * Custom hook to safely consume the global AuthContext.
 * Throws a descriptive developer error if used outside an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure to wrap your application component tree.');
  }
  return context;
}
