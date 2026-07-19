import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import { Course } from '../../types/course';
import { BookOpen, Star, Users, Plus, CheckCircle, Clock, Loader2, Play, Trash2 } from 'lucide-react';

interface MyCoursesTabProps {
  setActiveTab: (tab: string) => void;
  setEditingCourse: (course: Course | null) => void;
}

export default function MyCoursesTab({ setActiveTab, setEditingCourse }: MyCoursesTabProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isLight = theme === 'light';

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setActiveTab('edit');
  };

  const handleManageCurriculum = (course: Course) => {
    setEditingCourse(course);
    setActiveTab('curriculum');
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the course "${courseTitle}"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await courseService.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      alert('Course successfully deleted!');
    } catch (err: any) {
      console.error('Error deleting course:', err);
      alert(`Error deleting course: ${err.message || 'Unknown database error'}`);
    }
  };

  useEffect(() => {
    async function loadInstructorCourses() {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.fetchInstructorCourses(user.id);
        setCourses(data);
      } catch (err: any) {
        console.error('Error loading instructor courses:', err);
        setError(err.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    }
    loadInstructorCourses();
  }, [user?.id]);

  const getCourseTheme = (categoryName: string) => {
    const cat = (categoryName || '').toLowerCase();
    if (cat.includes('dev') || cat.includes('prog')) {
      return 'bg-blue-600';
    } else if (cat.includes('design') || cat.includes('ux') || cat.includes('ui')) {
      return 'bg-purple-600';
    } else if (cat.includes('data') || cat.includes('ai') || cat.includes('ml')) {
      return 'bg-cyan-600';
    } else if (cat.includes('bus') || cat.includes('manage')) {
      return 'bg-amber-600';
    }
    return 'bg-slate-650';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage Content
          </span>
          <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
            My Courses
          </h1>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm shadow-violet-600/10"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-2xl border text-center ${isLight ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'}`}>
          <p className="text-xs font-bold text-red-500">{error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className={`p-8 rounded-2xl border text-center space-y-4 ${
          isLight ? 'bg-white border-slate-100' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
        }`}>
          <div className="h-12 w-12 rounded-2xl bg-violet-600/10 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black">No courses created yet</h3>
            <p className="text-[10px] text-slate-400 max-w-[240px] mx-auto font-semibold">
              Get started by publishing your first course to student catalog.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all mx-auto"
          >
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => {
            const courseColor = getCourseTheme(c.category);
            const durationHours = c.duration_minutes ? Math.round(c.duration_minutes / 60) : 0;
            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:shadow-md transition-all ${
                  isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {c.thumbnail_url ? (
                      <img
                        src={c.thumbnail_url}
                        alt={c.title}
                        className="h-10 w-10 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-xl ${courseColor} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                        {c.title.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-black tracking-tight leading-snug">{c.title}</h3>
                      <span className={`text-[9px] font-semibold flex items-center gap-1.5 mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        Published
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-[10px] font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-md shrink-0">
                    <Star className="h-3 w-3 fill-amber-500" />
                    4.8
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-850/40 pt-4 text-xs font-bold">
                  <div className="text-left">
                    <span className={`text-[9px] font-bold block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      Price
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {c.discount_price !== null && c.discount_price !== undefined ? (
                        <>${c.discount_price} <span className="text-[10px] line-through text-slate-400">${c.price}</span></>
                      ) : (
                        <>${c.price}</>
                      )}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className={`text-[9px] font-bold block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      Lectures Count
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">{c.total_lectures || 0} lectures</span>
                  </div>
                  <div className="text-left">
                    <span className={`text-[9px] font-bold block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      Duration
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">{durationHours} hrs watch</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black rounded-xl transition-all"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleManageCurriculum(c)}
                    className="flex-1 py-2 bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 text-[10px] font-black rounded-xl transition-all"
                  >
                    View Curriculum
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 shrink-0"
                    title="Delete Course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
