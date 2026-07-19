import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { wishlistService } from '../../services/wishlistService';
import { Course } from '../../types/course';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  Star, 
  Clock, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function StudentWishlist() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await wishlistService.fetchWishlist(user.id);
      setWishlist(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load wishlist from Supabase on mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (courseId: string) => {
    if (!user) return;
    try {
      await wishlistService.removeFromWishlist(user.id, courseId);
      setWishlist((prev) => prev.filter(item => item.id !== courseId));
    } catch (err: any) {
      console.error('Error removing item from wishlist:', err);
    }
  };

  const handleEnroll = async (course: Course) => {
    if (!user) return;
    setEnrollingId(course.id);
    try {
      // Simulate enrollment and remove item from Supabase wishlist
      await wishlistService.removeFromWishlist(user.id, course.id);
      setWishlist((prev) => prev.filter(item => item.id !== course.id));
      
      // Redirect to course details
      navigate(`/courses/${course.slug}`);
    } catch (err: any) {
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrollingId(null);
    }
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
      return { bg: 'from-amber-500 to-orange-600', text: 'PM' };
    }
    return { bg: 'from-slate-700 to-slate-900', text: course.title.substring(0, 3).toUpperCase() };
  };

  // Deterministic ratings
  const getRating = (id: string) => {
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    const rating = 4.0 + (sum % 10) / 10;
    const reviews = 40 + (sum % 160);
    return { rating: rating.toFixed(1), reviews };
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
              isLight ? 'text-slate-805' : 'text-white'
            }`}>
              <Heart className="h-7 w-7 text-rose-500 fill-rose-500/10" />
              My Wishlist
            </h1>
            <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
              Manage your saved learning courses and enroll when you are ready.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading && wishlist.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`rounded-2xl border overflow-hidden flex flex-col min-h-[380px] animate-pulse ${
                  isLight ? 'bg-white border-slate-100' : 'bg-slate-900/50 border-slate-800/80'
                }`}
              >
                <div className={`h-40 ${isLight ? 'bg-slate-100' : 'bg-slate-800/60'}`} />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty State */
          <div className={`rounded-2xl border p-12 text-center flex flex-col items-center justify-center min-h-[350px] ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            <div className="text-rose-200 dark:text-rose-950/40 mb-4 animate-pulse">
              <Heart className="h-16 w-16 mx-auto stroke-[1.5] fill-rose-500/10" />
            </div>
            <h3 className="text-sm font-bold">Your wishlist is empty</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-[280px] leading-relaxed">
              Explore our marketplace catalog and click the wishlist icon to save courses here for later.
            </p>
            <button
              onClick={() => navigate('/student/browseCourse')}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
            >
              Browse Courses
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Wishlist Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((course) => {
              const { rating, reviews } = getRating(course.id);
              const courseTheme = getCourseTheme(course);
              const hasDiscount = course.discount_price !== null && course.discount_price !== undefined;
              const price = hasDiscount ? course.discount_price : course.price;

              return (
                <div
                  key={course.id}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80'
                  }`}
                >
                  {/* Banner image/gradient */}
                  <div className="h-40 relative flex items-center justify-center text-white overflow-hidden bg-slate-950">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${courseTheme.bg} flex items-center justify-center text-white text-4xl font-black tracking-widest`}>
                        <span>{courseTheme.text}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-10 bg-radial-gradient from-white to-transparent" />
                    
                    {/* Category pill */}
                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold tracking-normal">
                      {course.category}
                    </span>

                    {/* Quick remove action */}
                    <button
                      onClick={() => handleRemove(course.id)}
                      className="absolute top-3 right-3 bg-slate-950/40 hover:bg-rose-600/90 text-white p-2 rounded-xl transition-all duration-200 hover:scale-105"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-405">
                        <span>{course.level}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span>{rating}</span>
                          <span className="text-slate-400 font-medium">({reviews})</span>
                        </div>
                      </div>

                      <h3 className={`text-sm font-bold line-clamp-2 group-hover:text-blue-600 transition-colors ${
                        isLight ? 'text-slate-800' : 'text-white'
                      }`}>
                        {course.title}
                      </h3>

                      {course.subtitle && (
                        <p className={`text-xs line-clamp-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {course.subtitle}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                        {/* Price display */}
                        <div className="flex flex-col">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            Price
                          </span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className={`text-sm font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>
                              ${price}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-slate-400 line-through font-medium">
                                ${course.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Extra stats */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{course.duration_minutes ? Math.round(course.duration_minutes / 60) : 0} hrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions button */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex gap-2">
                      <button
                        onClick={() => handleRemove(course.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                          isLight 
                            ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800' 
                            : 'border-slate-800 bg-slate-900/30 hover:bg-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={enrollingId === course.id}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-650 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 flex items-center justify-center gap-2"
                      >
                        {enrollingId === course.id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Enroll Now
                          </>
                        )}
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
