import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Award, Plus, Calendar, ShieldCheck } from 'lucide-react';

export default function CertificatesTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Credentials
          </span>
          <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Certificates Templates
          </h1>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-violet-600/10">
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Official Masterclass Certificate', course: 'React Masterclass', issued: '96 issued', updated: 'May 14, 2025' },
          { title: 'Bootcamp Completion Certificate', course: 'Node.js Bootcamp', issued: '12 issued', updated: 'May 16, 2025' }
        ].map((cert, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:shadow-md transition-all ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight text-slate-850 dark:text-white leading-snug">
                  {cert.title}
                </h3>
                <span className={`text-[9px] font-semibold block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-505'}`}>
                  Course: {cert.course}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850/40 pt-3 text-[10px] font-extrabold text-slate-450 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {cert.issued}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Updated {cert.updated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
