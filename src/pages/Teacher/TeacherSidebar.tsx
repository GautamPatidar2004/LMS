import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FolderOpen,
  Users,
  BarChart3,
  Star,
  Award,
  FileBarChart2,
  FolderLock,
  Megaphone,
  Briefcase,
  User,
  Settings,
  HelpCircle,
  FileText,
  X
} from 'lucide-react';

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherSidebar({ activeTab, setActiveTab, isOpen, onClose }: TeacherSidebarProps) {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const isLight = theme === 'light';

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', name: 'My Courses', icon: BookOpen },
        { id: 'library', name: 'Content Library', icon: FolderOpen },
        { id: 'students', name: 'Students', icon: Users },
        { id: 'analytics', name: 'Analytics', icon: BarChart3 },
        { id: 'reviews', name: 'Reviews', icon: Star },
        { id: 'certificates', name: 'Certificates', icon: Award },
        { id: 'reports', name: 'Reports', icon: FileBarChart2 },
      ]
    },
    {
      title: 'TOOLS',
      items: [
        { id: 'resources', name: 'Resources', icon: FolderLock },
        { id: 'marketing', name: 'Marketing Tools', icon: Briefcase },
        { id: 'announcements', name: 'Announcements', icon: Megaphone },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'settings', name: 'Settings', icon: Settings },
        { id: 'help', name: 'Help & Support', icon: HelpCircle },
        { id: 'terms', name: 'Terms & Conditions', icon: FileText },
      ]
    }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-45 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 md:sticky md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isLight
            ? 'border-slate-100 bg-white text-slate-700'
            : 'border-slate-800 bg-[#0f111a] text-slate-400'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-md shadow-violet-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className={`text-base font-black tracking-wide block ${isLight ? 'text-slate-850' : 'text-white'}`}>
                LMS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500 -mt-1 block">
                Teacher
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border md:hidden ${
              isLight
                ? 'border-slate-200 text-slate-500 hover:bg-slate-50'
                : 'border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-none">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <span className="px-4 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id || (item.id === 'courses' && (activeTab === 'edit' || activeTab === 'curriculum'));
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? isLight
                            ? 'bg-violet-50 text-violet-600'
                            : 'bg-violet-600/10 text-violet-400'
                          : isLight
                            ? 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-violet-600 dark:bg-violet-500" />
                      )}
                      <Icon
                        className={`h-4.5 w-4.5 transition-transform duration-250 ${
                          isActive
                            ? isLight ? 'text-violet-600' : 'text-violet-400'
                            : isLight ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Teaching Tips Box */}
        <div className="p-4 border-t border-transparent shrink-0">
          <div className={`rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden ${
            isLight ? 'bg-violet-50/50' : 'bg-slate-900/40 border border-slate-800/60'
          }`}>
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-500/5 blur-xl" />
            
            <div className="h-9 w-9 rounded-xl bg-violet-600/10 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-2">
              <GraduationCap className="h-5 w-5" />
            </div>

            <h4 className={`text-xs font-black relative z-10 ${isLight ? 'text-slate-800' : 'text-white'}`}>
              Teaching Tips
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal max-w-[145px] relative z-10">
              Break down complex topics into small, engaging lectures.
            </p>
            <button
              onClick={() => setActiveTab('help')}
              className="mt-3 w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-xl transition-all shadow-md shadow-violet-600/15 hover:scale-[1.01]"
            >
              View Tips
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
