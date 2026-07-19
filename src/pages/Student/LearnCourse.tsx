import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { courseService } from '../../services/courseService';
import { Course, CourseSection, Lecture } from '../../types/course';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  ExternalLink,
  BookOpen, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown,
  Loader2, 
  Menu,
  X,
  Lock
} from 'lucide-react';

export default function LearnCourse() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // State Variables
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'materials'>('overview');
  
  // Verification states
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  // Fetch course and verify enrollment
  useEffect(() => {
    async function loadCourseAndCurriculum() {
      if (!slug || !user) return;
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch course details
        const courseData = await courseService.fetchCourseBySlug(slug);
        setCourse(courseData);

        // 2. Check student enrollment in this course
        const { data: enrollment, error: enrollError } = await supabase
          .from('course_enrollments')
          .select('id')
          .eq('student_id', user.id)
          .eq('course_id', courseData.id)
          .maybeSingle();

        if (enrollError) throw enrollError;

        if (!enrollment) {
          setIsEnrolled(false);
          setCheckingEnrollment(false);
          setLoading(false);
          return;
        }
        setIsEnrolled(true);
        setCheckingEnrollment(false);

        // 3. Fetch curriculum
        const curriculumData = await courseService.fetchCourseCurriculum(courseData.id);
        setCurriculum(curriculumData);

        // Expand first section by default
        if (curriculumData.length > 0) {
          setExpandedSections({ [curriculumData[0].id]: true });
          // Set first lecture as active
          const firstSectionWithLectures = curriculumData.find(sec => sec.lectures && sec.lectures.length > 0);
          if (firstSectionWithLectures && firstSectionWithLectures.lectures) {
            setActiveLecture(firstSectionWithLectures.lectures[0]);
          }
        }
      } catch (err: any) {
        console.error('Error loading course player:', err);
        setError(err.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    }

    loadCourseAndCurriculum();
  }, [slug, user]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Helper to extract YouTube video ID
  const getYoutubeId = (url: string | null): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Render video player
  const renderPlayer = () => {
    if (!activeLecture || !activeLecture.video_url) {
      return (
        <div className={`aspect-video w-full rounded-2xl flex flex-col items-center justify-center border text-center p-6 ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <Lock className="h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No video URL provided for this lecture</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Please check other lectures or contact the instructor.</p>
        </div>
      );
    }

    const videoUrl = activeLecture.video_url;
    const ytId = getYoutubeId(videoUrl);

    if (ytId) {
      return (
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-200 dark:border-slate-800">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0`}
            title={activeLecture.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      );
    }

    // Fallback to HTML5 video element
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-200 dark:border-slate-800">
        <video
          src={videoUrl}
          controls
          autoPlay
          controlsList="nodownload"
          className="w-full h-full object-contain"
        />
      </div>
    );
  };

  // Loading Screen
  if (loading || checkingEnrollment) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-3 ${
        isLight ? 'bg-slate-50 text-slate-850' : 'bg-slate-950 text-white'
      }`}>
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Course Player...</p>
      </div>
    );
  }

  // Unauthorized Access Screen
  if (!isEnrolled) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${
        isLight ? 'bg-slate-50 text-slate-850' : 'bg-slate-950 text-white'
      }`}>
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 max-w-md space-y-4">
          <Lock className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-black tracking-tight text-red-500">Access Denied</h2>
          <p className="text-xs text-slate-450 font-semibold">
            You are not enrolled in this course. Please purchase or enroll in this course first to access the curriculum content.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/courses/${slug}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              View Course Details
            </button>
            <button
              onClick={() => navigate('/student/courses')}
              className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-850 text-slate-350 border-slate-800'
              }`}
            >
              Back to My Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${
        isLight ? 'bg-slate-50 text-slate-850' : 'bg-slate-950 text-white'
      }`}>
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 max-w-md space-y-3">
          <h2 className="text-base font-black text-red-500">Error Loading Course</h2>
          <p className="text-xs text-slate-400">{error || 'Course details are not available.'}</p>
          <button
            onClick={() => navigate('/student/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLight ? 'bg-slate-50' : 'bg-[#0b0c10]'}`}>
      
      {/* 1. Course Player Header */}
      <header className={`px-4 py-3 flex items-center justify-between border-b shrink-0 ${
        isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a] border-slate-900 text-white'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/student/courses')}
            className={`p-2 rounded-xl transition-all border shrink-0 ${
              isLight ? 'hover:bg-slate-50 border-slate-100 text-slate-600' : 'hover:bg-slate-800 border-slate-900 text-slate-300'
            }`}
            title="Back to My Courses"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">Course Player</h1>
            <p className="text-sm font-black truncate max-w-lg leading-tight mt-0.5">{course.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sidebar Toggle for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-3 py-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              isLight ? 'hover:bg-slate-50 border-slate-100 text-slate-655' : 'hover:bg-slate-800 border-slate-900 text-slate-300'
            }`}
          >
            <Menu className="h-4 w-4" />
            <span className="hidden md:inline">{isSidebarOpen ? 'Hide Playlist' : 'Show Playlist'}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Video Player & Tabs */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          
          {/* Active Lecture Player */}
          {renderPlayer()}

          {/* Lecture Info & Tab Section */}
          <div className={`p-5 rounded-2xl border ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-900 text-white'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850/40 gap-3">
              <div>
                <h2 className="text-base font-black tracking-tight">{activeLecture ? activeLecture.title : 'No Lecture Selected'}</h2>
                {activeLecture?.duration_seconds && (
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    {Math.round(activeLecture.duration_seconds / 60)} minutes duration
                  </p>
                )}
              </div>

              {/* Tabs buttons */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl shrink-0 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                    activeTab === 'overview'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    activeTab === 'materials'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Materials 
                  {activeLecture?.materials && activeLecture.materials.length > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      activeTab === 'materials' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {activeLecture.materials.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="pt-5 min-h-[120px]">
              {activeTab === 'overview' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">About this Lecture</h3>
                    <p className={`text-xs mt-2 leading-relaxed font-medium whitespace-pre-line ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      {activeLecture?.description || 'No description provided for this lecture.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Resource Files & Attachments</h3>
                  
                  {!activeLecture?.materials || activeLecture.materials.length === 0 ? (
                    <div className="text-center py-6 text-slate-450 text-xs font-semibold">
                      No material resources provided for this lecture.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeLecture.materials.map((material, index) => {
                        const isPdf = material.name.toLowerCase().includes('.pdf');
                        return (
                          <a
                            key={index}
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all group ${
                              isLight 
                                ? 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-200' 
                                : 'bg-slate-900/40 border-slate-900 hover:bg-slate-900 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                isPdf ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                              }`}>
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                  {material.name}
                                </p>
                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                  {isPdf ? 'PDF Document' : 'Resource File'}
                                </p>
                              </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 group-hover:text-slate-200 transition-all" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Collapsible Playlist Drawer (Absolute on mobile, Sidebar on desktop) */}
        <aside className={`w-80 border-l shrink-0 flex flex-col transition-all duration-300 z-10 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 border-l-0 overflow-hidden'
        } ${
          isLight ? 'bg-white border-slate-100' : 'bg-[#0f111a] border-slate-900 text-white'
        } absolute right-0 top-0 bottom-0 lg:relative lg:translate-x-0`}>
          
          <div className="p-4 border-b border-slate-100 dark:border-slate-850/50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Course Curriculum
            </h3>
            {/* Close button for mobile absolute sidebar */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
            {curriculum.length === 0 ? (
              <p className="text-[11px] font-bold text-slate-400 text-center py-8">No curriculum sections defined.</p>
            ) : (
              curriculum.map((section, secIdx) => {
                const isSecExpanded = !!expandedSections[section.id];
                const sectionLectures = section.lectures || [];

                return (
                  <div key={section.id} className="space-y-1.5">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                        isLight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-900/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-extrabold uppercase text-slate-450">
                          Section {secIdx + 1}
                        </span>
                        <h4 className="text-xs font-black truncate leading-tight mt-0.5">
                          {section.title}
                        </h4>
                      </div>
                      {isSecExpanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Section Lectures List */}
                    {isSecExpanded && (
                      <div className="pl-1 space-y-1">
                        {sectionLectures.length === 0 ? (
                          <p className="text-[9px] text-slate-400 pl-3 font-semibold py-1">No lectures in this section.</p>
                        ) : (
                          sectionLectures.map((lecture, lecIdx) => {
                            const isActive = activeLecture?.id === lecture.id;
                            return (
                              <button
                                key={lecture.id}
                                onClick={() => setActiveLecture(lecture)}
                                className={`w-full p-2.5 rounded-lg flex items-start gap-2.5 text-left transition-all ${
                                  isActive
                                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-extrabold'
                                    : isLight
                                      ? 'hover:bg-slate-50 text-slate-650'
                                      : 'hover:bg-slate-900 text-slate-350'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {isActive ? (
                                    <Play className="h-3 w-3 fill-blue-500 text-blue-500" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3 text-slate-400" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] font-bold line-clamp-2 leading-snug">
                                    {lecIdx + 1}. {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-[9px] text-slate-400 font-semibold mt-0.5">
                                    {lecture.duration_seconds && (
                                      <span>{Math.round(lecture.duration_seconds / 60)}m</span>
                                    )}
                                    {lecture.video_url ? (
                                      <span className="text-blue-500/80 uppercase tracking-tight text-[8px] font-bold">Video</span>
                                    ) : (
                                      <span className="text-amber-500/80 uppercase tracking-tight text-[8px] font-bold">Doc</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
