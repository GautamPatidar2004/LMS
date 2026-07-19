import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { verifyPaymentSignature } from '../../services/payment';
import BuyCourseButton from '../../components/payment/BuyCourseButton';
import { Course, CourseSection } from '../../types/course';
import {
  BookOpen as BookIcon,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  Globe,
  Award,
  Monitor,
  Smartphone,
  Check,
  Loader2,
  ArrowLeft,
  Sparkles,
  User,
  AlertCircle
} from 'lucide-react';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Fetch single course details and nested curriculum
  const { course, curriculum, loading, error, refetch } = useCourseDetail(slug);
  const { user } = useAuth();

  // Accordion state: keeps track of which section IDs are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Real enrollment and payment verification state variables
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [lastPaymentResponse, setLastPaymentResponse] = useState<{
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  } | null>(null);

  // Check database for active enrollment of the student in this course
  useEffect(() => {
    async function checkEnrollment() {
      if (!course?.id || !user?.id) {
        setCheckingEnrollment(false);
        return;
      }
      try {
        setCheckingEnrollment(true);
        const { data, error: dbError } = await supabase
          .from('course_enrollments')
          .select('id')
          .eq('student_id', user.id)
          .eq('course_id', course.id)
          .maybeSingle();

        if (dbError) throw dbError;
        setIsEnrolled(!!data);
      } catch (err) {
        console.error('Error fetching enrollment status:', err);
      } finally {
        setCheckingEnrollment(false);
      }
    }

    checkEnrollment();
  }, [course, user]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Triggers the verify-payment Edge Function
  const handlePaymentSuccess = async (paymentDetails: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    if (!course?.id) return;
    setIsVerifying(true);
    setVerificationError(null);
    setLastPaymentResponse(paymentDetails);

    try {
      const response = await verifyPaymentSignature({
        courseId: course.id,
        razorpayOrderId: paymentDetails.razorpay_order_id,
        razorpayPaymentId: paymentDetails.razorpay_payment_id,
        razorpaySignature: paymentDetails.razorpay_signature,
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Payment signature verification failed.');
      }

      setIsEnrolled(true);
    } catch (err: any) {
      console.error('Verification error:', err);
      setVerificationError(err.message || 'Payment verified, but enrollment failed to log. Please click Retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetryVerification = () => {
    if (lastPaymentResponse) {
      handlePaymentSuccess(lastPaymentResponse);
    }
  };

  // Helper to format course pricing dynamically based on currency code
  const formatPrice = (amount: number, currencyCode?: string | null) => {
    const code = currencyCode || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code.toUpperCase(),
      }).format(amount);
    } catch {
      return `${code.toUpperCase()} ${amount}`;
    }
  };

  // Helper to determine gradient theme when thumbnail_url is missing
  const getCourseTheme = (c: Course) => {
    const cat = (c.category || '').toLowerCase();
    if (cat.includes('dev') || cat.includes('prog')) {
      return { bg: 'from-blue-600 to-indigo-700', text: 'DEV' };
    } else if (cat.includes('design') || cat.includes('ux') || cat.includes('ui')) {
      return { bg: 'from-purple-600 to-pink-700', text: 'DSN' };
    } else if (cat.includes('data') || cat.includes('ai') || cat.includes('ml')) {
      return { bg: 'from-cyan-600 to-teal-700', text: 'AI' };
    } else if (cat.includes('bus') || cat.includes('manage')) {
      return { bg: 'from-amber-500 to-orange-600', text: 'PM' };
    }
    return { bg: 'from-slate-700 to-slate-900', text: c.title.substring(0, 3).toUpperCase() };
  };

  // Format lecture duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Loading course details...
          </p>
        </div>
      </StudentLayout>
    );
  }

  if (error || !course) {
    return (
      <StudentLayout>
        <div className={`rounded-2xl border p-12 text-center flex flex-col items-center justify-center min-h-[350px] ${
          isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
        }`}>
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto stroke-[1.5]" />
          </div>
          <h3 className="text-base font-extrabold text-red-500">Failed to load course details</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-[320px] font-semibold">
            {error || 'The requested course could not be found.'}
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/student/browseCourse')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-350'
              }`}
            >
              Back to Catalog
            </button>
            <button
              onClick={refetch}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
            >
              Try Again
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const courseTheme = getCourseTheme(course);
  const hasDiscount = course.discount_price !== null && course.discount_price !== undefined;
  const durationHours = course.duration_minutes ? Math.round(course.duration_minutes / 60) : 0;

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/student/browseCourse')}
          className={`flex items-center gap-2 text-xs font-bold tracking-tight py-1 transition-colors ${
            isLight ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-blue-500'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Details & Curriculum */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Banner / Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-500 rounded-lg text-xs font-extrabold">
                  {course.category}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                  isLight ? 'bg-slate-100 text-slate-650' : 'bg-slate-850 text-slate-350'
                }`}>
                  {course.level}
                </span>
                {course.is_featured && (
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-extrabold flex items-center gap-1">
                    <Sparkles className="h-3 w-3 fill-amber-500" />
                    Best Seller
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${
                  isLight ? 'text-slate-800' : 'text-white'
                }`}>
                  {course.title}
                </h1>
                {course.subtitle && (
                  <p className={`text-sm md:text-base font-semibold leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {course.subtitle}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs font-semibold text-slate-450 border-t border-slate-100 dark:border-slate-800/60">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>{course.language || 'English'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{durationHours} hrs of content</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookIcon className="h-4 w-4" />
                  <span>{course.total_lectures || 0} lectures</span>
                </span>
                <span>Last updated {new Date(course.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                About this Course
              </h2>
              <div className={`text-sm leading-relaxed whitespace-pre-line font-medium ${
                isLight ? 'text-slate-600' : 'text-slate-350'
              }`}>
                {course.description || 'No description provided.'}
              </div>
            </div>

            {/* Curriculum Sections Accordion */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Course Syllabus
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">
                    {curriculum.length} sections &bull; {course.total_lectures || 0} lectures
                  </p>
                </div>
              </div>

              {/* Accordion List */}
              <div className="space-y-3 mt-4">
                {curriculum.map((section) => {
                  const sectionLectures = section.lectures || [];
                  const isExpanded = expandedSections[section.id] !== false; // default to expanded

                  return (
                    <div
                      key={section.id}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        isLight ? 'border-slate-150/80' : 'border-slate-800/60'
                      }`}
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-full p-4 flex items-center justify-between text-left transition-all ${
                          isLight ? 'bg-slate-50/50 hover:bg-slate-50' : 'bg-slate-900/30 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="pr-4">
                          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold flex-shrink-0">
                          <span>{sectionLectures.length} lectures</span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>

                      {/* Section Lectures List */}
                      {isExpanded && (
                        <div className={`border-t divide-y ${
                          isLight ? 'border-slate-150/80 divide-slate-100 bg-white' : 'border-slate-800/60 divide-slate-800/40 bg-slate-950/20'
                        }`}>
                          {sectionLectures.length > 0 ? (
                            sectionLectures.map((lecture) => (
                              <div
                                key={lecture.id}
                                className="p-4 flex items-center justify-between text-sm group"
                              >
                                <div className="flex items-center gap-3 pr-4">
                                  <Play className={`h-4 w-4 flex-shrink-0 ${
                                    isLight ? 'text-slate-400 group-hover:text-blue-600' : 'text-slate-500 group-hover:text-blue-500'
                                  }`} />
                                  <div>
                                    <p className={`font-semibold ${isLight ? 'text-slate-750' : 'text-slate-300'}`}>
                                      {lecture.title}
                                    </p>
                                    {lecture.description && (
                                      <p className="text-xs text-slate-450 font-medium line-clamp-1 mt-0.5">
                                        {lecture.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  {lecture.is_preview && (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-md text-[10px] font-bold">
                                      Preview
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(lecture.duration_seconds)}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="p-4 text-xs text-slate-450 font-semibold text-center">
                              No lectures uploaded in this section.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor Section */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/80 text-white'
            }`}>
              <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Your Instructor
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {course.instructor?.avatar_url ? (
                  <img
                    src={course.instructor.avatar_url}
                    alt={course.instructor.full_name}
                    className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <span className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <User className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </span>
                )}
                <div className="space-y-1">
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-850' : 'text-white'}`}>
                    {course.instructor?.full_name || 'Senior Instructor'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    Expert educator & content creator
                  </p>
                  <p className={`text-sm leading-relaxed mt-2 font-medium ${isLight ? 'text-slate-650' : 'text-slate-400'}`}>
                    Dedicated to designing interactive learning courses that teach real-world backend microservices, modern frontends, and core programming architectures.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Sidebar Card */}
          <div className="lg:sticky lg:top-6 space-y-6">
            <div className={`rounded-2xl border overflow-hidden ${
              isLight ? 'bg-white border-slate-100 shadow-md' : 'bg-slate-900/55 border-slate-800/80 text-white shadow-xl shadow-slate-950/20'
            }`}>
              {/* Preview Banner */}
              <div className="h-44 relative bg-slate-950 flex items-center justify-center">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${courseTheme.bg} flex items-center justify-center text-white text-4xl font-black tracking-widest`}>
                    <span>{courseTheme.text}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/20" />
              </div>

              {/* Pricing & Button area */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Price</span>
                  <div className="flex items-baseline gap-2">
                     {hasDiscount ? (
                       <>
                         <span className={`text-3xl font-black ${isLight ? 'text-slate-850' : 'text-white'}`}>
                           {formatPrice(course.discount_price!, course.currency)}
                         </span>
                         <span className="text-sm font-bold text-slate-450 line-through">
                           {formatPrice(course.price, course.currency)}
                         </span>
                       </>
                     ) : (
                       <span className={`text-3xl font-black ${isLight ? 'text-slate-850' : 'text-white'}`}>
                         {formatPrice(course.price, course.currency)}
                       </span>
                     )}
                  </div>
                </div>

                 <div className="space-y-3 pt-2">
                  {checkingEnrollment ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-450 cursor-wait flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/50"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      Checking Enrollment...
                    </button>
                  ) : isEnrolled ? (
                    <div className="space-y-2">
                      <div className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-2">
                        <Check className="h-4.5 w-4.5 stroke-[3]" />
                        Enrolled successfully
                      </div>
                      <button
                        onClick={() => navigate(`/student/dashboard`)}
                        className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        Go to Student Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {isVerifying && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 leading-tight">
                            <p className="font-bold">Verifying Payment...</p>
                            <p className="text-[10px] opacity-80 mt-0.5">Please wait, registering your course enrollment.</p>
                          </div>
                        </div>
                      )}

                      {verificationError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-xs font-semibold text-red-500 leading-tight">
                              <p className="font-bold">Verification Error</p>
                              <p className="text-[10px] opacity-90 mt-0.5">{verificationError}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRetryVerification}
                            className="w-full py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                          >
                            Retry Verification
                          </button>
                        </div>
                      )}

                      {!isVerifying && (
                        <BuyCourseButton
                          courseId={course.id}
                          courseTitle={course.title}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={(msg) => setVerificationError(msg)}
                        />
                      )}
                    </div>
                  )}
                  
                  <p className="text-[10px] text-center font-bold text-slate-400">
                    30-Day Money-Back Guarantee
                  </p>
                </div>

                {/* Course Inclusions */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    This course includes:
                  </h4>
                  <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>Access on desktop, laptop & tablet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>Mobile accessible</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>Full syllabus curriculum content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </StudentLayout>
  );
}
