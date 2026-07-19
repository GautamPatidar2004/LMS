import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FolderOpen, FileText, Video, Play, Search, Upload } from 'lucide-react';

export default function ContentLibraryTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const files = [
    { name: 'Introduction to React.mp4', type: 'video', size: '124.5 MB', date: 'May 10, 2025' },
    { name: 'Syllabus Outline.pdf', type: 'document', size: '1.2 MB', date: 'May 12, 2025' },
    { name: 'JSX Cheat Sheet.pdf', type: 'document', size: '820 KB', date: 'May 14, 2025' },
    { name: 'State Management Overview.mp4', type: 'video', size: '340 MB', date: 'May 15, 2025' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Resources
          </span>
          <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Content Library
          </h1>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-violet-600/10">
          <Upload className="h-4 w-4" />
          Upload Files
        </button>
      </div>

      <div className={`p-5 rounded-2xl border space-y-4 ${
        isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
      }`}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search files..."
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
                <th className="py-2.5">File Name</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Size</th>
                <th className="py-2.5 text-right">Upload Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/20 font-bold">
              {files.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3.5 flex items-center gap-2 text-slate-850 dark:text-slate-200">
                    {f.type === 'video' ? (
                      <Video className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-amber-500" />
                    )}
                    {f.name}
                  </td>
                  <td className={`py-3.5 text-[10px] ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>
                    {f.type.toUpperCase()}
                  </td>
                  <td className="py-3.5 text-slate-800 dark:text-slate-350">{f.size}</td>
                  <td className="py-3.5 text-right text-slate-400 font-semibold">{f.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
