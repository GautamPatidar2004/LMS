import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart3, TrendingUp, Clock, Eye } from 'lucide-react';

export default function AnalyticsTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          Reporting
        </span>
        <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
          Analytics Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Total Views', val: '48,250', trend: '+12.5%', color: 'text-violet-500 bg-violet-500/10', icon: Eye },
          { title: 'Watch Duration', val: '3,280 hrs', trend: '+18.6%', color: 'text-blue-500 bg-blue-500/10', icon: Clock },
          { title: 'Avg. Course Completions', val: '86%', trend: '+4.2%', color: 'text-emerald-500 bg-emerald-500/10', icon: TrendingUp }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:shadow-md transition-all ${
                isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.title}
                </span>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {item.trend}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-xl font-black tracking-tight">{item.val}</h3>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG chart layout */}
      <div className={`p-5 rounded-2xl border space-y-4 ${
        isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
      }`}>
        <h3 className="text-sm font-black tracking-tight border-b border-slate-100 dark:border-slate-850/50 pb-3">
          Monthly Enrollment Trend
        </h3>
        <div className="h-48 relative flex items-end justify-between pt-4">
          <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none">
            <div className="border-b border-slate-100 dark:border-slate-850/40 w-full h-0" />
            <div className="border-b border-slate-100 dark:border-slate-850/40 w-full h-0" />
            <div className="border-b border-slate-100 dark:border-slate-850/40 w-full h-0" />
          </div>
          
          {/* SVG bar trends */}
          <div className="flex items-end justify-around w-full h-full pb-6 z-10">
            {[45, 60, 55, 80, 70, 95].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 bg-violet-600 rounded-t-lg transition-all"
                  style={{ height: `${h * 1.2}px` }}
                />
                <span className="text-[9px] font-bold text-slate-400">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
