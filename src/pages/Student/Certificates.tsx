import React from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { Award } from 'lucide-react';

export default function StudentCertificates() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
            isLight ? 'text-slate-800' : 'text-white'
          }`}>
            <Award className="h-7 w-7 text-blue-600 dark:text-blue-500" />
            Certificates
          </h1>
          <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
            View and download your earned course completion certificates.
          </p>
        </div>

        {/* Content Placeholder card */}
        <div className={`rounded-2xl border p-8 text-center flex flex-col items-center justify-center min-h-[300px] ${
          isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
        }`}>
          <div className="text-slate-300 dark:text-slate-700 mb-3">
            <Award className="h-12 w-12 mx-auto stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-bold">No certificates earned yet</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[250px]">
            Finish all lessons and pass the final course exams to earn certificates.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
