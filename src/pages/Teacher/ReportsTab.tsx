import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FileBarChart2, Download, Search, FileText } from 'lucide-react';

export default function ReportsTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const reports = [
    { title: 'Student Progress Report - Q2 2025', format: 'CSV', size: '420 KB', date: 'May 10, 2025' },
    { title: 'Financial Revenue Summary - May 2025', format: 'PDF', size: '1.2 MB', date: 'May 12, 2025' },
    { title: 'Course Completion Roster - React Masterclass', format: 'CSV', size: '180 KB', date: 'May 15, 2025' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Data Export
          </span>
          <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Reports Generator
          </h1>
        </div>
      </div>

      <div className={`p-5 rounded-2xl border space-y-4 ${
        isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
      }`}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search reports..."
            className={`w-full rounded-xl border-0 py-2 pl-10 pr-4 text-xs font-semibold outline-none transition-all ${
              isLight
                ? 'bg-slate-100 text-slate-700 placeholder-slate-400 focus:bg-slate-50'
                : 'bg-slate-900 text-slate-200 placeholder-slate-500 focus:bg-slate-900'
            }`}
          />
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850/50 text-[10px] font-extrabold text-slate-400 uppercase">
                <th className="py-2.5">Report Title</th>
                <th className="py-2.5">Format</th>
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Date Generated</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/20 font-bold">
              {reports.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3.5 flex items-center gap-2 text-slate-850 dark:text-slate-200">
                    <FileText className="h-4 w-4 text-violet-500" />
                    {r.title}
                  </td>
                  <td className="py-3.5 text-slate-505 dark:text-slate-400">{r.format}</td>
                  <td className="py-3.5 text-slate-800 dark:text-slate-350">{r.size}</td>
                  <td className="py-3.5 text-slate-450 dark:text-slate-550">{r.date}</td>
                  <td className="py-3.5 text-right">
                    <button className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all ml-auto">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
