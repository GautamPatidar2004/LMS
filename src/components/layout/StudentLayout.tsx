import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import { useTheme } from '../../contexts/ThemeContext';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  const isLight = theme === 'light';

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Sidebar navigation */}
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main panel layout */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        
        {/* Decorative background blobs - soft subtle details */}
        <div className={`absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none animate-float-slow-1 transition-all duration-1000 ${
          isLight ? 'bg-violet-400/5' : 'bg-violet-600/5'
        }`} />
        <div className={`absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none animate-float-slow-2 transition-all duration-1000 ${
          isLight ? 'bg-indigo-400/5' : 'bg-indigo-600/5'
        }`} />

        {/* Global header layout */}
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic page content scroll wrapper */}
        <main className={`flex-1 overflow-y-auto px-6 py-8 md:px-8 scrollbar-thin scrollbar-track-transparent transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-b from-slate-55 from-slate-50 via-slate-50 to-slate-100/30 scrollbar-thumb-slate-200'
            : 'bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60 scrollbar-thumb-slate-800'
        }`}>
          <div className="mx-auto max-w-7xl animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
