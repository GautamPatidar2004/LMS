import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import { Course } from '../../types/course';
import {
  Save,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  DollarSign,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Globe,
  Loader2,
  FileText
} from 'lucide-react';

interface CreateCourseTabProps {
  setActiveTab: (tab: string) => void;
  courseToEdit?: Course | null;
}

export default function CreateCourseTab({ setActiveTab, courseToEdit }: CreateCourseTabProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isLight = theme === 'light';

  // Form states matching column types
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('beginner');
  const [language, setLanguage] = useState('English');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [totalSections, setTotalSections] = useState('0');
  const [totalLectures, setTotalLectures] = useState('0');
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [status, setStatus] = useState('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title || '');
      setSlug(courseToEdit.slug || '');
      setSubtitle(courseToEdit.subtitle || '');
      setDescription(courseToEdit.description || '');
      setThumbnailUrl(courseToEdit.thumbnail_url || '');
      setBannerUrl(courseToEdit.banner_url || '');
      setIntroVideoUrl(courseToEdit.intro_video_url || '');
      setCategory(courseToEdit.category || 'Web Development');
      setLevel(courseToEdit.level || 'beginner');
      setLanguage(courseToEdit.language || 'English');
      setPrice(courseToEdit.price !== null && courseToEdit.price !== undefined ? courseToEdit.price.toString() : '');
      setDiscountPrice(courseToEdit.discount_price !== null && courseToEdit.discount_price !== undefined ? courseToEdit.discount_price.toString() : '');
      setCurrency(courseToEdit.currency || 'INR');
      setDurationMinutes(courseToEdit.duration_minutes !== null && courseToEdit.duration_minutes !== undefined ? courseToEdit.duration_minutes.toString() : '');
      setTotalSections(courseToEdit.total_sections !== null && courseToEdit.total_sections !== undefined ? courseToEdit.total_sections.toString() : '0');
      setTotalLectures(courseToEdit.total_lectures !== null && courseToEdit.total_lectures !== undefined ? courseToEdit.total_lectures.toString() : '0');
      setCertificateEnabled(courseToEdit.certificate_enabled ?? true);
      setIsFeatured(courseToEdit.is_featured ?? false);
      setIsPublished(courseToEdit.is_published ?? false);
      setStatus(courseToEdit.status || 'draft');
      setSeoTitle(courseToEdit.seo_title || '');
      setSeoDescription(courseToEdit.seo_description || '');
    }
  }, [courseToEdit]);

  // Auto generate slug & default SEO title when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
    setSeoTitle(`Learn ${val} Complete Guide`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert('You must be logged in as an instructor to save a course.');
      return;
    }
    setSubmitting(true);
    try {
      const courseData = {
        title,
        slug: slug || null,
        subtitle: subtitle || null,
        description: description || null,
        thumbnail_url: thumbnailUrl || null,
        banner_url: bannerUrl || null,
        intro_video_url: introVideoUrl || null,
        category,
        level,
        language,
        price: price !== '' ? parseFloat(price) : null,
        discount_price: discountPrice !== '' ? parseFloat(discountPrice) : null,
        currency,
        duration_minutes: durationMinutes !== '' ? parseInt(durationMinutes) : null,
        total_sections: totalSections !== '' ? parseInt(totalSections) : null,
        total_lectures: totalLectures !== '' ? parseInt(totalLectures) : null,
        certificate_enabled: certificateEnabled,
        is_featured: isFeatured,
        is_published: isPublished,
        status,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        instructor_id: user.id
      };

      if (courseToEdit) {
        await courseService.updateCourse(courseToEdit.id, courseData);
        alert('Course successfully updated!');
      } else {
        await courseService.createCourse(courseData);
        alert('Course successfully created!');
      }
      setActiveTab('courses');
    } catch (err: any) {
      console.error(courseToEdit ? 'Error updating course:' : 'Error creating course:', err);
      alert(`Error: ${err.message || 'Unknown database issue'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-12">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`p-2.5 rounded-xl border transition-all ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
          }`}
          title="Back to courses"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            {courseToEdit ? 'Management Center' : 'Publishing Center'}
          </span>
          <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {courseToEdit ? 'Edit Course Details' : 'Create Course Catalog'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns: Inputs Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Basic Info */}
          <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850/50 pb-3">
              <BookOpen className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-sm font-black tracking-tight">Basic Details</h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. React.js Complete Guide"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-550'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Slug URL Link (Optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. reactjs-complete-guide"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-550'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Learn React from Beginner to Advanced"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-550'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Description (Optional)</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Insert complete details about the course, prerequisites, and learning structures..."
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 resize-none ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-550'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Configuration & Parameters */}
          <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850/50 pb-3">
              <Globe className="h-4.5 w-4.5 text-blue-500" />
              <h3 className="text-sm font-black tracking-tight">Classification & Structure</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>Database Engineering</option>
                  <option>AI & Machine Learning</option>
                  <option>UI/UX Design</option>
                  <option>Business Management</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Duration (Minutes) (Optional)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="e.g. 720"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Sections (Optional)</label>
                <input
                  type="number"
                  value={totalSections}
                  onChange={(e) => setTotalSections(e.target.value)}
                  placeholder="e.g. 8"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Lectures (Optional)</label>
                <input
                  type="number"
                  value={totalLectures}
                  onChange={(e) => setTotalLectures(e.target.value)}
                  placeholder="e.g. 56"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Media Upload links */}
          <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850/50 pb-3">
              <ImageIcon className="h-4.5 w-4.5 text-rose-500" />
              <h3 className="text-sm font-black tracking-tight">Media & Assets Links</h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Thumbnail Image URL (Optional)</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://domain.com/assets/thumbnail.jpg"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://domain.com/assets/banner.jpg"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Intro Video URL (Optional)</label>
                <input
                  type="url"
                  value={introVideoUrl}
                  onChange={(e) => setIntroVideoUrl(e.target.value)}
                  placeholder="https://domain.com/assets/intro.mp4"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Toggle Options & SEO */}
        <div className="space-y-6">
          
          {/* Card 4: Pricing parameters */}
          <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850/50 pb-3">
              <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
              <h3 className="text-sm font-black tracking-tight">Pricing</h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 px-3 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Base Price (Optional)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 999"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Discount Price (Optional)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="e.g. 499"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Card 5: Visibility & Settings Toggles (using Radio button pairs) */}
          <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850/50 pb-3">
              <SettingsIcon className="h-4.5 w-4.5 text-amber-500" />
              <h3 className="text-sm font-black tracking-tight">Toggles & Status</h3>
            </div>

            <div className="space-y-4 text-xs font-bold">
              {/* certificate_enabled */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Certificate Enabled</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={certificateEnabled === true}
                      onChange={() => setCertificateEnabled(true)}
                      className="text-violet-600 focus:ring-violet-500/20"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={certificateEnabled === false}
                      onChange={() => setCertificateEnabled(false)}
                      className="text-violet-600 focus:ring-violet-500/20"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* is_featured */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Is Featured</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFeatured === true}
                      onChange={() => setIsFeatured(true)}
                      className="text-violet-600 focus:ring-violet-500/20"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFeatured === false}
                      onChange={() => setIsFeatured(false)}
                      className="text-violet-600 focus:ring-violet-500/20"
                    />
                    <span>False</span>
                  </label>
                </div>
              </div>

              {/* is_published */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Is Published</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPublished === true}
                      onChange={() => setIsPublished(true)}
                      className="text-violet-600 focus:ring-violet-500/20"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPublished === false}
                      onChange={() => setIsPublished(false)}
                      className="text-violet-600 focus:ring-violet-500/20"
                    />
                    <span>False</span>
                  </label>
                </div>
              </div>

              {/* status */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 px-3 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 6: SEO Configuration */}
          <div className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
            isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
          }`}>
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850/50 pb-3">
              <FileText className="h-4.5 w-4.5 text-cyan-500" />
              <h3 className="text-sm font-black tracking-tight">Search Engine SEO</h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">SEO Title (Optional)</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Learn React.js Complete Guide"
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">SEO Description (Optional)</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="SEO description for search engines..."
                  className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none resize-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Form Actions Buttons */}
          <div className="pt-2 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-violet-600/10 hover:scale-[1.01]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  {courseToEdit ? 'Updating Course...' : 'Creating Course...'}
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  {courseToEdit ? 'Update Course Details' : 'Save and Publish'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-3.5 border rounded-xl text-xs font-black transition-all ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-350'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
