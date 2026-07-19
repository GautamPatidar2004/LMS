import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  BookOpen,
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';

interface StudentHeaderProps {
  onMenuClick: () => void;
}

export default function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock Notifications
  const notifications = [
    {
      id: 1,
      title: 'New assignment published',
      description: 'React Project 2 is now open for submission.',
      time: '15 mins ago',
      icon: BookOpen,
      iconColor: isLight ? 'text-blue-650 bg-blue-100' : 'text-blue-400 bg-blue-500/10',
      unread: true,
    },
    {
      id: 2,
      title: 'Grade updated',
      description: 'Your quiz "React Components" has been graded. Score: 84%',
      time: '2 hours ago',
      icon: Calendar,
      iconColor: isLight ? 'text-emerald-650 bg-emerald-100' : 'text-emerald-400 bg-emerald-500/10',
      unread: true,
    },
    {
      id: 3,
      title: 'Live class announcement',
      description: 'Live class with John Doe starts in 10 mins.',
      time: '1 day ago',
      icon: MessageSquare,
      iconColor: isLight ? 'text-cyan-650 bg-cyan-100' : 'text-cyan-400 bg-cyan-500/10',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'Alex';
  };

  const AvatarIcon = () => (
    <svg viewBox="0 0 32 32" className="h-8 w-8 rounded-full overflow-hidden shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <header className={`flex h-16 w-full items-center justify-between px-6 transition-all duration-300 border-b ${
      isLight ? 'border-slate-100 bg-white' : 'border-slate-900 bg-slate-950/45 backdrop-blur-xl'
    }`}>
      
      {/* Left: Sidebar Toggle Hamburger */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
            isLight
              ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center: Clean Pill Search Interface */}
      <div className="flex-1 max-w-md mx-4 sm:block hidden">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="search"
            placeholder="Search for courses, lectures, tests..."
            className={`w-full rounded-full border-0 py-2.5 pl-11 pr-4 text-[11px] font-medium outline-none transition-all duration-300 ${
              isLight
                ? 'bg-[#f3f5f9] text-slate-700 placeholder-slate-400/90 focus:bg-[#f3f5f9]/80 focus:ring-2 focus:ring-blue-500/10'
                : 'bg-slate-900 text-slate-200 placeholder-slate-505 focus:bg-slate-900/80 focus:ring-2 focus:ring-blue-500/20'
            }`}
          />
        </div>
      </div>

      {/* Right: Notification Bell, Calendar icon, Profile section */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle (subtle integration) */}
        <button
          onClick={toggleTheme}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-250 ${
            isLight
              ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
          title="Toggle light/dark mode"
        >
          {isLight ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-yellow-405" />}
        </button>

        {/* Calendar Shortcut Icon */}
        <button
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-250 ${
            isLight
              ? 'text-slate-505 hover:text-slate-808 hover:bg-slate-50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
          title="View Calendar"
        >
          <Calendar className="h-4.5 w-4.5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-250 ${
              notificationsOpen
                ? isLight ? 'bg-slate-50 text-blue-600' : 'bg-slate-900 text-white'
                : isLight ? 'text-slate-505 hover:text-slate-808 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Content */}
          {notificationsOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-2xl border overflow-hidden z-50 animate-slide-up origin-top-right ${
              isLight ? 'bg-white border-slate-100 shadow-xl' : 'bg-slate-905 border-slate-800 shadow-2xl backdrop-blur-xl'
            }`}>
              <div className={`flex items-center justify-between border-b p-4 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}>
                <h3 className={`font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Notifications</h3>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                  {unreadCount} New
                </span>
              </div>
              <div className={`divide-y max-h-80 overflow-y-auto ${
                isLight ? 'divide-slate-100' : 'divide-slate-800/60'
              }`}>
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${
                        item.unread ? isLight ? 'bg-slate-50/20' : 'bg-slate-900/10' : ''
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className={`text-xs truncate ${
                            item.unread ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {item.title}
                          </p>
                          <span className={`text-[9px] shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{item.time}</span>
                        </div>
                        <p className={`text-[10px] mt-0.5 line-clamp-2 leading-relaxed ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile dropdown layout (Avatar + Hello stack + Down Chevron) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-2.5 rounded-xl p-1 text-left transition-all duration-200 ${
              isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900/50'
            }`}
          >
            <AvatarIcon />

            <div className="hidden flex-col items-start md:flex">
              <span className={`text-xs font-bold leading-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Hello, {getFirstName()}
              </span>
              <span className={`text-[10px] font-medium leading-none mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                View Profile
              </span>
            </div>
            
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
              profileOpen ? 'rotate-180 text-slate-600 dark:text-slate-400' : ''
            }`} />
          </button>

          {/* User Account Dropdown Content */}
          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-56 rounded-2xl border overflow-hidden z-50 animate-slide-up origin-top-right ${
              isLight ? 'bg-white border-slate-150 shadow-xl' : 'bg-slate-900 border-slate-800 shadow-2xl'
            }`}>
              <div className={`border-b p-4 ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-slate-950/20'}`}>
                <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{profile?.full_name || 'Alex User'}</p>
                <p className="text-[10px] text-slate-405 dark:text-slate-500 truncate mt-0.5 capitalize">{profile?.role || 'student'}</p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => setProfileOpen(false)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all ${
                    isLight
                      ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all ${
                    isLight
                      ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <SettingsIcon className="h-4 w-4 text-slate-400" />
                  Account Settings
                </button>
              </div>

              <div className={`border-t p-1.5 ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-slate-950/30'}`}>
                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    try {
                      await logout();
                    } catch (err) {
                      console.error('Logout error:', err);
                    }
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    isLight ? 'text-red-500 hover:bg-red-50' : 'text-red-400 hover:bg-red-950/20'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
