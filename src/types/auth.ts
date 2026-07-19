import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  isStudent: () => boolean;
  isTeacher: () => boolean;
  isAdmin: () => boolean;
}
