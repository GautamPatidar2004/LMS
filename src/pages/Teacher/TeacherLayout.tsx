import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import TeacherSidebar from './TeacherSidebar';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';

interface TeacherLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TeacherLayout({ children, activeTab, setActiveTab }: TeacherLayoutProps) {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFullName = () => {
    return profile?.full_name || 'John Doe';
  };

  const getFirstName = () => {
    return getFullName().split(' ')[0];
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0b0c10] text-slate-100'
    }`}>
      
      {/* Sidebar Layout */}
      <TeacherSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Panel Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        
        {/* Soft background decor spots */}
        <div className={`absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
          isLight ? 'bg-violet-400/5' : 'bg-violet-500/5'
        }`} />
        
        {/* Top Header Layout */}
        <header className={`flex h-16 w-full items-center justify-between px-6 transition-all duration-300 border-b shrink-0 ${
          isLight ? 'border-slate-100 bg-white' : 'border-slate-850 bg-[#0f111a]/40 backdrop-blur-xl'
        }`}>
          {/* Left: Mobile hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl md:hidden transition-all duration-200 ${
                isLight ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-450 hover:bg-slate-900/50'
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden sm:block">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Good morning, Coach! 👋
              </span>
              <h2 className={`text-sm font-black tracking-tight -mt-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Welcome back, {getFullName()}
              </h2>
            </div>
          </div>

          {/* Center: Search pill */}
          <div className="flex-1 max-w-sm mx-4 md:block hidden">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="search"
                placeholder="Search students, courses, lectures..."
                className={`w-full rounded-full border-0 py-2 pl-11 pr-4 text-xs font-medium outline-none transition-all duration-300 ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 placeholder-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-violet-500/10'
                    : 'bg-slate-900/60 text-slate-200 placeholder-slate-500 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20'
                }`}
              />
            </div>
          </div>

          {/* Right: Notifications, theme, profile dropdown */}
          <div className="flex items-center gap-3">
            {/* Theme toggle switch */}
            <button
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-250 ${
                isLight ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-400 hover:bg-slate-900/50'
              }`}
              title="Toggle theme mode"
            >
              {isLight ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-yellow-450" />}
            </button>

            {/* Notification alert icons */}
            <button className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
              isLight ? 'text-slate-500 hover:bg-slate-55' : 'text-slate-400 hover:bg-slate-900/50'
            }`}>
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-violet-600 ring-2 ring-white dark:ring-slate-950" />
            </button>

            <button className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
              isLight ? 'text-slate-500 hover:bg-slate-55' : 'text-slate-400 hover:bg-slate-900/50'
            }`}>
              <MessageSquare className="h-4.5 w-4.5" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#1d5bf5] ring-2 ring-white dark:ring-slate-950" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                  isLight
                    ? 'border-slate-100 hover:bg-slate-50 bg-slate-50/50'
                    : 'border-slate-850 hover:bg-slate-900 bg-slate-900/30'
                }`}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={getFullName()}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="h-6 w-6 rounded-full bg-violet-600/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-[10px] font-black uppercase">
                    {getFirstName().charAt(0)}
                  </span>
                )}
                <div className="text-left hidden lg:block pr-1">
                  <span className={`text-[11px] font-black block leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    {getFirstName()}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                    Coach
                  </span>
                </div>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className={`absolute right-0 mt-2.5 w-44 rounded-xl border p-1.5 shadow-lg z-50 animate-slide-in ${
                  isLight ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'
                }`}>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setActiveTab('profile');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                      isLight ? 'text-slate-650 hover:bg-slate-50' : 'text-slate-350 hover:bg-slate-800'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setActiveTab('settings');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                      isLight ? 'text-slate-650 hover:bg-slate-50' : 'text-slate-350 hover:bg-slate-800'
                    }`}
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`} />

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic page content scroll wrapper */}
        <main className={`flex-1 overflow-y-auto px-6 py-6 md:px-8 scrollbar-thin scrollbar-track-transparent transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/30 scrollbar-thumb-slate-200'
            : 'bg-gradient-to-b from-[#0b0c10] via-[#0b0c10] to-[#0f111a]/70 scrollbar-thumb-slate-800'
        }`}>
          <div className="mx-auto max-w-[1400px] animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
