import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  MessageCircle,
  HelpCircle,
  Lightbulb,
  Share2,
  Download,
  Star,
  Zap,
  Target,
  Coffee,
  ThumbsUp,
  ThumbsDown,
  BookMarked,
  LayoutGrid,
  AlignLeft,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Award,
  Flame,
  Cpu,
  ChevronLeft,
  Search,
  Globe,
  Bookmark
} from 'lucide-react';

export default function LearnCourse() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'notes' | 'ask' | 'resources'>('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<{ text: string; time: string }[]>([]);
  const [question, setQuestion] = useState('');
  const [questionSent, setQuestionSent] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lectureJustChanged, setLectureJustChanged] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadCourseAndCurriculum() {
      if (!slug || !user) return;
      try {
        setLoading(true);
        setError(null);
        const courseData = await courseService.fetchCourseBySlug(slug);
        setCourse(courseData);
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
        const curriculumData = await courseService.fetchCourseCurriculum(courseData.id);
        setCurriculum(curriculumData);
        if (curriculumData.length > 0) {
          setExpandedSections({ [curriculumData[0].id]: true });
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

  // Gather all lectures in order
  const allLectures = curriculum.flatMap(sec => sec.lectures || []);
  const activeLectureIndex = activeLecture ? allLectures.findIndex(l => l.id === activeLecture.id) : -1;

  const goToLecture = (lecture: Lecture) => {
    setActiveLecture(lecture);
    setLectureJustChanged(true);
    setLiked(null);
    setTimeout(() => setLectureJustChanged(false), 600);
  };

  const goToPrevLecture = () => {
    if (activeLectureIndex > 0) goToLecture(allLectures[activeLectureIndex - 1]);
  };

  const goToNextLecture = () => {
    if (activeLectureIndex < allLectures.length - 1) goToLecture(allLectures[activeLectureIndex + 1]);
  };

  const markComplete = () => {
    if (!activeLecture) return;
    setCompletedLectures(prev => {
      const next = new Set(prev);
      next.add(activeLecture.id);
      return next;
    });
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  };

  const saveNote = () => {
    if (!note.trim()) return;
    setSavedNotes(prev => [...prev, { text: note.trim(), time: new Date().toLocaleTimeString() }]);
    setNote('');
  };

  const sendQuestion = () => {
    if (!question.trim()) return;
    setQuestionSent(true);
    setQuestion('');
    setTimeout(() => setQuestionSent(false), 3000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const getYoutubeId = (url: string | null): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filteredLectures = curriculum.map(sec => ({
    ...sec,
    lectures: (sec.lectures || []).filter(l =>
      !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(sec => sec.lectures.length > 0 || !searchQuery);

  const progressPercent = allLectures.length > 0 ? Math.round((completedLectures.size / allLectures.length) * 100) : 0;

  const renderPlayer = () => {
    if (!activeLecture || !activeLecture.video_url) {
      return (
        <div className={`w-full rounded-2xl flex flex-col items-center justify-center border text-center p-8 min-h-[260px] relative overflow-hidden ${
          isLight ? 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200' : 'bg-gradient-to-br from-slate-900 to-[#0f111a] border-slate-800'
        }`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-4 right-4 w-32 h-32 rounded-full blur-3xl opacity-20 ${isLight ? 'bg-blue-400' : 'bg-blue-600'}`} />
            <div className={`absolute bottom-4 left-4 w-24 h-24 rounded-full blur-2xl opacity-15 ${isLight ? 'bg-violet-400' : 'bg-violet-600'}`} />
          </div>
          <div className="relative z-10 space-y-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
              <Lock className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">No video for this lecture</h3>
            <p className="text-xs text-slate-400 max-w-sm font-medium">This lecture may contain reading materials below or contact instructor for assistance.</p>
          </div>
        </div>
      );
    }

    const videoUrl = activeLecture.video_url;
    const ytId = getYoutubeId(videoUrl);

    const playerClass = `w-full rounded-2xl overflow-hidden shadow-2xl bg-black border transition-all duration-500 ${lectureJustChanged ? 'scale-[0.99] opacity-80' : 'scale-100 opacity-100'} ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`;

    if (ytId) {
      return (
        <div className={playerClass} style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0`}
            title={activeLecture.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    }

    return (
      <div className={playerClass} style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
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

  if (loading || checkingEnrollment) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isLight ? 'bg-slate-50' : 'bg-[#0b0c10]'}`}>
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-60" />
        </div>
        <div className="text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Course Player</p>
          <p className="text-[10px] text-slate-500 mt-1">Preparing your learning experience...</p>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isLight ? 'bg-slate-50' : 'bg-[#0b0c10]'}`}>
        <div className={`p-8 rounded-3xl border max-w-md space-y-5 ${isLight ? 'bg-white border-slate-100 shadow-xl' : 'bg-[#0f111a] border-slate-800'}`}>
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-red-500">Access Denied</h2>
            <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed">
              You are not enrolled in this course. Purchase or enroll first to access the curriculum.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1">
            <button onClick={() => navigate(`/courses/${slug}`)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all hover:scale-[1.02]">
              View Course Details
            </button>
            <button onClick={() => navigate('/student/courses')} className={`px-5 py-2.5 border rounded-xl text-xs font-black transition-all ${isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'}`}>
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isLight ? 'bg-slate-50' : 'bg-[#0b0c10]'}`}>
        <div className={`p-8 rounded-3xl border max-w-md space-y-4 ${isLight ? 'bg-white border-red-100 shadow-xl' : 'bg-[#0f111a] border-red-900/40'}`}>
          <h2 className="text-base font-black text-red-500">Error Loading Course</h2>
          <p className="text-xs text-slate-400">{error || 'Course details are not available.'}</p>
          <button onClick={() => navigate('/student/courses')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all">
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const helpResources = [
    { icon: MessageCircle, label: 'Discussion Forum', desc: 'Join Q&A with peers', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: HelpCircle, label: 'Ask Instructor', desc: 'Get expert guidance', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: Globe, label: 'Official Docs', desc: 'Reference documentation', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Cpu, label: 'Code Sandbox', desc: 'Practice live coding', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: BookMarked, label: 'Cheat Sheets', desc: 'Quick reference guides', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { icon: Target, label: 'Practice Quiz', desc: 'Test your knowledge', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: Award, label: 'Certifications', desc: 'Earn your certificate', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: Lightbulb, label: 'Tips & Tricks', desc: 'Pro developer secrets', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const tabs = [
    { key: 'overview', label: 'Overview', icon: AlignLeft },
    { key: 'notes', label: 'Notes', icon: BookOpen },
    { key: 'materials', label: 'Files', icon: FileText, count: activeLecture?.materials?.length },
    { key: 'ask', label: 'Ask', icon: MessageCircle },
    { key: 'resources', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0c10] text-white'}`}>
      {/* Confetti Overlay */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                backgroundColor: ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#db2777'][i % 6],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
          <div className={`rounded-3xl border p-6 max-w-sm w-full space-y-4 ${isLight ? 'bg-white border-slate-100 shadow-2xl' : 'bg-[#0f111a] border-slate-800'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2">
              {[
                ['←', 'Previous Lecture'],
                ['→', 'Next Lecture'],
                ['N', 'Toggle Notes Tab'],
                ['Space', 'Play/Pause Video'],
                ['F', 'Fullscreen Video'],
                ['M', 'Mute/Unmute'],
                ['B', 'Bookmark Lecture'],
                ['C', 'Mark as Complete'],
              ].map(([key, action]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">{action}</span>
                  <kbd className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 sticky top-0 z-30 backdrop-blur-xl ${
        isLight ? 'bg-white/95 border-slate-100 shadow-sm' : 'bg-[#0f111a]/95 border-slate-900'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/student/courses')}
            className={`p-2 rounded-xl transition-all border shrink-0 hover:scale-105 ${isLight ? 'hover:bg-slate-50 border-slate-200 text-slate-600' : 'hover:bg-slate-800 border-slate-800 text-slate-300'}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Course Player</span>
              {activeLecture?.is_preview && (
                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full font-black uppercase">Free Preview</span>
              )}
            </div>
            <p className="text-xs font-black truncate max-w-[240px] md:max-w-sm leading-tight mt-0.5">{course.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress Badge */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black ${isLight ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
            <Flame className="h-3 w-3 text-orange-500" />
            <span>{progressPercent}% Complete</span>
          </div>

          <button
            onClick={() => setShowShortcuts(true)}
            className={`hidden md:flex p-2 rounded-xl border transition-all text-[10px] font-bold items-center gap-1 ${isLight ? 'hover:bg-slate-50 border-slate-200 text-slate-500' : 'hover:bg-slate-800 border-slate-800 text-slate-400'}`}
            title="Keyboard shortcuts"
          >
            <Zap className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-3 py-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              isLight ? 'hover:bg-slate-50 border-slate-200 text-slate-600' : 'hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden md:inline">{isSidebarOpen ? 'Hide Playlist' : 'Show Playlist'}</span>
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className={`h-0.5 w-full ${isLight ? 'bg-slate-100' : 'bg-slate-900'} shrink-0`}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left: Player + Tabs */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 scrollbar-thin scrollbar-track-transparent">

          {/* Video Player */}
          <div className="relative">
            {renderPlayer()}

            {/* Floating lecture navigation over video bottom */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                onClick={goToPrevLecture}
                disabled={activeLectureIndex <= 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed ${isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
              >
                <SkipBack className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBookmarked(b => !b)}
                  className={`p-2 rounded-xl border transition-all hover:scale-105 ${bookmarked ? 'bg-violet-600/10 border-violet-500/40 text-violet-500' : isLight ? 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                  title="Bookmark this lecture"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-violet-500' : ''}`} />
                </button>

                <button
                  onClick={markComplete}
                  disabled={!activeLecture || completedLectures.has(activeLecture?.id || '')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-[1.02] disabled:opacity-50 ${
                    activeLecture && completedLectures.has(activeLecture.id)
                      ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20'
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {activeLecture && completedLectures.has(activeLecture.id) ? 'Completed!' : 'Mark Complete'}
                </button>

                <button
                  onClick={() => { setLiked(true); }}
                  className={`p-2 rounded-xl border transition-all hover:scale-105 ${liked === true ? 'bg-blue-600/10 border-blue-500/40 text-blue-500' : isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { setLiked(false); }}
                  className={`p-2 rounded-xl border transition-all hover:scale-105 ${liked === false ? 'bg-rose-600/10 border-rose-500/40 text-rose-500' : isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={goToNextLecture}
                disabled={activeLectureIndex >= allLectures.length - 1}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed ${isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
              >
                <span className="hidden sm:inline">Next</span>
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Lecture Info Card */}
          <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/60 border-slate-900'
          }`}>

            {/* Lecture Title Bar */}
            <div className={`px-5 py-4 border-b ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">
                      Lecture {activeLectureIndex + 1} of {allLectures.length}
                    </span>
                    {activeLecture && completedLectures.has(activeLecture.id) && (
                      <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full font-black uppercase flex items-center gap-0.5">
                        <CheckCircle className="h-2.5 w-2.5" /> Done
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-black tracking-tight leading-snug">
                    {activeLecture ? activeLecture.title : 'No Lecture Selected'}
                  </h2>
                  {activeLecture?.duration_seconds && (
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      {Math.round(activeLecture.duration_seconds / 60)} minutes
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className={`p-1.5 rounded-lg border transition-all hover:scale-105 ${isLight ? 'border-slate-200 text-slate-400 hover:bg-slate-50' : 'border-slate-800 text-slate-500 hover:bg-slate-800'}`} title="Share">
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={`flex gap-1 px-4 pt-3 border-b overflow-x-auto ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                      : `border-transparent ${isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'}`
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className={`text-[8px] px-1 py-0.5 rounded-full font-black ${activeTab === key ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>{count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 min-h-[160px]">
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">About This Lecture</h3>
                    <p className={`text-xs leading-relaxed font-medium whitespace-pre-line ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {activeLecture?.description || 'No description provided for this lecture. Refer to the video content for full information.'}
                    </p>
                  </div>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { icon: Clock, label: 'Duration', value: activeLecture?.duration_seconds ? `${Math.round(activeLecture.duration_seconds / 60)}m` : 'N/A', color: 'text-blue-500' },
                      { icon: Star, label: 'Level', value: course.level || 'Beginner', color: 'text-amber-500' },
                      { icon: Coffee, label: 'Break Tip', value: 'Rest every 45m', color: 'text-emerald-500' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className={`p-3 rounded-xl border text-center ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/50 border-slate-800/60'}`}>
                        <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
                        <p className="text-[8px] font-bold uppercase text-slate-400">{label}</p>
                        <p className="text-[10px] font-black mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Personal Notes</h3>
                  <div className="relative">
                    <textarea
                      ref={noteRef}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Write your notes here... Use timestamps, key points, or ideas."
                      rows={4}
                      className={`w-full rounded-xl border py-3 px-4 text-xs font-medium outline-none resize-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-600'
                      }`}
                    />
                    <button
                      onClick={saveNote}
                      disabled={!note.trim()}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-[10px] font-black transition-all"
                    >
                      Save Note
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {savedNotes.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium text-center py-4">No notes saved yet. Start writing above!</p>
                    ) : (
                      savedNotes.map((n, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/60 border-slate-800'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Note #{i + 1}</span>
                            <span className="text-[8px] text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Resource Files & Attachments</h3>
                  {!activeLecture?.materials || activeLecture.materials.length === 0 ? (
                    <div className={`rounded-xl border p-8 text-center ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/50 border-slate-800/60'}`}>
                      <FileText className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-xs text-slate-400 font-semibold">No materials for this lecture</p>
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
                            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all group hover:scale-[1.01] ${
                              isLight ? 'bg-slate-50 border-slate-100 hover:bg-blue-50 hover:border-blue-200' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 hover:border-blue-900/40'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div className={`p-2 rounded-lg shrink-0 ${isPdf ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate leading-tight group-hover:text-blue-500 transition-colors">{material.name}</p>
                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{isPdf ? 'PDF Document' : 'Resource File'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Download className="h-3 w-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                              <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ask' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Ask a Question</h3>
                  {questionSent ? (
                    <div className={`rounded-xl border p-6 text-center ${isLight ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-950/20 border-emerald-900/40'}`}>
                      <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-black text-emerald-500">Question submitted!</p>
                      <p className="text-[10px] text-slate-400 mt-1">The instructor will respond shortly.</p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="What would you like to ask the instructor about this lecture?"
                        rows={4}
                        className={`w-full rounded-xl border py-3 px-4 text-xs font-medium outline-none resize-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-600'
                        }`}
                      />
                      <button
                        onClick={sendQuestion}
                        disabled={!question.trim()}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-xs font-black transition-all hover:scale-[1.01]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Submit Question
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Help & Resources</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {helpResources.map(({ icon: Icon, label, desc, color, bg }) => (
                      <button
                        key={label}
                        className={`p-3 rounded-xl border text-left transition-all group hover:scale-[1.02] hover:shadow-md ${
                          isLight ? 'bg-white border-slate-100 hover:border-slate-200' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <p className="text-[11px] font-black">{label}</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Study Tips */}
                  <div className={`rounded-xl border p-4 ${isLight ? 'bg-gradient-to-r from-violet-50 to-blue-50 border-violet-100' : 'bg-gradient-to-r from-violet-950/30 to-blue-950/30 border-violet-900/40'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-violet-500" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-violet-500">Study Tip</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                      Try the Pomodoro technique: 25 minutes of focused study, then a 5-minute break. This lecture is perfect for one focused session!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Curriculum Playlist */}
        <aside className={`border-l shrink-0 flex flex-col transition-all duration-300 z-10 ${
          isSidebarOpen ? 'w-[300px]' : 'w-0 border-l-0 overflow-hidden'
        } ${isLight ? 'bg-white border-slate-100' : 'bg-[#0f111a] border-slate-900'} absolute right-0 top-0 bottom-0 lg:relative`}>

          <div className={`p-3.5 border-b shrink-0 ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                Playlist
              </h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress in sidebar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400">Progress</span>
                <span className="text-[9px] font-black text-blue-500">{completedLectures.size}/{allLectures.length}</span>
              </div>
              <div className={`w-full h-1.5 rounded-full ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Search lectures */}
            <div className="relative mt-2.5">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-7 pr-3 py-1.5 rounded-lg text-[10px] font-semibold border outline-none ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-600'}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {(searchQuery ? filteredLectures : curriculum).length === 0 ? (
              <p className="text-[10px] font-bold text-slate-400 text-center py-8">No curriculum sections defined.</p>
            ) : (
              (searchQuery ? filteredLectures : curriculum).map((section, secIdx) => {
                const isSecExpanded = !!expandedSections[section.id];
                const sectionLectures = section.lectures || [];
                const sectionCompleted = sectionLectures.filter(l => completedLectures.has(l.id)).length;

                return (
                  <div key={section.id} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                        isLight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-900/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[8px] font-extrabold uppercase text-slate-400 tracking-wider">Section {secIdx + 1}</span>
                        <h4 className="text-[11px] font-black truncate leading-tight mt-0.5">{section.title}</h4>
                        <span className="text-[8px] text-slate-400 font-semibold">{sectionCompleted}/{sectionLectures.length} done</span>
                      </div>
                      {isSecExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isSecExpanded && (
                      <div className="pl-1 space-y-0.5">
                        {sectionLectures.length === 0 ? (
                          <p className="text-[9px] text-slate-400 pl-3 font-semibold py-1">No lectures in this section.</p>
                        ) : (
                          sectionLectures.map((lecture, lecIdx) => {
                            const isActive = activeLecture?.id === lecture.id;
                            const isCompleted = completedLectures.has(lecture.id);
                            return (
                              <button
                                key={lecture.id}
                                onClick={() => goToLecture(lecture)}
                                className={`w-full p-2 rounded-lg flex items-start gap-2 text-left transition-all group ${
                                  isActive
                                    ? 'bg-blue-600/10 border border-blue-500/20'
                                    : isLight
                                      ? 'hover:bg-slate-50'
                                      : 'hover:bg-slate-900/50'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{
                                  background: isActive ? '#2563eb' : isCompleted ? '#059669' : isLight ? '#f1f5f9' : '#1e293b'
                                }}>
                                  {isActive ? (
                                    <Play className="h-2.5 w-2.5 fill-white text-white" />
                                  ) : isCompleted ? (
                                    <CheckCircle className="h-2.5 w-2.5 text-white fill-emerald-500" />
                                  ) : (
                                    <span className="text-[7px] font-black text-slate-400">{lecIdx + 1}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-[10px] font-bold line-clamp-2 leading-snug transition-colors ${
                                    isActive ? 'text-blue-500' : isLight ? 'text-slate-700' : 'text-slate-300'
                                  }`}>
                                    {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-semibold mt-0.5">
                                    {lecture.duration_seconds && (
                                      <span className="flex items-center gap-0.5">
                                        <Clock className="h-2 w-2" />
                                        {Math.round(lecture.duration_seconds / 60)}m
                                      </span>
                                    )}
                                    {lecture.video_url ? (
                                      <span className="text-blue-500/80 uppercase tracking-tight text-[7px] font-bold px-1 py-0.5 bg-blue-500/10 rounded">Video</span>
                                    ) : (
                                      <span className="text-amber-500/80 uppercase tracking-tight text-[7px] font-bold px-1 py-0.5 bg-amber-500/10 rounded">Doc</span>
                                    )}
                                    {lecture.is_preview && (
                                      <span className="text-emerald-500/80 uppercase tracking-tight text-[7px] font-bold px-1 py-0.5 bg-emerald-500/10 rounded">Free</span>
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

          {/* Sidebar Footer */}
          <div className={`p-3 border-t shrink-0 ${isLight ? 'border-slate-100 bg-slate-50/80' : 'border-slate-900/60 bg-slate-950/30'}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevLecture}
                disabled={activeLectureIndex <= 0}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black border transition-all disabled:opacity-30 ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
              >
                <ChevronLeft className="h-3 w-3" />
                Prev
              </button>
              <button
                onClick={goToNextLecture}
                disabled={activeLectureIndex >= allLectures.length - 1}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black border transition-all disabled:opacity-30 ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
              >
                Next
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
