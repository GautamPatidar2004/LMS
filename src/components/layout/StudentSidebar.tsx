import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Award,
  Heart,
  MessageSquare,
  User,
  Settings,
  X,
  GraduationCap,
  Presentation
} from 'lucide-react';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  const { theme } = useTheme();
  const location = useLocation();

  const isLight = theme === 'light';

  // Menu items for Course Marketplace + Learning Management System
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Browse Courses',
      path: '/student/browseCourse',
      icon: Compass,
    },
    {
      name: 'My Courses',
      path: '/student/courses',
      icon: BookOpen,
    },
    {
      name: 'Certificates',
      path: '/student/certificates',
      icon: Award,
    },
    {
      name: 'Wishlist',
      path: '/student/wishlist',
      icon: Heart,
    },
    {
      name: 'Webinars & Workshops',
      path: '/student/webinars',
      icon: Presentation,
    },
    {
      name: 'Messages',
      path: '/student/messages',
      icon: MessageSquare,
    },
    {
      name: 'Profile',
      path: '/student/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/student/settings',
      icon: Settings,
    }
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className={`fixed inset-0 z-45 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isLight ? 'bg-slate-950/20' : 'bg-slate-950/80'
            }`}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r transition-all duration-300 ease-in-out md:sticky md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isLight
            ? 'border-slate-100 bg-white text-slate-700'
            : 'border-slate-800/80 bg-slate-950 text-slate-400 backdrop-blur-xl'
          }`}
      >
        {/* Header/Branding */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d5bf5] shadow-md shadow-blue-500/10 transform hover:rotate-6 transition-transform duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className={`text-lg font-black tracking-wide block ${isLight ? 'text-slate-850' : 'text-white'
                }`}>
                LMS
              </span>
              <span className={`text-[11px] font-semibold -mt-1 block ${isLight ? 'text-slate-400' : 'text-slate-505'
                }`}>
                Student
              </span>
            </div>
          </div>

          {/* Close button for mobile screen */}
          <button
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border md:hidden transition-all duration-200 ${isLight
              ? 'border-slate-200 bg-slate-50/50 text-slate-500 hover:text-slate-805 hover:bg-slate-100'
              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 scrollbar-none">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.name} className="px-1">
                <NavLink
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) => {
                    const base = "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250 group relative";
                    if (isActive) {
                      return `${base} ${isLight
                        ? 'bg-[#e8f1ff] text-[#1d5bf5]'
                        : 'bg-blue-600/15 text-blue-400'
                        }`;
                    }
                    return `${base} ${isLight
                      ? 'text-slate-505 hover:text-slate-808 hover:bg-slate-50/70'
                      : 'text-slate-450 hover:text-white hover:bg-slate-900/40'
                      }`;
                  }}
                >
                  {/* Subtle active vertical indicator pill */}
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-[#1d5bf5] dark:bg-blue-500" />
                  )}
                  <Icon
                    className={`h-4.5 w-4.5 transition-transform duration-250 group-hover:scale-110 ${isActive
                      ? isLight ? 'text-[#1d5bf5]' : 'text-blue-400'
                      : isLight ? 'text-slate-400 group-hover:text-slate-655' : 'text-slate-500 group-hover:text-slate-350'
                      }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* Bottom Study Tips Illustration Card */}
        <div className="p-4 mt-auto">
          <div className={`rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden ${isLight ? 'bg-[#f4f7ff]' : 'bg-slate-900/50 border border-slate-800/60'
            }`}>
            {/* Soft decorative blur circles inside the card */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-400/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />

            {/* SVG Illustration */}
            <svg viewBox="0 0 200 120" className="w-28 h-16 mb-2 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Table/surface */}
              <path d="M20 95H180" stroke={isLight ? '#e2e8f0' : '#334155'} strokeWidth="3" strokeLinecap="round" />

              {/* Tiny stack of books */}
              <rect x="35" y="83" width="24" height="6" rx="1.5" fill="#a855f7" />
              <rect x="38" y="89" width="20" height="6" rx="1.5" fill="#f43f5e" />

              {/* Person illustration */}
              <circle cx="100" cy="45" r="12" fill="#fed7aa" />
              {/* Hair */}
              <path d="M88 44C88 37 93 33 100 33C107 33 112 37 112 44C112 46 109 44 100 44C91 44 88 46 88 44Z" fill="#1e293b" />
              {/* Body reading */}
              <path d="M80 95C80 80 88 72 100 72C112 72 120 80 120 95" fill={isLight ? '#cbd5e1' : '#475569'} />

              {/* Small glowing screen/book */}
              <path d="M92 78L82 92" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
              <path d="M108 78L118 92" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

              {/* Floating stars of inspiration */}
              <path d="M145 35L147 39L151 40L147 41L145 45L143 41L139 40L143 39L145 35Z" fill="#eab308" />
              <path d="M55 45L56.5 48L59.5 48.5L56.5 49L55 52L53.5 49L50.5 48.5L53.5 48L55 45Z" fill="#a855f7" />
            </svg>

            <h4 className={`text-xs font-bold leading-tight relative z-10 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              Keep learning,
            </h4>
            <h4 className={`text-xs font-bold leading-tight relative z-10 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              keep growing!
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal max-w-[140px] relative z-10">
              Stay consistent and achieve your goals.
            </p>
            <button className="mt-3 w-full py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[10px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-md shadow-purple-500/20 relative z-10">
              View Study Tips
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
