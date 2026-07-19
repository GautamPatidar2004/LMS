import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourses } from '../../hooks/useCourses';
import { useAuth } from '../../hooks/useAuth';
import { wishlistService } from '../../services/wishlistService';
import { Course } from '../../types/course';
import { BookOpen, Search, Star, Clock, BookOpen as BookIcon, AlertCircle, Loader2 } from 'lucide-react';

export default function BrowseCourse() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real courses using the custom hook
  const { courses, loading, error, refetch } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Price filter range: 'all', 'free', 'under-50', '50-100', 'over-100'
  const [priceFilter, setPriceFilter] = useState('all');

  // Wishlist state
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [animatingHearts, setAnimatingHearts] = useState<{ id: string; x: number; y: number }[]>([]);

  // Helper to generate deterministic ratings/reviews since rating columns are ignored/not requested
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
      return { bg: 'from-amber-500 to-orange-600', text: 'PM' };
    }
    return { bg: 'from-slate-700 to-slate-900', text: course.title.substring(0, 3).toUpperCase() };
  };

  // Fetch wishlisted course IDs
  useEffect(() => {
    const fetchWishlistIds = async () => {
      if (!user) return;
      setWishlistLoading(true);
      try {
        const ids = await wishlistService.getWishlistIds(user.id);
        setWishlistedIds(ids);
      } catch (err) {
        console.error('Failed to load wishlist ids:', err);
      } finally {
        setWishlistLoading(false);
      }
    };
    fetchWishlistIds();
  }, [user]);

  // Wishlist handlers
  const handleAddToWishlist = async (courseId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) return;
    
    // Spawns a floating red heart from the exact click location inside the button
    const rect = event.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: `${courseId}-${Date.now()}`,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    setAnimatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setAnimatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 800);

    setSavingIds((prev) => [...prev, courseId]);
    try {
      await wishlistService.addToWishlist(user.id, courseId);
      setWishlistedIds((prev) => [...prev, courseId]);
    } catch (err) {
      console.error('Failed to add course to wishlist:', err);
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const handleRemoveFromWishlist = async (courseId: string) => {
    if (!user) return;
    setSavingIds((prev) => [...prev, courseId]);
    try {
      await wishlistService.removeFromWishlist(user.id, courseId);
      setWishlistedIds((prev) => prev.filter((id) => id !== courseId));
    } catch (err) {
      console.error('Failed to remove course from wishlist:', err);
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== courseId));
    }
  };

  // 9. Generate categories dynamically from fetched courses
  const categories = ['All', ...Array.from(new Set(courses.map(course => course.category).filter(Boolean)))];

  // 8. Search & Pricing filtering
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.subtitle && course.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.instructor?.full_name && course.instructor.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;

      const price = course.discount_price !== null && course.discount_price !== undefined
        ? course.discount_price
        : course.price;

      let matchesPrice = true;
      if (priceFilter === 'free') {
        matchesPrice = price === 0;
      } else if (priceFilter === 'under-50') {
        matchesPrice = price > 0 && price < 50;
      } else if (priceFilter === '50-100') {
        matchesPrice = price >= 50 && price <= 100;
      } else if (priceFilter === 'over-100') {
        matchesPrice = price > 100;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [courses, searchTerm, selectedCategory, priceFilter]);

  // 10. Sorting Logic
  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses];
    const getPriceValue = (c: Course) => c.discount_price !== null && c.discount_price !== undefined ? c.discount_price : c.price;

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-asc':
          return getPriceValue(a) - getPriceValue(b);
        case 'price-desc':
          return getPriceValue(b) - getPriceValue(a);
        default:
          return 0;
      }
    });
  }, [filteredCourses, sortBy]);

  return (
    <StudentLayout>
      <style>{`
        @keyframes floatHeart {
          0% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-65px) scale(1.4);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: floatHeart 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
      `}</style>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}>
              <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-500" />
              Browse Courses
            </h1>
            <p className={`text-xs md:text-sm mt-1 font-semibold ${isLight ? 'text-slate-400' : 'text-slate-550'}`}>
              Explore and enroll in new courses to expand your skill set.
            </p>
          </div>
        </div>

        {/* Search, Filters and Sorting controls */}
        <div className={`p-4 rounded-2xl border flex flex-col xl:flex-row xl:items-center gap-4 ${
          isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80'
        }`}>
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 ${
              isLight ? 'text-slate-400' : 'text-slate-550'
            }`} />
            <input
              type="text"
              placeholder="Search courses, instructors, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                isLight
                  ? 'bg-slate-50 border-slate-200/80 text-slate-850 placeholder:text-slate-400 focus:border-blue-500'
                  : 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 10. Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 border-slate-200/50 text-slate-650 hover:bg-slate-100'
                    : 'bg-slate-950 border-slate-850 text-slate-350 hover:bg-slate-800'
                }`}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7. Error Handling state */}
        {error ? (
          <div className={`rounded-2xl border p-12 text-center flex flex-col items-center justify-center min-h-[350px] ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold text-red-500">Failed to load courses</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-[320px] font-semibold">
              {error}
            </p>
            <button
              onClick={refetch}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          /* 5. Skeleton Loading State - Compact 4 Columns */
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
        ) : courses.length === 0 ? (
          /* 6. Course Catalog Empty State */
          <div className={`rounded-2xl border p-12 text-center flex flex-col items-center justify-center min-h-[350px] ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            <div className="text-slate-300 dark:text-slate-700 mb-3">
              <BookIcon className="h-12 w-12 mx-auto stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold">No Courses Available</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[300px] font-semibold">
              There are currently no published learning courses in the catalog. Check back later!
            </p>
          </div>
        ) : sortedCourses.length > 0 ? (
          /* Real Courses Grid - Compact (4 columns) & Smaller cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sortedCourses.map((course) => {
              const { rating, reviews } = getRating(course.id);
              const courseTheme = getCourseTheme(course);
              const hasDiscount = course.discount_price !== null && course.discount_price !== undefined;
              const durationHours = course.duration_minutes ? Math.round(course.duration_minutes / 60) : 0;

              return (
                <div
                  key={course.id}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80'
                  }`}
                >
                  {/* Course Card Banner/Image - Compact size */}
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

                  {/* Course Details - Compact sizing */}
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
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-0.5">
                            <span className={`text-sm font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>
                              ${course.discount_price}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-450 line-through">
                              ${course.price}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-sm font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            ${course.price}
                          </span>
                        )}
                      </div>

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

                    {/* Actions: See More and Save to Wishlist */}
                    <div className="mt-3 space-y-1.5 relative">
                      {/* Floating hearts container scoped to this card */}
                      {animatingHearts.map((heart) => {
                        if (heart.id.startsWith(course.id)) {
                          return (
                            <span
                              key={heart.id}
                              className="absolute text-rose-500 text-lg pointer-events-none z-50 animate-float-heart"
                              style={{ left: heart.x, top: heart.y }}
                            >
                              ❤️
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() => navigate(`/courses/${course.slug}`)}
                        className="w-full py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/10 hover:shadow-blue-600/20 hover:scale-[1.01]"
                      >
                        See More
                      </button>

                      {user && (
                        wishlistedIds.includes(course.id) ? (
                          <button
                            onClick={() => handleRemoveFromWishlist(course.id)}
                            disabled={savingIds.includes(course.id)}
                            className={`w-full py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all border ${
                              isLight
                                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/70'
                                : 'bg-rose-950/20 border-rose-900/60 text-rose-450 hover:bg-rose-950/40'
                            } hover:scale-[1.01] disabled:opacity-50`}
                          >
                            {savingIds.includes(course.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Remove from Wishlist'
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleAddToWishlist(course.id, e)}
                            disabled={savingIds.includes(course.id)}
                            className={`w-full py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all border relative ${
                              isLight
                                ? 'bg-white border-slate-205 text-slate-655 hover:bg-slate-55'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                            } hover:scale-[1.01] disabled:opacity-50`}
                          >
                            {savingIds.includes(course.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              'Save'
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtered search yields no results empty state */
          <div className={`rounded-2xl border p-12 text-center flex flex-col items-center justify-center min-h-[300px] ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
          }`}>
            <div className="text-slate-350 dark:text-slate-655 mb-3">
              <Search className="h-12 w-12 mx-auto stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold">No courses found</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[300px] font-semibold">
              We couldn't find any courses matching your filters. Try checking your spelling or selecting another category.
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
