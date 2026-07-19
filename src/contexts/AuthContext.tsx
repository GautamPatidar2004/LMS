import React, { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, UserRole, AuthContextType } from '../types/auth';
import { getProfile, createProfile } from '../services/profile';
import { logout as authLogout } from '../services/auth';
import CompleteProfileModal from '../components/profile/CompleteProfileModal';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Refs to prevent closures bugs, race conditions, and infinite listener setups
  const activeFetchUserId = useRef<string | null>(null);
  const currentUserRef = useRef<string | null>(null);
  const profileRef = useRef<Profile | null>(null);

  // Sync profile state with a mutable ref to read inside listeners without stale closures
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Sync user state with a ref to track the currently active session user
  useEffect(() => {
    currentUserRef.current = user?.id || null;
  }, [user]);

  // Reusable loadProfile implementation with concurrency lock and cancellation check
  const loadProfile = useCallback(async (currentUser: User) => {
    if (activeFetchUserId.current === currentUser.id) return;
    activeFetchUserId.current = currentUser.id;
    setProfileError(null);

    try {
      const dbProfile = await getProfile(currentUser.id);
      
      // Safety check: abort if the user logged out/switched accounts during the network request
      if (currentUserRef.current !== currentUser.id) return;

      if (dbProfile) {
        if (!dbProfile.email && currentUser.email) {
          // Backfill email in background
          supabase
            .from('profiles')
            .update({ email: currentUser.email })
            .eq('id', currentUser.id)
            .then(({ error }) => {
              if (error) console.error('Error backfilling profile email:', error);
            });
          dbProfile.email = currentUser.email;
        }
        setProfile(dbProfile);
      } else {
        const fullName = currentUser.user_metadata?.full_name;
        if (fullName) {
          const newProfile = await createProfile(currentUser.id, fullName, 'student', currentUser.email);
          if (currentUserRef.current === currentUser.id) {
            setProfile(newProfile);
          }
        } else {
          setShowProfileModal(true);
        }
      }
    } catch (err: any) {
      console.error('Error synchronizing database profile:', err);
      // Double check active user before setting error state
      if (currentUserRef.current === currentUser.id) {
        setProfileError(err.message || 'An error occurred while loading your profile.');
      }
    } finally {
      if (activeFetchUserId.current === currentUser.id) {
        activeFetchUserId.current = null;
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const dbProfile = await getProfile(user.id);
        if (dbProfile && currentUserRef.current === user.id) {
          setProfile(dbProfile);
        }
      } catch (err: any) {
        console.error('Error refreshing profile:', err);
        setProfileError(err.message || 'Failed to refresh profile.');
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setShowProfileModal(false);
      setLoading(false);
    }
  }, []);

  const isStudent = useCallback(() => profile?.role === 'student', [profile]);
  const isTeacher = useCallback(() => profile?.role === 'teacher', [profile]);
  const isAdmin = useCallback(() => profile?.role === 'admin', [profile]);

  useEffect(() => {
    let mounted = true;

    // Session restoration
    const restoreSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted && initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          currentUserRef.current = initialSession.user.id;
          await loadProfile(initialSession.user);
        }
      } catch (err) {
        console.error('Failed to restore session on mount:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    // Event listener for auth changes (profile omitted from dependencies to prevent infinite sockets)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
            currentUserRef.current = currentSession.user.id;

            const cachedProfile = profileRef.current;
            // Fetch profile only if not cached for the current user
            if (!cachedProfile || cachedProfile.id !== currentSession.user.id) {
              setLoading(true);
              await loadProfile(currentSession.user);
              setLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          currentUserRef.current = null;
          setShowProfileModal(false);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]); // Removed 'profile' dependency to prevent socket recreation loop

  const isAuthenticated = useMemo(() => user !== null && profile !== null, [user, profile]);
  const role = useMemo(() => profile?.role || null, [profile]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      loading,
      isAuthenticated,
      refreshProfile,
      logout,
      isStudent,
      isTeacher,
      isAdmin,
    }),
    [user, session, profile, role, loading, isAuthenticated, refreshProfile, logout, isStudent, isTeacher, isAdmin]
  );

  const handleProfileSuccess = async () => {
    setShowProfileModal(false);
    if (user) {
      setLoading(true);
      await loadProfile(user);
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setProfileError(null);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        currentUserRef.current = currentSession.user.id;
        await loadProfile(currentSession.user);
      }
    } catch (err: any) {
      setProfileError(err.message || 'Failed to reconnect.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutFromError = async () => {
    setProfileError(null);
    setLoading(true);
    try {
      await authLogout();
    } catch (err) {
      console.error('Sign out failed from error page:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setShowProfileModal(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Global Connection Error Retry Screen */}
      {profileError && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-red-600">Connection Error</h3>
              <p className="text-sm text-slate-600">{profileError}</p>
            </div>
            
            <div className="space-y-2 pt-2">
              <button
                onClick={handleRetry}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-lg shadow-red-600/20 transition-all duration-200"
              >
                Retry Connection
              </button>
              
              <button
                onClick={handleSignOutFromError}
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global complete profile modal overlay for google logins */}
      {user && showProfileModal && (
        <CompleteProfileModal
          isOpen={showProfileModal}
          userId={user.id}
          userEmail={user.email || null}
          onSuccess={handleProfileSuccess}
        />
      )}
    </AuthContext.Provider>
  );
}
