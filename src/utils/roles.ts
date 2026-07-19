import { UserRole } from '../types/auth';

/**
 * Returns the corresponding dashboard path for a given user role.
 * Utilizes TypeScript exhaustive checks to ensure compile-time safety when new roles are added.
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default: {
      const exhaustiveCheck: never = role;
      return '/login';
    }
  }
}
