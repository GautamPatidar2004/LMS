import React from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import {
  TrendingUp,
  FileText,
  ClipboardCheck,
  Award,
  Megaphone,
  BookOpen,
  Clock,
  CheckCircle2,
  Trophy
} from 'lucide-react';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const { theme } = useTheme();

  const isLight = theme === 'light';

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'Alex';
  };

  // Mock course data matching reference image exactly
  const courses = [
    {
      id: 'react-guide',
      title: 'React.js - Complete Guide',
      instructor: 'John Doe',
      progress: 75,
      brandColor: '#38bdf8',
      brandBg: '#0f172a',
      brandType: 'react',
      accentColor: 'blue'
    },
    {
      id: 'js-algo',
      title: 'JavaScript Algorithms',
      instructor: 'Sarah Wilson',
      progress: 60,
      brandColor: '#000000',
      brandBg: '#f7df1e',
      brandType: 'js',
      accentColor: 'green'
    },
    {
      id: 'py-data',
      title: 'Python for Data Science',
      instructor: 'Michael Brown',
      progress: 45,
      brandColor: '#306998',
      brandBg: '#e0f2fe',
      brandType: 'python',
      accentColor: 'blue'
    },
    {
      id: 'uiux-fund',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Emily Davis',
      progress: 30,
      brandColor: '#ffffff',
      brandBg: '#7c3aed',
      brandType: 'uiux',
      accentColor: 'purple'
    },
    {
      id: 'node-back',
      title: 'Node.js - Backend Developer',
      instructor: 'David Miller',
      progress: 80,
      brandColor: '#86efac',
      brandBg: '#1e3a1e',
      brandType: 'node',
      accentColor: 'green'
    }
  ];

  // Mock schedule data
  const schedule = [
    {
      id: 'sch-1',
      time: '10:00',
      period: 'AM',
      title: 'React Components Deep Dive',
      instructor: 'John Doe',
      type: 'Live Class',
      badgeColor: 'blue'
    },
    {
      id: 'sch-2',
      time: '01:00',
      period: 'PM',
      title: 'JavaScript ES6+ Features',
      instructor: 'Sarah Wilson',
      type: 'Live Class',
      badgeColor: 'green'
    },
    {
      id: 'sch-3',
      time: '04:00',
      period: 'PM',
      title: 'Python Data Structures',
      instructor: 'Michael Brown',
      type: 'Live Class',
      badgeColor: 'purple'
    }
  ];

  // Mock to-do list
  const todoItems = [
    {
      id: 'todo-1',
      title: 'Submit React Project Assignment',
      due: 'May 20, 2025',
      badgeText: 'Due Tomorrow',
      badgeType: 'red'
    },
    {
      id: 'todo-2',
      title: 'Complete JavaScript Quiz',
      due: 'May 22, 2025',
      badgeText: 'In 3 days',
      badgeType: 'orange'
    },
    {
      id: 'todo-3',
      title: 'Watch UI/UX Lecture 5',
      due: 'May 25, 2025',
      badgeText: 'In 6 days',
      badgeType: 'blue'
    }
  ];

  // Mock announcements
  const announcements = [
    {
      id: 'ann-1',
      title: 'New Course Added: Advanced Python',
      date: 'May 18, 2025'
    },
    {
      id: 'ann-2',
      title: 'Scheduled Maintenance on May 25',
      date: 'May 17, 2025'
    },
    {
      id: 'ann-3',
      title: 'Live Class on React Hooks Tomorrow',
      date: 'May 16, 2025'
    }
  ];

  // Brand Icon Renderer
  const renderBrandIcon = (type: string, bg: string, color: string) => {
    const style = { backgroundColor: bg, color: color };
    
    if (type === 'react') {
      return (
        <div style={style} className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center overflow-hidden">
          <svg className="h-6 w-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" stroke="#38bdf8" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#38bdf8" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#38bdf8" />
            <circle cx="12" cy="12" r="1.5" fill="#38bdf8" stroke="#38bdf8" />
          </svg>
        </div>
      );
    }
    if (type === 'js') {
      return (
        <div style={style} className="h-11 w-11 shrink-0 rounded-xl flex items-end justify-end p-1 select-none font-bold">
          <span className="text-[14px] font-black leading-none text-slate-900 tracking-tighter">JS</span>
        </div>
      );
    }
    if (type === 'python') {
      return (
        <div style={style} className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center p-1.5 overflow-hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.83 2C9.48 2 9.07 3 9.07 4.79V6.44H11.9V6.95H7.76C5.55 6.95 4.5 8 4.5 10.36V12.72C4.5 14.54 5.37 15.34 6.89 15.34H8.38V13.88C8.38 11.53 9.43 10.48 11.64 10.48H14.4V7.9C14.4 5.55 13.35 4.5 11.14 4.5H9.68C9.68 3.32 10.15 3.01 11.83 3.01C13.51 3.01 13.9 3.32 13.9 4.5H15.28C15.28 3 14.18 2 11.83 2Z" fill="#306998" />
            <path d="M12.17 22C14.52 22 14.93 21 14.93 19.21V17.56H12.1V17.05H16.24C18.45 17.05 19.5 16 19.5 13.64V11.28C19.5 9.46 18.63 8.66 17.11 8.66H15.62V10.12C15.62 12.47 14.57 13.52 12.36 13.52H9.6V16.1C9.6 18.45 10.65 19.5 12.86 19.5H14.32C14.32 20.68 13.85 20.99 12.17 20.99C10.49 20.99 10.1 20.68 10.1 19.5H8.72C8.72 21 9.82 22 12.17 22Z" fill="#ffe052" />
          </svg>
        </div>
      );
    }
    if (type === 'uiux') {
      return (
        <div style={style} className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center select-none font-bold text-[10px] tracking-tighter text-white">
          UI/UX
        </div>
      );
    }
    if (type === 'node') {
      return (
        <div style={style} className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center select-none font-bold text-[11px] text-green-300">
          Node
        </div>
      );
    }
    return (
      <div style={style} className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center select-none font-bold">
        {type.toUpperCase()}
      </div>
    );
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        
        {/* Good Morning Greeting Header */}
        <div className="flex flex-col">
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-800' : 'text-white'
          }`}>
            Good morning, {getFirstName()}! <span className="animate-bounce">👋</span>
          </h1>
          <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Let's continue your learning journey.
          </p>
        </div>

        {/* Top Quick Stats Row (4 premium outline-bordered cards) */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Stat 1: Enrolled Courses */}
          <div className={`group relative rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            isLight
              ? 'border-blue-100 bg-[#f0f6ff]/80 text-slate-800'
              : 'border-blue-900/30 bg-blue-950/10 text-white'
          }`}>
            {/* Background transparent cap */}
            <svg className="absolute right-2 bottom-2 h-16 w-16 text-blue-500/10 pointer-events-none transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3M18.8 12.06L12 15.8L5.2 12.06L2 13.8V17C2 18.66 6.48 20 12 20C17.52 20 22 18.66 22 17V13.8L18.8 12.06Z" />
            </svg>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
              isLight ? 'bg-blue-100 text-blue-600 border-blue-200/50' : 'bg-blue-900/20 text-blue-400 border-blue-800/40'
            }`}>
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-400/90' : 'text-slate-500'}`}>
                Enrolled Courses
              </span>
              <span className="text-xl md:text-2xl font-black block mt-0.5 leading-none">5</span>
              <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 mt-1 block">Active</span>
            </div>
          </div>

          {/* Stat 2: Completed Lessons */}
          <div className={`group relative rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            isLight
              ? 'border-green-100 bg-[#f0fdf4]/80 text-slate-800'
              : 'border-green-900/30 bg-green-950/10 text-white'
          }`}>
            {/* Background transparent bars */}
            <svg className="absolute right-2 bottom-2 h-12 w-16 text-green-500/10 pointer-events-none transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="14" width="4" height="6" rx="1" />
              <rect x="8" y="10" width="4" height="10" rx="1" />
              <rect x="14" y="6" width="4" height="14" rx="1" />
              <rect x="20" y="2" width="4" height="18" rx="1" />
            </svg>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
              isLight ? 'bg-green-100 text-green-600 border-green-200/50' : 'bg-green-900/20 text-green-400 border-green-800/40'
            }`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-400/90' : 'text-slate-500'}`}>
                Completed Lessons
              </span>
              <span className="text-xl md:text-2xl font-black block mt-0.5 leading-none">32</span>
              <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 mt-1 block">This Month</span>
            </div>
          </div>

          {/* Stat 3: Study Time */}
          <div className={`group relative rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            isLight
              ? 'border-purple-100 bg-[#faf5ff]/80 text-slate-800'
              : 'border-purple-900/30 bg-purple-950/10 text-white'
          }`}>
            {/* Background transparent pie */}
            <svg className="absolute right-2 bottom-2 h-14 w-14 text-purple-500/10 pointer-events-none transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v9h9c-.5-4.66-4.14-8.18-9-9zm0 11v9c4.86-.82 8.5-4.34 9-9h-9z"/>
            </svg>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
              isLight ? 'bg-purple-100 text-purple-600 border-purple-200/50' : 'bg-purple-900/20 text-purple-405 border-purple-800/40'
            }`}>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-400/90' : 'text-slate-500'}`}>
                Study Time
              </span>
              <span className="text-xl md:text-2xl font-black block mt-0.5 leading-none">18h 45m</span>
              <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 mt-1 block">This Month</span>
            </div>
          </div>

          {/* Stat 4: Quizzes Score */}
          <div className={`group relative rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            isLight
              ? 'border-orange-100 bg-[#fff7ed]/80 text-slate-800'
              : 'border-orange-900/30 bg-orange-950/10 text-white'
          }`}>
            {/* Background transparent line graph */}
            <svg className="absolute right-2 bottom-2 h-12 w-16 text-orange-500/10 pointer-events-none transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
              isLight ? 'bg-orange-100 text-orange-600 border-orange-200/50' : 'bg-orange-900/20 text-orange-400 border-orange-800/40'
            }`}>
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${isLight ? 'text-slate-400/90' : 'text-slate-500'}`}>
                Quizzes Score
              </span>
              <span className="text-xl md:text-2xl font-black block mt-0.5 leading-none">84%</span>
              <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 mt-1 block">Average Score</span>
            </div>
          </div>
        </section>

        {/* Dashboard 2/3 and 1/3 Grid splits */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          
          {/* Left Column (2/3 width) - My Courses & My Progress */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section: My Courses */}
            <div className={`rounded-2xl border p-5 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-805 dark:text-slate-200">
                  My Courses
                </h2>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </button>
              </div>

              {/* Course list */}
              <div className="flex flex-col gap-3">
                {courses.map((c) => {
                  const barColor =
                    c.accentColor === 'blue' ? 'bg-[#1d5bf5]' :
                    c.accentColor === 'green' ? 'bg-[#10b981]' : 'bg-[#7c3aed]';

                  return (
                    <div
                      key={c.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl border transition-all duration-300 hover:scale-[1.005] ${
                        isLight
                          ? 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                          : 'border-slate-800/70 bg-slate-950/20 hover:border-slate-700/60 hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Left: Brand Icon & Course Title Stack */}
                      <div className="flex items-center gap-3">
                        {renderBrandIcon(c.brandType, c.brandBg, c.brandColor)}
                        <div>
                          <h3 className={`text-xs md:text-sm font-bold leading-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {c.title}
                          </h3>
                          <span className={`text-[10px] font-semibold block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            Instructor: {c.instructor}
                          </span>
                        </div>
                      </div>

                      {/* Middle & Right: Progress bar & Continue Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className={`w-28 sm:w-32 h-1.5 rounded-full overflow-hidden shrink-0 ${
                            isLight ? 'bg-slate-100' : 'bg-slate-800'
                          }`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-black shrink-0 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {c.progress}%
                          </span>
                        </div>

                        {/* Button */}
                        <button className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all duration-200 ${
                          c.accentColor === 'blue'
                            ? 'border-blue-100 text-blue-600 bg-blue-50/50 hover:bg-blue-600 hover:text-white dark:border-blue-900/30 dark:text-blue-400 dark:bg-blue-950/10 dark:hover:bg-blue-600 dark:hover:text-white'
                            : c.accentColor === 'green'
                            ? 'border-green-100 text-green-600 bg-green-50/50 hover:bg-green-600 hover:text-white dark:border-green-900/30 dark:text-green-400 dark:bg-green-950/10 dark:hover:bg-green-600 dark:hover:text-white'
                            : 'border-purple-100 text-purple-650 bg-purple-50/50 hover:bg-purple-600 hover:text-white dark:border-purple-900/30 dark:text-purple-400 dark:bg-purple-950/10 dark:hover:bg-purple-605 dark:hover:text-white'
                        }`}>
                          <span className="scale-75 select-none">▶</span> Continue
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: My Progress Overview */}
            <div className={`rounded-2xl border p-5 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">
                  My Progress Overview
                </h2>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View Details
                </button>
              </div>

              {/* Progress Content Wrapper */}
              <div className="flex flex-col md:flex-row items-center gap-8 py-2">
                
                {/* SVG Donut Circle */}
                <div className="relative w-28 h-28 shrink-0 select-none">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      className="stroke-slate-100 dark:stroke-slate-800/80"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      className="stroke-blue-600 dark:stroke-blue-500"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="301.59"
                      strokeDashoffset="105.56"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg md:text-xl font-black leading-none text-slate-800 dark:text-white">65%</span>
                    <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 block">
                      Overall
                    </span>
                  </div>
                </div>

                {/* Grid 2x2 statistics */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 w-full">
                  
                  {/* Card 1: Lessons Completed */}
                  <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                    isLight ? 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200' : 'bg-slate-950/20 border-slate-800/60 hover:bg-slate-900/30 hover:border-slate-700'
                  }`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      isLight ? 'bg-blue-50 text-blue-600 border-blue-100/30' : 'bg-blue-900/10 text-blue-400 border-blue-900/30'
                    }`}>
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-sm font-black block leading-none">23</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5">Lessons Completed</span>
                    </div>
                  </div>

                  {/* Card 2: Assignments Done */}
                  <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                    isLight ? 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-green-200' : 'bg-slate-950/20 border-slate-800/60 hover:bg-slate-900/30 hover:border-slate-700'
                  }`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      isLight ? 'bg-green-50 text-green-600 border-green-100/30' : 'bg-green-900/10 text-green-400 border-green-900/30'
                    }`}>
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-sm font-black block leading-none">12</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-505 block mt-0.5">Assignments Done</span>
                    </div>
                  </div>

                  {/* Card 3: Quizzes Completed */}
                  <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                    isLight ? 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-purple-200' : 'bg-slate-950/20 border-slate-800/60 hover:bg-slate-900/30 hover:border-slate-700'
                  }`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      isLight ? 'bg-purple-50 text-purple-600 border-purple-100/30' : 'bg-purple-900/10 text-purple-400 border-purple-900/30'
                    }`}>
                      <ClipboardCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-sm font-black block leading-none">8</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5">Quizzes Completed</span>
                    </div>
                  </div>

                  {/* Card 4: Certificates Earned */}
                  <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                    isLight ? 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-orange-200' : 'bg-slate-950/20 border-slate-800/60 hover:bg-slate-900/30 hover:border-slate-700'
                  }`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                      isLight ? 'bg-orange-50 text-orange-605 border-orange-100/30' : 'bg-orange-900/10 text-orange-400 border-orange-900/30'
                    }`}>
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-sm font-black block leading-none">2</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-505 block mt-0.5">Certificates Earned</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Right Column (1/3 width) - Today's Schedule, To Do List, Announcements */}
          <div className="space-y-6">
            
            {/* Section: Today's Schedule */}
            <div className={`rounded-2xl border p-5 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">
                  Today's Schedule
                </h2>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View Calendar
                </button>
              </div>

              {/* Schedule list */}
              <div className="space-y-4">
                {schedule.map((item) => {
                  const boxStyle =
                    item.badgeColor === 'blue'
                      ? isLight ? 'bg-[#eef2ff] border-indigo-100/50 text-[#4f46e5]' : 'bg-indigo-950/25 border-indigo-900/30 text-indigo-400'
                      : item.badgeColor === 'green'
                      ? isLight ? 'bg-[#ecfdf5] border-emerald-100/50 text-[#059669]' : 'bg-emerald-950/25 border-emerald-900/30 text-emerald-400'
                      : isLight ? 'bg-[#faf5ff] border-purple-100/50 text-[#7c3aed]' : 'bg-purple-950/25 border-purple-900/30 text-purple-400';

                  const badgeStyle =
                    item.badgeColor === 'blue'
                      ? 'bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/20'
                      : item.badgeColor === 'green'
                      ? 'bg-green-50 text-green-600 border-green-100/50 dark:bg-green-950/20 dark:text-green-450 dark:border-green-900/20'
                      : 'bg-purple-50 text-purple-650 border-purple-100/50 dark:bg-purple-950/20 dark:text-purple-450 dark:border-purple-900/20';

                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      {/* Left time block badge */}
                      <div className={`w-14 h-14 flex flex-col items-center justify-center text-center shrink-0 rounded-xl border ${boxStyle}`}>
                        <span className="text-xs font-black leading-none">{item.time}</span>
                        <span className="text-[8px] font-black uppercase tracking-wider mt-0.5 leading-none">{item.period}</span>
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold truncate leading-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {item.title}
                        </h4>
                        <span className={`text-[9.5px] font-semibold block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-505'}`}>
                          {item.type} • {item.instructor}
                        </span>
                      </div>

                      {/* Right pill live badge */}
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black border uppercase tracking-wider shrink-0 select-none ${badgeStyle}`}>
                        Live
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: To Do List */}
            <div className={`rounded-2xl border p-5 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-855 dark:text-slate-200">
                  To Do List
                </h2>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </button>
              </div>

              {/* Checked list */}
              <div className="space-y-4">
                {todoItems.map((item) => {
                  const badgeStyle =
                    item.badgeType === 'red'
                      ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20'
                      : item.badgeType === 'orange'
                      ? 'bg-orange-50 text-orange-650 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/20'
                      : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/20';

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 group">
                      
                      {/* Left: Checkbox & title */}
                      <div className="flex items-start gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 shrink-0 rounded border-slate-350 text-blue-600 focus:ring-blue-500/20 cursor-pointer mt-0.5"
                        />
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate leading-tight transition-colors cursor-pointer group-hover:text-blue-600 ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}>
                            {item.title}
                          </h4>
                          <span className={`text-[9.5px] font-semibold block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            Due: {item.due}
                          </span>
                        </div>
                      </div>

                      {/* Right: Urgent deadline badge */}
                      <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-black border tracking-wide shrink-0 ${badgeStyle}`}>
                        {item.badgeText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: Recent Announcements */}
            <div className={`rounded-2xl border p-5 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-855 dark:text-slate-200">
                  Recent Announcements
                </h2>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </button>
              </div>

              {/* Announcement items */}
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 group">
                    {/* Left: megaphone badge */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 ${
                      isLight
                        ? 'bg-slate-50 border-slate-100 text-slate-500 group-hover:border-blue-200 group-hover:bg-[#e8f1ff]/30 group-hover:text-blue-600'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 group-hover:border-slate-700 group-hover:text-white'
                    }`}>
                      <Megaphone className="h-4 w-4" />
                    </div>

                    {/* Right content */}
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-bold leading-tight group-hover:underline cursor-pointer truncate ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {item.title}
                      </h4>
                      <span className={`text-[9.5px] font-semibold block mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </StudentLayout>
  );
}
