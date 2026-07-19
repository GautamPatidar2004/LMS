import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, 
  Mail, 
  Lock, 
  Globe, 
  Settings, 
  Save, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function StudentProfile() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { profile } = useAuth();

  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'social' | 'account'>('personal');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: profile?.full_name || 'Alex Gautam',
    email: 'student@lms.com',
    occupation: 'Student / Aspiring Web Developer',
    bio: 'Passionate about React, frontend architecture, and building user-centric interfaces. Currently learning full-stack development.'
  });

  const [preferences, setPreferences] = useState({
    interests: ['Web Development', 'UI/UX Design'],
    weeklyGoal: '10',
    emailAnnouncements: true,
    emailReminders: false
  });

  const [socials, setSocials] = useState({
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Profile changes saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Password updated successfully!');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1000);
  };

  const AvatarIcon = () => (
    <svg viewBox="0 0 32 32" className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-blue-500/20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#bfdbfe" />
      <circle cx="16" cy="13" r="6" fill="#fed7aa" />
      <path d="M16 7C13.5 7 11 9 11 12C11 12.5 11.5 13 12 13C12.5 13 13 12.5 13 12C13 10.5 14.5 9 16 9C17.5 9 19 10.5 19 12C19 12.5 19.5 13 20 13C20.5 13 21 12.5 21 12C21 9 18.5 7 16 7Z" fill="#1e293b" />
      <circle cx="14" cy="13" r="1" fill="#1e293b" />
      <circle cx="18" cy="13" r="1" fill="#1e293b" />
      <path d="M14 16C14 17 15 18 16 18C17 18 18 17 18 16" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
      <path d="M6 28C6 22 10 20 16 20C22 20 26 22 26 28" fill="#1d5bf5" />
    </svg>
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
            isLight ? 'text-slate-805' : 'text-white'
          }`}>
            <User className="h-7 w-7 text-blue-600 dark:text-blue-500" />
            My Profile
          </h1>
          <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
            Manage your personal profile, learning goals, and account configuration.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-slide-up">
            <CheckCircle className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="flex flex-col gap-2">
            {[
              { id: 'personal', name: 'Personal Info', icon: User },
              { id: 'preferences', name: 'Learning Preferences', icon: Settings },
              { id: 'social', name: 'Social Links', icon: Globe },
              { id: 'account', name: 'Account Details', icon: Lock }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? isLight 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                      : isLight
                        ? 'hover:bg-slate-100 text-slate-600'
                        : 'hover:bg-slate-900 text-slate-450'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Form Content panel */}
          <div className={`lg:col-span-3 rounded-2xl border p-6 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            
            {/* 1. Personal Information */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
                  <AvatarIcon />
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-sm font-bold">Profile Avatar</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      PNG or JPG. Size should be under 2MB.
                    </p>
                    <div className="flex gap-2.5 mt-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          isLight ? 'hover:bg-slate-55 border-slate-200' : 'hover:bg-slate-800 border-slate-800'
                        }`}
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Full Name</label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={personalInfo.email}
                        className={`w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-xs font-semibold outline-none opacity-60 cursor-not-allowed ${
                          isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-slate-400'
                        }`}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Occupation / Headline</label>
                    <input
                      type="text"
                      value={personalInfo.occupation}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, occupation: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Biography</label>
                    <textarea
                      rows={4}
                      value={personalInfo.bio}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none resize-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-805/65 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            )}

            {/* 2. Learning Preferences */}
            {activeTab === 'preferences' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold mb-4">Interests / Focus Categories</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {['Web Development', 'Mobile Dev', 'AI & Machine Learning', 'UI/UX Design', 'Product Management', 'Data Science'].map((category) => {
                      const isSelected = preferences.interests.includes(category);
                      return (
                        <button
                          type="button"
                          key={category}
                          onClick={() => {
                            const updated = isSelected
                              ? preferences.interests.filter(i => i !== category)
                              : [...preferences.interests, category];
                            setPreferences({ ...preferences, interests: updated });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : isLight
                                ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50'
                                : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pb-6 border-b border-slate-100 dark:border-slate-800/60">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Weekly Study Goal (Hours)</label>
                  <select
                    value={preferences.weeklyGoal}
                    onChange={(e) => setPreferences({ ...preferences, weeklyGoal: e.target.value })}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-205 text-slate-700' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="5">5 Hours / week</option>
                    <option value="10">10 Hours / week</option>
                    <option value="15">15 Hours / week</option>
                    <option value="20">20+ Hours / week</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-3">Email Notification Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailAnnouncements}
                        onChange={(e) => setPreferences({ ...preferences, emailAnnouncements: e.target.checked })}
                        className="rounded border-slate-300 text-blue-605 focus:ring-blue-500/20 h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                        Receive course announcements & updates from instructors
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailReminders}
                        onChange={(e) => setPreferences({ ...preferences, emailReminders: e.target.checked })}
                        className="rounded border-slate-300 text-blue-605 focus:ring-blue-500/20 h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                        Receive daily learning goal reminders and stats
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-805/65 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            )}

            {/* 3. Social Links */}
            {activeTab === 'social' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={socials.linkedin}
                      onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">GitHub Profile</label>
                    <input
                      type="url"
                      value={socials.github}
                      onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Twitter / X Profile</label>
                    <input
                      type="url"
                      value={socials.twitter}
                      onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-805/65 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Links'}
                  </button>
                </div>
              </form>
            )}

            {/* 4. Account Details / Password Change */}
            {activeTab === 'account' && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold mb-1">Change Password</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-4">
                    Modify your account password security credentials.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPass}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className={`w-full rounded-xl border-0 py-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none ${
                        isLight ? 'bg-slate-50 text-slate-800 focus:bg-white' : 'bg-slate-950 text-white focus:bg-slate-950/80'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-805/65 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </StudentLayout>
  );
}
