import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import { BookOpen, Star, Clock, BookOpen as BookIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Course } from '../../types/course';

export default function StudentCourses() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.fetchEnrolledCourses(user.id);
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load your enrolled courses.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  // Helper to generate deterministic ratings/reviews
  const getRating = (id: string) => {
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    const rating = 4.0 + (sum % 10) / 10;
    const reviews = 40 + (sum % 160);
    return { rating: rating.toFixed(1), reviews };
  };

  // Helper to determine premium fallback gradient theme when thumbnail_url is missing
  const getCourseTheme = (course: Course) => {
    const cat = (course.category || '').toLowerCase();
    if (cat.includes('dev') || cat.includes('prog')) {
      return { bg: 'from-blue-600 to-indigo-700', text: 'DEV' };
    } else if (cat.includes('design') || cat.includes('ux') || cat.includes('ui')) {
      return { bg: 'from-purple-600 to-pink-700', text: 'DSN' };
    } else if (cat.includes('data') || cat.includes('ai') || cat.includes('ml')) {
      return { bg: 'from-cyan-600 to-teal-700', text: 'AI' };
    } else if (cat.includes('bus') || cat.includes('manage')) {
      return { bg: 'from-amber-500 to-orange-655', text: 'PM' };
    }
    return { bg: 'from-slate-700 to-slate-900', text: course.title.substring(0, 3).toUpperCase() };
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
            isLight ? 'text-slate-800' : 'text-white'
          }`}>
            <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-500" />
            My Courses
          </h1>
          <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-555'}`}>
            View and manage your enrolled learning courses.
          </p>
        </div>

        {/* Loading / Skeleton State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`rounded-2xl border overflow-hidden flex flex-col min-h-[340px] animate-pulse ${
                  isLight ? 'bg-white border-slate-100' : 'bg-slate-900/50 border-slate-800/80'
                }`}
              >
                <div className={`h-32 ${isLight ? 'bg-slate-100' : 'bg-slate-800/60'}`} />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className={`h-2.5 w-1/4 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                      <div className={`h-2.5 w-1/4 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                    </div>
                    <div className={`h-4 w-3/4 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                    <div className={`h-3 w-1/2 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
                    <div className="space-y-1 w-1/3">
                      <div className={`h-2 w-1/2 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                      <div className={`h-3.5 w-full rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                    </div>
                    <div className={`h-3 w-1/3 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                  </div>
                  <div className={`h-8 w-full rounded-lg ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className={`rounded-2xl border p-12 text-center flex flex-col items-center justify-center min-h-[350px] ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold text-red-500">Failed to load enrolled courses</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-[320px] font-semibold">
              {error}
            </p>
            <button
              onClick={fetchEnrolledCourses}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
            >
              Try Again
            </button>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className={`rounded-2xl border p-8 text-center flex flex-col items-center justify-center min-h-[300px] ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            <div className="text-slate-350 dark:text-slate-655 mb-3">
              <BookOpen className="h-12 w-12 mx-auto stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold">No active courses</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[250px]">
              You have not enrolled in any courses yet. Browse the catalog to start learning!
            </p>
            <button
              onClick={() => navigate('/student/browseCourse')}
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          /* Enrolled Course Cards Grid - Smaller (4 columns) & Compact */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {courses.map((course) => {
              const { rating, reviews } = getRating(course.id);
              const courseTheme = getCourseTheme(course);
              const durationHours = course.duration_minutes ? Math.round(course.duration_minutes / 60) : 0;

              return (
                <div
                  key={course.id}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80'
                  }`}
                >
                  {/* Course Thumbnail */}
                  <div className="h-32 relative flex items-center justify-center text-white overflow-hidden bg-slate-950">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${courseTheme.bg} flex items-center justify-center text-white text-2xl font-black tracking-widest`}>
                        <span>{courseTheme.text}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-10 bg-radial-gradient from-white to-transparent" />
                    <span className="absolute top-2.5 right-2.5 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold tracking-normal text-white">
                      {course.category}
                    </span>
                  </div>

                  {/* Course Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>{course.level}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{rating}</span>
                          <span className="text-slate-400 font-medium">({reviews})</span>
                        </div>
                      </div>

                      <h3 className={`text-xs font-black line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors ${
                        isLight ? 'text-slate-800' : 'text-white'
                      }`}>
                        {course.title}
                      </h3>

                      {course.subtitle && (
                        <p className={`text-[10px] line-clamp-1 leading-normal ${isLight ? 'text-slate-550' : 'text-slate-450'}`}>
                          {course.subtitle}
                        </p>
                      )}

                      <div className="text-[10px] text-slate-450 font-medium flex items-center gap-1.5 pt-0.5">
                        {course.instructor?.avatar_url ? (
                          <img
                            src={course.instructor.avatar_url}
                            alt={course.instructor.full_name}
                            className="h-4.5 w-4.5 rounded-full object-cover"
                          />
                        ) : (
                          <span className="h-4.5 w-4.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold">
                            {(course.instructor?.full_name || 'I').charAt(0)}
                          </span>
                        )}
                        <span className="truncate">
                          Instructor: <span className="font-semibold text-slate-650 dark:text-slate-350">{course.instructor?.full_name || 'Instructor'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <div className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{durationHours} hrs</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <BookIcon className="h-3 w-3" />
                          <span>{course.total_lectures || 0} lec</span>
                        </div>
                      </div>
                    </div>

                    {/* See More Button */}
                    <div className="mt-3">
                      <button
                        onClick={() => navigate(`/courses/${course.slug}`)}
                        className="w-full py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/10 hover:shadow-blue-600/20 hover:scale-[1.01]"
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
