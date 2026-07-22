import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import { Users, Search, Mail, ChevronDown, Award, Loader2 } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  coursesEnrolled: string[];
  certificatesCount: number;
}

export default function StudentsTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { user } = useAuth();

  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track open custom dropdown for course list in rows
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudents() {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.fetchInstructorStudents(user.id);
        setStudents(data);
      } catch (err: any) {
        console.error('Failed to load instructor students:', err);
        setError(err.message || 'Failed to load students list.');
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [user]);

  // Search filtering logic
  const filteredStudents = students.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchName = s.name.toLowerCase().includes(query);
    const matchEmail = s.email.toLowerCase().includes(query);
    const matchCourse = s.coursesEnrolled.some(c => c.toLowerCase().includes(query));
    return matchName || matchEmail || matchCourse;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          Classroom
        </span>
        <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
          Students Directory
        </h1>
      </div>

      <div className={`p-5 rounded-2xl border space-y-4 ${
        isLight ? 'bg-white border-slate-150 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
      }`}>
        {/* Search Panel */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or course..."
              className={`w-full rounded-xl border py-2 pl-10 pr-4 text-xs font-semibold outline-none transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-violet-500'
                  : 'bg-slate-900 border-slate-800 text-slate-250 placeholder-slate-500 focus:bg-slate-900/60 focus:border-violet-600'
              }`}
            />
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-150 text-slate-500' : 'bg-slate-900 border-slate-850 text-slate-400'
          }`}>
            Total: {filteredStudents.length} Students
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4">
            <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading student directory...</p>
          </div>
        ) : error ? (
          <div className={`p-6 rounded-xl border text-center ${isLight ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-rose-950/20 border-rose-900/40 text-rose-500'}`}>
            <p className="text-xs font-bold">{error}</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className={`p-10 rounded-2xl border text-center space-y-4 ${
            isLight ? 'bg-white border-slate-100' : 'bg-[#0f111a]/20 border-slate-850/80'
          }`}>
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-450 dark:text-slate-500 mx-auto">
              {searchQuery ? <Search className="h-6 w-6" /> : <Users className="h-6 w-6" />}
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black">
                {searchQuery ? 'No students match search' : 'No students enrolled yet'}
              </h3>
              <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto font-semibold">
                {searchQuery 
                  ? 'Try adjusting your search keywords to find the student.' 
                  : 'Once students purchase or enroll in your courses, they will appear in this directory.'}
              </p>
            </div>
          </div>
        ) : (
          /* Student Table */
          <div className="overflow-x-auto pt-2 min-h-[250px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850/50 text-[10px] font-extrabold text-slate-400 uppercase">
                  <th className="py-3 px-4 w-16">S.No.</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Enrolled Course(s)</th>
                  <th className="py-3 px-4 text-center">Certificates Done</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/20 font-semibold">
                {filteredStudents.map((s, idx) => (
                  <tr 
                    key={s.id} 
                    className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    } ${openDropdownId === s.id ? 'relative z-30' : ''}`}
                  >
                    <td className="py-4 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-4 px-4 font-black text-slate-800 dark:text-white">
                      {s.name}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-500 dark:text-slate-400">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {/* Course Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === s.id ? null : s.id)}
                          className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none ${
                            isLight 
                              ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' 
                              : 'bg-slate-900 border-slate-850 text-slate-350 hover:bg-slate-850'
                          }`}
                        >
                          <span>{s.coursesEnrolled.length} Course{s.coursesEnrolled.length > 1 ? 's' : ''}</span>
                          <ChevronDown className={`h-3 w-3 transition-transform ${openDropdownId === s.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {openDropdownId === s.id && (
                          <>
                            {/* Backdrop click close */}
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                            <div className={`absolute left-0 mt-1 w-64 rounded-2xl border p-2 z-50 shadow-xl ${
                              isLight ? 'bg-white border-slate-150 text-slate-700' : 'bg-slate-950 border-slate-850 text-slate-200'
                            }`}>
                              <div className="text-[9px] font-black uppercase text-slate-400 px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-850/40 mb-1.5">
                                Enrolled Courses
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-0.5">
                                {s.coursesEnrolled.map((course, cIdx) => (
                                  <div 
                                    key={cIdx} 
                                    className={`flex items-center gap-2.5 px-2.5 py-2 text-[10.5px] font-bold rounded-xl transition-all ${
                                      isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900'
                                    }`}
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-violet-650 shrink-0 animate-pulse" />
                                    <span className="truncate" title={course}>{course}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                        <Award className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black tracking-tight">{s.certificatesCount}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
