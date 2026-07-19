import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, LogOut, User as UserIcon, Mail, Shield, Calendar, Key } from 'lucide-react';

interface DashboardCardProps {
  title: string;
}

export default function DashboardCard({ title }: DashboardCardProps) {
  const { user, profile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    setLoggingOut(true);
    try {
      await logout();
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout.');
      setLoggingOut(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-slate-400 text-sm">
            Verify your account details and credentials below
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-950/50 border border-red-900/50 p-4 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}

        {/* Dashboard Card Container */}
        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-3">
            Authenticated User Information
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <UserIcon className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Full Name</p>
                <p className="text-slate-200 font-medium">{profile.full_name}</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Address</p>
                <p className="text-slate-200 font-medium">{user.email}</p>
              </div>
            </div>

            {/* User Role */}
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Role</p>
                <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/30 capitalize mt-1">
                  {profile.role}
                </span>
              </div>
            </div>

            {/* User Unique ID */}
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div className="w-full">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">User ID</p>
                <code className="text-xs text-slate-300 font-mono block break-all select-all mt-1 bg-slate-950 p-2.5 rounded border border-slate-800">
                  {user.id}
                </code>
              </div>
            </div>

            {/* Account Created At Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Created At</p>
                <p className="text-slate-200 font-medium">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
