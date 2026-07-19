import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Users,
  BookOpen,
  Monitor,
  Clock,
  Star,
  Trophy,
  ChevronDown,
  TrendingUp,
  Sparkles,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Plus,
  MessageSquare,
  Upload,
  Layers,
  Image,
  FolderMinus,
  CheckSquare
} from 'lucide-react';

interface DashboardTabProps {
  setActiveTab: (tab: string) => void;
}

export default function DashboardTab({ setActiveTab }: DashboardTabProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // State for date range select filter (mock)
  const [dateRange, setDateRange] = useState('May 14 - May 20, 2025');

  // Stats definition
  const stats = [
    {
      title: 'Total Students',
      value: '1,248',
      trend: '+12.5%',
      badgeColor: 'text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-500/10',
      icon: Users,
      sparkColor: '#8b5cf6',
      points: '5,10 15,22 25,12 35,26 45,15 55,25 65,18 75,32'
    },
    {
      title: 'Published Courses',
      value: '12',
      trend: '+14.3%',
      badgeColor: 'text-emerald-650 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10',
      icon: BookOpen,
      sparkColor: '#10b981',
      points: '5,25 15,18 25,28 35,15 45,22 55,12 65,26 75,10'
    },
    {
      title: 'Total Lectures',
      value: '86',
      trend: '+8.7%',
      badgeColor: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10',
      icon: Monitor,
      sparkColor: '#3b82f6',
      points: '5,18 15,12 25,25 35,15 45,26 55,10 65,22 75,18'
    },
    {
      title: 'Watch Hours',
      value: '3,280',
      trend: '+18.6%',
      badgeColor: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10',
      icon: Clock,
      sparkColor: '#f59e0b',
      points: '5,28 15,22 25,18 35,26 45,12 55,28 65,15 75,10'
    },
    {
      title: 'Avg. Course Rating',
      value: '4.7/5',
      trend: '+6.1%',
      badgeColor: 'text-yellow-600 bg-yellow-100 dark:text-yellow-405 dark:bg-yellow-500/10',
      icon: Star,
      sparkColor: '#eab308',
      points: '5,12 15,15 25,22 35,10 45,28 55,18 65,26 75,12'
    },
    {
      title: 'Avg. Completion Rate',
      value: '68%',
      trend: '+7.4%',
      badgeColor: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-500/10',
      icon: Trophy,
      sparkColor: '#06b6d4',
      points: '5,22 15,26 25,12 35,18 45,25 55,15 65,10 75,28'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Date filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Overview Dashboard
          </span>
          <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Performance Analytics
          </h1>
        </div>

        <div className="relative shrink-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`pl-4 pr-10 py-2 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer appearance-none ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
            }`}
          >
            <option value="May 14 - May 20, 2025">May 14 - May 20, 2025</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Quarter">This Quarter</option>
            <option value="All Time">All Time</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Metrics Row (Grid list of 6 items matching visual layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300 ${
                isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${stat.badgeColor}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {stat.trend}
                </span>
              </div>

              <div>
                <span className={`text-[10px] font-bold block ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>
                  {stat.title}
                </span>
                <h3 className="text-lg md:text-xl font-black tracking-tight leading-none mt-1">
                  {stat.value}
                </h3>
                <span className={`text-[9px] font-medium block mt-1.5 ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
                  vs last 7 days
                </span>
              </div>

              {/* Sparkline trend representation */}
              <div className="pt-2">
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 80 40">
                  <polyline
                    fill="none"
                    stroke={stat.sparkColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={stat.points}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement Overview Row (Line graph + course listing + attention list) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left chart card: Course Engagement Overview */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
          isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-850/50 pb-4">
            <div>
              <h3 className="text-sm font-black tracking-tight">Course Engagement Overview</h3>
              <p className={`text-[10px] font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Visual breakdown of student views, learning watch time, and certificates issued.
              </p>
            </div>
            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Active Students
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Watch Time (hrs)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Course Completions
              </span>
            </div>
          </div>

          {/* SVG line chart plot */}
          <div className="h-64 relative flex items-end justify-between pt-4">
            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Grids */}
              <line x1="0" y1="20" x2="100" y2="20" stroke={isLight ? '#f1f5f9' : '#1e293b'} strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke={isLight ? '#f1f5f9' : '#1e293b'} strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke={isLight ? '#f1f5f9' : '#1e293b'} strokeWidth="0.5" />
              
              {/* Active Students line (purple) */}
              <path
                d="M 5,80 Q 20,60 35,45 T 65,30 T 95,15"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Watch Time line (blue) */}
              <path
                d="M 5,60 Q 20,70 35,50 T 65,40 T 95,30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Course completions line (green) */}
              <path
                d="M 5,90 Q 20,85 35,80 T 65,70 T 95,65"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Axis day labels */}
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-between text-[9px] font-bold text-slate-400 px-2 pt-1 border-t border-slate-100 dark:border-slate-850/50">
              <span>May 14</span>
              <span>May 15</span>
              <span>May 16</span>
              <span>May 17</span>
              <span>May 18</span>
              <span>May 19</span>
              <span>May 20</span>
            </div>
          </div>
        </div>

        {/* Right card: My Courses top list */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
          isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850/50 pb-3">
              <h3 className="text-sm font-black tracking-tight">My Courses</h3>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-[10px] font-extrabold text-violet-500 hover:text-violet-600"
              >
                View All Courses
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-850/30 space-y-3 mt-3">
              {[
                { name: 'React Masterclass', std: '523 Students', pct: '78%', rate: '4.8', color: 'bg-blue-600' },
                { name: 'Node.js Bootcamp', std: '102 Students', pct: '42%', rate: '4.3', color: 'bg-green-600' },
                { name: 'MongoDB with Projects', std: '312 Students', pct: '65%', rate: '4.6', color: 'bg-purple-600' },
                { name: 'JavaScript Essentials', std: '411 Students', pct: '81%', rate: '4.7', color: 'bg-yellow-600' }
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between pt-3 text-xs">
                  <div className="flex items-center gap-2.5 max-w-[65%]">
                    <div className={`h-7 w-7 rounded-lg ${c.color} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block truncate leading-none">
                        {c.name}
                      </span>
                      <span className={`text-[9px] font-medium block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
                        {c.std}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <span className="font-black text-slate-800 dark:text-slate-200 block leading-none">{c.pct}</span>
                      <span className="text-[8px] font-bold text-slate-400 block mt-0.5">Completion</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-extrabold bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {c.rate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('create')}
            className="w-full py-2 border border-dashed border-violet-500 text-violet-500 hover:bg-violet-500/5 transition-all text-xs font-black rounded-xl flex items-center justify-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New Course
          </button>
        </div>
      </div>

      {/* Middle row: Needing attention, Content performance, reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col 1 & 2: Content Performance & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Content Performance Table */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850/50 pb-3">
              <div>
                <h3 className="text-sm font-black tracking-tight">Content Performance</h3>
                <p className={`text-[10px] font-semibold ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
                  Overview of student drop-off rate and video view performance.
                </p>
              </div>
              <button className="text-[10px] font-extrabold text-violet-500 hover:text-violet-600">
                View Full Report
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850/50 text-[10px] font-extrabold text-slate-400 uppercase">
                    <th className="py-2.5">Lecture</th>
                    <th className="py-2.5">Course</th>
                    <th className="py-2.5">Avg. Watch Time</th>
                    <th className="py-2.5">Drop-off Rate</th>
                    <th className="py-2.5 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/20 font-bold">
                  {[
                    { lec: '1. Introduction to React', crs: 'React Masterclass', pct: '98%', status: 'Low', sColor: 'text-emerald-500 bg-emerald-500/10', cmp: '92%', bar: 'w-[92%] bg-emerald-500' },
                    { lec: '2. JSX & Components', crs: 'React Masterclass', pct: '82%', status: 'Medium', sColor: 'text-amber-500 bg-amber-500/10', cmp: '76%', bar: 'w-[76%] bg-amber-500' },
                    { lec: '3. Context API Deep Dive', crs: 'React Masterclass', pct: '41%', status: 'High', sColor: 'text-orange-500 bg-orange-500/10', cmp: '38%', bar: 'w-[38%] bg-orange-500' },
                    { lec: '4. Redux Fundamentals', crs: 'React Masterclass', pct: '38%', status: 'Very High', sColor: 'text-red-500 bg-red-500/10', cmp: '30%', bar: 'w-[30%] bg-red-500' },
                    { lec: '5. Advanced Hooks', crs: 'React Masterclass', pct: '62%', status: 'Medium', sColor: 'text-amber-500 bg-amber-500/10', cmp: '55%', bar: 'w-[55%] bg-amber-500' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="py-3 text-slate-850 dark:text-slate-200">{row.lec}</td>
                      <td className={`py-3 text-[10px] ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>{row.crs}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${row.bar}`} />
                          </div>
                          <span className="text-[10px]">{row.pct}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${row.sColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-850 dark:text-slate-200">{row.cmp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="space-y-3">
            <h3 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {[
                { label: 'Create Course', icon: Plus, color: 'bg-violet-600/10 text-violet-600 dark:text-violet-400' },
                { label: 'Upload Lecture', icon: Upload, color: 'bg-blue-600/10 text-blue-600 dark:text-blue-400' },
                { label: 'Create Section', icon: Layers, color: 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400' },
                { label: 'Upload Resources', icon: FolderMinus, color: 'bg-amber-600/10 text-amber-600 dark:text-amber-400' },
                { label: 'Update Thumbnail', icon: Image, color: 'bg-rose-600/10 text-rose-600 dark:text-rose-400' },
                { label: 'View Analytics', icon: TrendingUp, color: 'bg-cyan-600/10 text-cyan-600 dark:text-cyan-400' },
                { label: 'Manage Reviews', icon: Star, color: 'bg-teal-600/10 text-teal-600 dark:text-teal-400' },
                { label: 'Students', icon: Users, color: 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' },
                { label: 'Publish Draft', icon: ArrowUpRight, color: 'bg-pink-600/10 text-pink-600 dark:text-pink-400' }
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (act.label === 'Create Course') {
                        setActiveTab('create');
                      } else if (act.label === 'View Analytics') {
                        setActiveTab('analytics');
                      } else if (act.label === 'Manage Reviews') {
                        setActiveTab('reviews');
                      } else if (act.label === 'Students') {
                        setActiveTab('students');
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all hover:-translate-y-0.5 ${
                      isLight ? 'bg-white border-slate-100 hover:shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${act.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className={`text-[8px] font-black mt-2 leading-tight block max-w-[65px] ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>
                      {act.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col 3: Attention Students, Reviews, Draft editor, Summary */}
        <div className="space-y-6">
          
          {/* Students Needing Attention */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850/50 pb-3">
              <h3 className="text-sm font-black tracking-tight">Students Needing Attention</h3>
              <button className="text-[10px] font-extrabold text-violet-500 hover:text-violet-600">
                View All Students
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {[
                { name: 'Rahul Verma', status: 'Inactive', detail: '12 days', badge: 'bg-rose-500/10 text-rose-500', sub: 'React Masterclass • Lecture 6' },
                { name: 'Puru Sharma', status: 'At Risk', detail: '7 days', badge: 'bg-amber-500/10 text-amber-500', sub: 'Node.js Bootcamp • Lecture 8' },
                { name: 'Neha Singh', status: 'Low Progress', detail: '18% Completed', badge: 'bg-yellow-500/10 text-yellow-500', sub: 'MongoDB with Projects' },
                { name: 'Aman Patel', status: 'On Track', detail: '72% Completed', badge: 'bg-emerald-500/10 text-emerald-500', sub: 'JavaScript Essentials' },
                { name: 'Riya Mehta', status: 'Almost Done', detail: '96% Completed', badge: 'bg-cyan-500/10 text-cyan-500', sub: 'React Masterclass' }
              ].map((s) => (
                <div key={s.name} className="flex items-start justify-between text-xs pt-1">
                  <div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block leading-none">
                      {s.name}
                    </span>
                    <span className={`text-[9px] font-medium block mt-1 ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>
                      {s.sub}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${s.badge}`}>
                      {s.status}
                    </span>
                    <span className={`text-[9px] font-semibold block mt-1 ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
                      {s.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Editing Draft */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <span className="absolute top-3 right-3 text-[8px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
              Draft
            </span>
            <div className="space-y-1.5 pr-8">
              <h4 className="text-xs font-black tracking-tight text-slate-800 dark:text-white">
                React Authentication
              </h4>
              <p className={`text-[9px] font-semibold ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>
                Last edited 2 days ago.
              </p>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Setup Progress</span>
                <span>67%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[67%] bg-violet-600" />
              </div>
              <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black rounded-xl transition-all">
                Continue Editing
              </button>
            </div>
          </div>

          {/* Radial progress: This Month Summary */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <h3 className="text-sm font-black tracking-tight border-b border-slate-100 dark:border-slate-850/50 pb-2">
              This Month Summary
            </h3>
            
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-3 text-xs font-bold flex-1">
                {[
                  { label: 'New Enrollments', val: '+248', color: 'text-violet-600' },
                  { label: 'Watch Hours', val: '1,248 hrs', color: 'text-blue-600' },
                  { label: 'Course Completions', val: '184', color: 'text-emerald-500' },
                  { label: 'Certificates Issued', val: '96', color: 'text-yellow-600' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>{item.label}</span>
                    <span className={`font-black ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Radial donut SVG */}
              <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active segment (82% matching layout) */}
                  <path
                    className="text-violet-600"
                    strokeDasharray="82, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-xs font-black leading-none ${isLight ? 'text-slate-805' : 'text-white'}`}>
                    1,248
                  </span>
                  <span className="text-[7px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wider">
                    Total
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
