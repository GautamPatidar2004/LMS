import React from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { Settings } from 'lucide-react';

export default function StudentSettings() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
            isLight ? 'text-slate-800' : 'text-white'
          }`}>
            <Settings className="h-7 w-7 text-blue-600 dark:text-blue-500" />
            Settings
          </h1>
          <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
            Manage your personal profile, email settings, and theme configurations.
          </p>
        </div>

        {/* Content Placeholder card */}
        <div className={`rounded-2xl border p-8 text-center flex flex-col items-center justify-center min-h-[300px] ${
          isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-905/50 border-slate-800/80 text-white'
        }`}>
          <div className="text-slate-300 dark:text-slate-700 mb-3">
            <Settings className="h-12 w-12 mx-auto stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-bold">Preferences not customized</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[250px]">
            Adjust account security, notification alerts, and accessibility configurations.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
