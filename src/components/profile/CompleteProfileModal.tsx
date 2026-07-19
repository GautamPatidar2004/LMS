import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Input } from '../ui/Input';
import { createProfile } from '../../services/profile';
import { logout } from '../../services/auth';
import { Loader2 } from 'lucide-react';

interface CompleteProfileModalProps {
  isOpen: boolean;
  userId: string;
  userEmail?: string | null;
  onSuccess: () => void;
}

export default function CompleteProfileModal({ isOpen, userId, userEmail = null, onSuccess }: CompleteProfileModalProps) {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    if (!fullName.trim()) {
      setFieldError('Full Name is required');
      return;
    }

    setLoading(true);

    try {
      await createProfile(userId, fullName.trim(), 'student', userEmail);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAndSignOut = async () => {
    setError(null);
    setLoggingOut(true);
    try {
      await logout();
    } catch (err: any) {
      setError(err.message || 'Failed to log out. Please try again.');
      setLoggingOut(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} preventDismiss={true}>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Complete Your Profile
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            Please enter your name to complete registration.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs text-red-600" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={fieldError || undefined}
            disabled={loading || loggingOut}
            required
          />

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading || loggingOut}
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                'Continue'
              )}
            </button>

            <button
              type="button"
              onClick={handleCancelAndSignOut}
              disabled={loading || loggingOut}
              className="flex w-full justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
              ) : (
                'Cancel & Sign Out'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
