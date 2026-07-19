import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { courseService } from '../../services/courseService';
import { Course, CourseSection, Lecture } from '../../types/course';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  FileText,
  Video,
  Play,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  GripVertical
} from 'lucide-react';

interface ManageCurriculumTabProps {
  setActiveTab: (tab: string) => void;
  course: Course;
}

export default function ManageCurriculumTab({ setActiveTab, course }: ManageCurriculumTabProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Accordion open/close states
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Add Section form states
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [savingSection, setSavingSection] = useState(false);

  // Edit Section inline states
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionDesc, setEditSectionDesc] = useState('');

  // Add Lecture inline states
  const [addingLectureSecId, setAddingLectureSecId] = useState<string | null>(null);
  const [newLecTitle, setNewLecTitle] = useState('');
  const [newLecDesc, setNewLecDesc] = useState('');
  const [newLecVideoUrl, setNewLecVideoUrl] = useState('');
  const [newLecDuration, setNewLecDuration] = useState('');
  const [newLecIsPreview, setNewLecIsPreview] = useState(false);
  const [savingLecture, setSavingLecture] = useState(false);
  const [newLecUploadType, setNewLecUploadType] = useState<'upload' | 'url'>('upload');
  const [newLecFile, setNewLecFile] = useState<File | null>(null);
  const [newLecProgress, setNewLecProgress] = useState(0);
  const [newLecUploading, setNewLecUploading] = useState(false);
  const [newLecSlug, setNewLecSlug] = useState('');
  const [newLecVideoProvider, setNewLecVideoProvider] = useState('html5');
  const [newLecThumbnailUrl, setNewLecThumbnailUrl] = useState('');
  const [newLecIsDownloadable, setNewLecIsDownloadable] = useState(false);
  const [newLecStatus, setNewLecStatus] = useState('published');
  const [newLecPublishedAt, setNewLecPublishedAt] = useState('');

  // Edit Lecture states
  const [editingLecId, setEditingLecId] = useState<string | null>(null);
  const [editLecTitle, setEditLecTitle] = useState('');
  const [editLecDesc, setEditLecDesc] = useState('');
  const [editLecVideoUrl, setEditLecVideoUrl] = useState('');
  const [editLecDuration, setEditLecDuration] = useState('');
  const [editLecIsPreview, setEditLecIsPreview] = useState(false);
  const [editLecUploadType, setEditLecUploadType] = useState<'upload' | 'url'>('url');
  const [editLecFile, setEditLecFile] = useState<File | null>(null);
  const [editLecProgress, setEditLecProgress] = useState(0);
  const [editLecUploading, setEditLecUploading] = useState(false);
  const [editLecSlug, setEditLecSlug] = useState('');
  const [editLecVideoProvider, setEditLecVideoProvider] = useState('html5');
  const [editLecThumbnailUrl, setEditLecThumbnailUrl] = useState('');
  const [editLecIsDownloadable, setEditLecIsDownloadable] = useState(false);
  const [editLecStatus, setEditLecStatus] = useState('published');
  const [editLecPublishedAt, setEditLecPublishedAt] = useState('');

  // --- DRAG AND DROP STATE & REFS ---
  const draggedSectionIdxRef = React.useRef<number | null>(null);
  const draggedLectureRef = React.useRef<{ sectionId: string; index: number } | null>(null);

  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [hoveredLectureId, setHoveredLectureId] = useState<string | null>(null);
  
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [draggedLectureId, setDraggedLectureId] = useState<string | null>(null);
  
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Drag and Drop Handlers for Sections ---
  const handleSectionDragStart = (e: React.DragEvent, sectionId: string, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
    draggedSectionIdxRef.current = index;
    setDraggedSectionId(sectionId);
  };

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSectionIdxRef.current === null || draggedSectionIdxRef.current === index) return;
    
    const updatedSections = [...sections];
    const draggedItem = updatedSections[draggedSectionIdxRef.current];
    
    updatedSections.splice(draggedSectionIdxRef.current, 1);
    updatedSections.splice(index, 0, draggedItem);
    
    draggedSectionIdxRef.current = index;
    setSections(updatedSections);
  };

  const handleSectionDragEnd = async () => {
    setDraggedSectionId(null);
    draggedSectionIdxRef.current = null;

    setIsSyncing(true);
    try {
      const sectionPositions = sections.map((sec, idx) => ({
        id: sec.id,
        course_id: sec.course_id,
        title: sec.title,
        description: sec.description,
        position: idx + 1
      }));

      await courseService.updateSectionPositions(sectionPositions);
      console.log('Successfully updated section positions in Supabase.');
    } catch (err: any) {
      console.error('Failed to sync section positions:', err);
      alert('Error updating section positions in database: ' + err.message);
      await loadCurriculum();
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Drag and Drop Handlers for Lectures ---
  const handleLectureDragStart = (e: React.DragEvent, sectionId: string, lectureId: string, index: number) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', lectureId);
    draggedLectureRef.current = { sectionId, index };
    setDraggedLectureId(lectureId);
  };

  const handleLectureDragOver = (e: React.DragEvent, targetSectionId: string, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragInfo = draggedLectureRef.current;
    if (!dragInfo) return;

    const sourceSectionId = dragInfo.sectionId;
    const sourceIdx = dragInfo.index;

    if (sourceSectionId === targetSectionId && sourceIdx === targetIdx) return;

    const updatedSections = sections.map(sec => ({
      ...sec,
      lectures: sec.lectures ? [...sec.lectures] : []
    }));

    const sourceSec = updatedSections.find(s => s.id === sourceSectionId);
    const targetSec = updatedSections.find(s => s.id === targetSectionId);

    if (!sourceSec || !targetSec || !sourceSec.lectures) return;

    const [draggedLecture] = sourceSec.lectures.splice(sourceIdx, 1);
    if (draggedLecture) {
      draggedLecture.section_id = targetSectionId;
    }

    if (targetSec.lectures) {
      targetSec.lectures.splice(targetIdx, 0, draggedLecture);
    }

    draggedLectureRef.current = { sectionId: targetSectionId, index: targetIdx };
    setSections(updatedSections);
  };

  const handleLectureDragOverEmptySection = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragInfo = draggedLectureRef.current;
    if (!dragInfo) return;

    const sourceSectionId = dragInfo.sectionId;
    const sourceIdx = dragInfo.index;

    const targetSec = sections.find(s => s.id === targetSectionId);
    if (targetSec && targetSec.lectures && targetSec.lectures.length > 0) return;

    const updatedSections = sections.map(sec => ({
      ...sec,
      lectures: sec.lectures ? [...sec.lectures] : []
    }));

    const sourceSec = updatedSections.find(s => s.id === sourceSectionId);
    const destSec = updatedSections.find(s => s.id === targetSectionId);

    if (!sourceSec || !destSec || !sourceSec.lectures) return;

    const [draggedLecture] = sourceSec.lectures.splice(sourceIdx, 1);
    if (draggedLecture) {
      draggedLecture.section_id = targetSectionId;
    }
    
    if (destSec.lectures) {
      destSec.lectures.push(draggedLecture);
    }

    draggedLectureRef.current = { sectionId: targetSectionId, index: 0 };
    setSections(updatedSections);
  };

  const handleLectureDragEnd = async () => {
    setDraggedLectureId(null);
    draggedLectureRef.current = null;

    setIsSyncing(true);
    try {
      const lecturePositions: any[] = [];
      
      sections.forEach(sec => {
        const lectures = sec.lectures || [];
        lectures.forEach((lec, idx) => {
          lecturePositions.push({
            id: lec.id,
            course_id: lec.course_id,
            section_id: sec.id,
            title: lec.title,
            slug: lec.slug,
            description: lec.description,
            video_url: lec.video_url,
            video_provider: lec.video_provider,
            thumbnail_url: lec.thumbnail_url,
            duration_seconds: lec.duration_seconds,
            is_preview: lec.is_preview,
            is_downloadable: lec.is_downloadable,
            status: lec.status,
            published_at: lec.published_at,
            position: idx + 1
          });
        });
      });

      if (lecturePositions.length > 0) {
        await courseService.updateLecturePositions(lecturePositions);
        console.log('Successfully updated lecture positions in Supabase.');
      }
    } catch (err: any) {
      console.error('Failed to sync lecture positions:', err);
      alert('Error updating lecture positions in database: ' + err.message);
      await loadCurriculum();
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper to detect video provider from url
  const detectVideoProvider = (url: string): string => {
    const lowercase = url.toLowerCase();
    if (lowercase.includes('youtube.com') || lowercase.includes('youtu.be')) {
      return 'youtube';
    }
    if (lowercase.includes('vimeo.com')) {
      return 'vimeo';
    }
    if (lowercase.endsWith('.mp4') || lowercase.endsWith('.webm') || lowercase.endsWith('.ogv')) {
      return 'html5';
    }
    return 'other';
  };

  const generateSlug = (val: string): string => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNewTitleChange = (val: string) => {
    setNewLecTitle(val);
    setNewLecSlug(generateSlug(val));
  };

  const handleEditTitleChange = (val: string) => {
    setEditLecTitle(val);
    setEditLecSlug(generateSlug(val));
  };

  const handleNewVideoUrlChange = (val: string) => {
    setNewLecVideoUrl(val);
    setNewLecVideoProvider(detectVideoProvider(val));
  };

  const handleEditVideoUrlChange = (val: string) => {
    setEditLecVideoUrl(val);
    setEditLecVideoProvider(detectVideoProvider(val));
  };

  // Helper to extract duration from video file
  const extractVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        resolve(0);
      };
      video.src = window.URL.createObjectURL(file);
    });
  };

  const handleNewFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLecFile(file);
      // Auto-set title if empty
      if (!newLecTitle.trim()) {
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setNewLecTitle(baseName);
        setNewLecSlug(generateSlug(baseName));
      }
      // Auto-extract duration
      const durationSec = await extractVideoDuration(file);
      if (durationSec > 0) {
        setNewLecDuration(Math.round(durationSec / 60).toString());
      }
    }
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditLecFile(file);
      // Auto-set title if empty
      if (!editLecTitle.trim()) {
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setEditLecTitle(baseName);
        setEditLecSlug(generateSlug(baseName));
      }
      // Auto-extract duration
      const durationSec = await extractVideoDuration(file);
      if (durationSec > 0) {
        setEditLecDuration(Math.round(durationSec / 60).toString());
      }
    }
  };

  // Fetch sections and lectures on load
  const loadCurriculum = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.fetchCourseCurriculum(course.id);
      setSections(data);
      // Expand the first section by default
      if (data.length > 0) {
        setExpandedSections({ [data[0].id]: true });
      }
    } catch (err: any) {
      console.error('Error loading course curriculum:', err);
      setError(err.message || 'Failed to load course curriculum.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurriculum();
  }, [course.id]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // --- SECTION CRUD ---

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setSavingSection(true);
    try {
      const nextPosition = sections.length > 0 
        ? Math.max(...sections.map(s => s.position || 0)) + 1 
        : 1;

      const newSec = await courseService.createSection({
        course_id: course.id,
        title: newSectionTitle.trim(),
        description: newSectionDesc.trim() || null,
        position: nextPosition
      });

      // Append and reset
      setSections(prev => [...prev, { ...newSec, lectures: [] }]);
      setExpandedSections(prev => ({ ...prev, [newSec.id]: true }));
      setNewSectionTitle('');
      setNewSectionDesc('');
      setAddingSection(false);
      alert('Section successfully added!');
    } catch (err: any) {
      console.error('Error adding section:', err);
      alert(`Error: ${err.message || 'Failed to add section'}`);
    } finally {
      setSavingSection(false);
    }
  };

  const startEditSection = (section: CourseSection) => {
    setEditingSectionId(section.id);
    setEditSectionTitle(section.title);
    setEditSectionDesc(section.description || '');
  };

  const handleUpdateSection = async (sectionId: string) => {
    if (!editSectionTitle.trim()) return;
    try {
      const updated = await courseService.updateSection(sectionId, {
        title: editSectionTitle.trim(),
        description: editSectionDesc.trim() || null
      });

      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...updated } : s));
      setEditingSectionId(null);
    } catch (err: any) {
      console.error('Error updating section:', err);
      alert(`Error: ${err.message || 'Failed to update section'}`);
    }
  };

  const handleDeleteSection = async (sectionId: string, sectionTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the section "${sectionTitle}" and all of its lectures?`
    );
    if (!confirmed) return;
    try {
      // Fetch lectures for this section
      const sectionObj = sections.find(s => s.id === sectionId);
      const lecturesToDelete = sectionObj?.lectures || [];

      // Delete all lectures under this section first to respect DB constraints
      for (const lec of lecturesToDelete) {
        await courseService.deleteLecture(lec.id);
      }

      await courseService.deleteSection(sectionId);
      setSections(prev => prev.filter(s => s.id !== sectionId));
      alert('Section deleted!');
    } catch (err: any) {
      console.error('Error deleting section:', err);
      alert(`Error: ${err.message || 'Failed to delete section'}`);
    }
  };

  // --- LECTURE CRUD ---

  const handleAddLecture = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newLecTitle.trim()) return;
    setSavingLecture(true);
    try {
      const sectionObj = sections.find(s => s.id === sectionId);
      const currentLectures = sectionObj?.lectures || [];
      const nextPosition = currentLectures.length > 0 
        ? Math.max(...currentLectures.map(l => l.position || 0)) + 1 
        : 1;

      let finalVideoUrl = newLecVideoUrl.trim() || null;
      if (newLecUploadType === 'upload' && newLecFile) {
        setNewLecUploading(true);
        try {
          finalVideoUrl = await courseService.uploadLectureVideo(
            newLecFile,
            course.id,
            (progress) => setNewLecProgress(progress)
          );
        } catch (uploadErr: any) {
          console.error('Upload failed, offering mock fallback:', uploadErr);
          const confirmUseMock = window.confirm(
            `Lecture file upload failed: ${uploadErr.message || 'Supabase storage error'}.\n\nDo you want to fallback to a simulated URL to proceed?`
          );
          if (confirmUseMock) {
            finalVideoUrl = `https://oticcyzzzcpprvujqiah.supabase.co/storage/v1/object/public/lectures/mock-${Date.now()}-${newLecFile.name}`;
          } else {
            setSavingLecture(false);
            setNewLecUploading(false);
            return;
          }
        } finally {
          setNewLecUploading(false);
        }
      }

      const durationSec = newLecDuration ? parseInt(newLecDuration) * 60 : null;

      const newLec = await courseService.createLecture({
        section_id: sectionId,
        course_id: course.id,
        title: newLecTitle.trim(),
        slug: newLecSlug.trim() || null,
        description: newLecDesc.trim() || null,
        video_url: finalVideoUrl,
        video_provider: finalVideoUrl ? (newLecUploadType === 'upload' ? 'html5' : newLecVideoProvider) : null,
        thumbnail_url: newLecThumbnailUrl.trim() || null,
        duration_seconds: durationSec,
        position: nextPosition,
        is_preview: newLecIsPreview,
        is_downloadable: newLecIsDownloadable,
        status: newLecStatus || 'published',
        published_at: newLecStatus === 'published' ? (newLecPublishedAt ? new Date(newLecPublishedAt).toISOString() : new Date().toISOString()) : null
      });

      // Update state locally
      setSections(prev => prev.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            lectures: [...(s.lectures || []), newLec]
          };
        }
        return s;
      }));

      // Reset fields
      setNewLecTitle('');
      setNewLecDesc('');
      setNewLecVideoUrl('');
      setNewLecDuration('');
      setNewLecIsPreview(false);
      setNewLecFile(null);
      setNewLecProgress(0);
      setNewLecSlug('');
      setNewLecVideoProvider('html5');
      setNewLecThumbnailUrl('');
      setNewLecIsDownloadable(false);
      setNewLecStatus('published');
      setNewLecPublishedAt('');
      setAddingLectureSecId(null);
      alert('Lecture successfully added!');
    } catch (err: any) {
      console.error('Error adding lecture:', err);
      alert(`Error: ${err.message || 'Failed to add lecture'}`);
    } finally {
      setSavingLecture(false);
    }
  };

  const startEditLecture = (lecture: Lecture) => {
    setEditingLecId(lecture.id);
    setEditLecTitle(lecture.title);
    setEditLecDesc(lecture.description || '');
    setEditLecVideoUrl(lecture.video_url || '');
    setEditLecDuration(lecture.duration_seconds ? Math.round(lecture.duration_seconds / 60).toString() : '');
    setEditLecIsPreview(lecture.is_preview || false);
    setEditLecUploadType(lecture.video_url ? 'url' : 'upload');
    setEditLecFile(null);
    setEditLecProgress(0);
    setEditLecUploading(false);

    setEditLecSlug(lecture.slug || '');
    setEditLecVideoProvider(lecture.video_provider || 'html5');
    setEditLecThumbnailUrl(lecture.thumbnail_url || '');
    setEditLecIsDownloadable(lecture.is_downloadable || false);
    setEditLecStatus(lecture.status || 'published');
    setEditLecPublishedAt(lecture.published_at ? new Date(lecture.published_at).toISOString().slice(0, 16) : '');
  };

  const handleUpdateLecture = async (sectionId: string, lectureId: string) => {
    if (!editLecTitle.trim()) return;
    try {
      let finalVideoUrl = editLecVideoUrl.trim() || null;
      if (editLecUploadType === 'upload' && editLecFile) {
        setEditLecUploading(true);
        try {
          finalVideoUrl = await courseService.uploadLectureVideo(
            editLecFile,
            course.id,
            (progress) => setEditLecProgress(progress)
          );
        } catch (uploadErr: any) {
          console.error('Upload failed, offering mock fallback:', uploadErr);
          const confirmUseMock = window.confirm(
            `Lecture file upload failed: ${uploadErr.message || 'Supabase storage error'}.\n\nDo you want to fallback to a simulated URL to proceed?`
          );
          if (confirmUseMock) {
            finalVideoUrl = `https://oticcyzzzcpprvujqiah.supabase.co/storage/v1/object/public/lectures/mock-${Date.now()}-${editLecFile.name}`;
          } else {
            setEditLecUploading(false);
            return;
          }
        } finally {
          setEditLecUploading(false);
        }
      }

      const durationSec = editLecDuration ? parseInt(editLecDuration) * 60 : null;

      const updated = await courseService.updateLecture(lectureId, {
        title: editLecTitle.trim(),
        slug: editLecSlug.trim() || null,
        description: editLecDesc.trim() || null,
        video_url: finalVideoUrl,
        video_provider: finalVideoUrl ? (editLecUploadType === 'upload' ? 'html5' : editLecVideoProvider) : null,
        thumbnail_url: editLecThumbnailUrl.trim() || null,
        duration_seconds: durationSec,
        is_preview: editLecIsPreview,
        is_downloadable: editLecIsDownloadable,
        status: editLecStatus || 'published',
        published_at: editLecStatus === 'published' ? (editLecPublishedAt ? new Date(editLecPublishedAt).toISOString() : new Date().toISOString()) : null
      });

      // Update state locally
      setSections(prev => prev.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            lectures: (s.lectures || []).map(l => l.id === lectureId ? { ...l, ...updated } : l)
          };
        }
        return s;
      }));

      setEditingLecId(null);
      setEditLecFile(null);
      setEditLecProgress(0);
      setEditLecSlug('');
      setEditLecVideoProvider('html5');
      setEditLecThumbnailUrl('');
      setEditLecIsDownloadable(false);
      setEditLecStatus('published');
      setEditLecPublishedAt('');
    } catch (err: any) {
      console.error('Error updating lecture:', err);
      alert(`Error: ${err.message || 'Failed to update lecture'}`);
    }
  };

  const handleDeleteLecture = async (sectionId: string, lectureId: string, lectureTitle: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the lecture "${lectureTitle}"?`);
    if (!confirmed) return;
    try {
      await courseService.deleteLecture(lectureId);
      setSections(prev => prev.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            lectures: (s.lectures || []).filter(l => l.id !== lectureId)
          };
        }
        return s;
      }));
      alert('Lecture deleted!');
    } catch (err: any) {
      console.error('Error deleting lecture:', err);
      alert(`Error: ${err.message || 'Failed to delete lecture'}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
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
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Course Curriculum Editor
              </span>
              {isSyncing && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-655 text-white rounded-full text-[8px] font-black uppercase animate-pulse">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  Saving Order...
                </span>
              )}
            </div>
            <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
              {course.title}
            </h1>
          </div>
        </div>
        <button
          onClick={() => setAddingSection(!addingSection)}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-violet-600/10 self-start md:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Section
        </button>
      </div>

      {/* Adding Section Form */}
      {addingSection && (
        <form
          onSubmit={handleAddSection}
          className={`p-5 rounded-2xl border space-y-4 animate-in fade-in slide-in-from-top-3 duration-250 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0f111a]/50 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-violet-500">Create New Section</h3>
            <button
              type="button"
              onClick={() => setAddingSection(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Section Title</label>
              <input
                type="text"
                required
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g. Getting Started with Fundamentals"
                className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Description (Optional)</label>
              <textarea
                rows={2}
                value={newSectionDesc}
                onChange={(e) => setNewSectionDesc(e.target.value)}
                placeholder="Brief summary of what students will learn in this section..."
                className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none resize-none focus:ring-2 focus:ring-violet-500/20 ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setAddingSection(false)}
                className={`px-4 py-2 border rounded-xl text-xs font-black transition-all ${
                  isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-350'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingSection}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
              >
                {savingSection ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Section
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading course curriculum...</p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-2xl border text-center ${isLight ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'}`}>
          <p className="text-xs font-bold text-rose-500">{error}</p>
        </div>
      ) : sections.length === 0 ? (
        <div className={`p-10 rounded-2xl border text-center space-y-4 ${
          isLight ? 'bg-white border-slate-150' : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
        }`}>
          <div className="h-12 w-12 rounded-2xl bg-violet-600/10 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black">No sections added yet</h3>
            <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto font-semibold">
              Get started by adding your first curriculum section and compiling lectures.
            </p>
          </div>
          <button
            onClick={() => setAddingSection(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all mx-auto"
          >
            Add Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, secIdx) => {
            const isExpanded = !!expandedSections[section.id];
            const isEditingSec = editingSectionId === section.id;
            const isAddingLec = addingLectureSecId === section.id;
            const lecturesList = section.lectures || [];

            return (
              <div
                key={section.id}
                draggable={hoveredSectionId === section.id && !isEditingSec}
                onDragStart={(e) => handleSectionDragStart(e, section.id, secIdx)}
                onDragOver={(e) => handleSectionDragOver(e, secIdx)}
                onDragEnd={handleSectionDragEnd}
                className={`rounded-2xl border transition-all duration-300 ${
                  draggedSectionId === section.id
                    ? 'opacity-40 scale-[0.98] border-dashed border-violet-500 bg-violet-50/10'
                    : isLight 
                      ? 'bg-white border-slate-150 shadow-sm' 
                      : 'bg-[#0f111a]/40 border-slate-850/80 text-white'
                }`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between p-4 gap-3">
                  {!isEditingSec && (
                    <div
                      onMouseEnter={() => setHoveredSectionId(section.id)}
                      onMouseLeave={() => setHoveredSectionId(null)}
                      className={`cursor-grab active:cursor-grabbing p-1.5 rounded-lg border transition-all ${
                        isLight 
                          ? 'border-slate-100 hover:bg-slate-50 text-slate-400' 
                          : 'border-slate-850 hover:bg-slate-900/60 text-slate-500'
                      }`}
                      title="Drag to reorder section"
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>
                  )}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-350'
                    }`}>
                      {secIdx + 1}
                    </div>
                    
                    {!isEditingSec ? (
                      <div>
                        <h2 className="text-xs font-black tracking-tight flex items-center gap-2">
                          {section.title}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-600/10 text-violet-600 shrink-0`}>
                            {lecturesList.length} lectures
                          </span>
                        </h2>
                        {section.description && (
                          <p className="text-[10px] text-slate-400 font-semibold line-clamp-1 mt-0.5">{section.description}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 space-y-2 pr-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          required
                          value={editSectionTitle}
                          onChange={(e) => setEditSectionTitle(e.target.value)}
                          placeholder="Section Title"
                          className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                            isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        />
                        <textarea
                          rows={1}
                          value={editSectionDesc}
                          onChange={(e) => setEditSectionDesc(e.target.value)}
                          placeholder="Description"
                          className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none resize-none ${
                            isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateSection(section.id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-700 transition-all"
                          >
                            <Save className="h-3 w-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className={`px-3 py-1 border rounded-lg text-[10px] font-bold ${
                              isLight ? 'bg-white text-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isEditingSec && (
                      <>
                        <button
                          onClick={() => startEditSection(section)}
                          className={`p-2 rounded-xl border transition-all ${
                            isLight 
                              ? 'border-slate-150 text-slate-500 hover:bg-slate-50' 
                              : 'border-slate-850 text-slate-400 hover:bg-slate-900/60'
                          }`}
                          title="Edit Section Info"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id, section.title)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all"
                          title="Delete Section"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`p-2 rounded-xl transition-all ${
                        isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Section Content (Lectures Accordion Body) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-850/50 p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/20 rounded-b-2xl">
                    
                    {/* Lectures List */}
                    <div className="space-y-3">
                      {lecturesList.length === 0 ? (
                        <div 
                          onDragOver={(e) => handleLectureDragOverEmptySection(e, section.id)}
                          className="py-6 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-center"
                        >
                          <p className="text-[10px] font-bold text-slate-400">No lectures uploaded in this section yet. Drag and drop lectures here.</p>
                        </div>
                      ) : (
                        lecturesList.map((lecture, lecIdx) => {
                          const isEditingLec = editingLecId === lecture.id;

                          return (
                            <div
                              key={lecture.id}
                              draggable={hoveredLectureId === lecture.id && !isEditingLec}
                              onDragStart={(e) => handleLectureDragStart(e, section.id, lecture.id, lecIdx)}
                              onDragOver={(e) => handleLectureDragOver(e, section.id, lecIdx)}
                              onDragEnd={handleLectureDragEnd}
                              className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-250 ${
                                draggedLectureId === lecture.id
                                  ? 'opacity-40 border-dashed border-violet-400 bg-violet-50/5'
                                  : isLight ? 'bg-white border-slate-150' : 'bg-slate-900/50 border-slate-850'
                              }`}
                            >
                              {!isEditingLec ? (
                                <div className="flex items-start gap-3 flex-1">
                                  <div
                                    onMouseEnter={() => setHoveredLectureId(lecture.id)}
                                    onMouseLeave={() => setHoveredLectureId(null)}
                                    className={`cursor-grab active:cursor-grabbing p-1 rounded-md transition-all self-center ${
                                      isLight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-slate-800 text-slate-500'
                                    }`}
                                    title="Drag to reorder lecture"
                                  >
                                    <GripVertical className="h-3.5 w-3.5" />
                                  </div>
                                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                    isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {lecture.video_url ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-amber-500" />}
                                  </div>
                                  <div>
                                    <h4 className="text-[11px] font-extrabold flex items-center gap-1.5 flex-wrap">
                                      {lecIdx + 1}. {lecture.title}
                                      {lecture.is_preview && (
                                        <span className="text-[8px] font-extrabold uppercase px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                                          Preview
                                        </span>
                                      )}
                                    </h4>
                                    {lecture.description && (
                                      <p className="text-[10px] text-slate-450 font-medium mt-0.5">{lecture.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 text-[9px] text-slate-400 font-semibold mt-1">
                                      {lecture.duration_seconds && (
                                        <span>Duration: {Math.round(lecture.duration_seconds / 60)} mins</span>
                                      )}
                                      {lecture.video_url && (
                                        <span className="truncate max-w-[200px]" title={lecture.video_url}>URL: {lecture.video_url}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-1 space-y-3 pr-4 text-left">
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditLecUploadType('upload')}
                                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${
                                        editLecUploadType === 'upload'
                                          ? 'bg-violet-600 text-white shadow-sm'
                                          : isLight
                                            ? 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            : 'bg-slate-800 text-slate-350 hover:bg-slate-700'
                                      }`}
                                    >
                                      Upload Video File
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditLecUploadType('url')}
                                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${
                                        editLecUploadType === 'url'
                                          ? 'bg-violet-600 text-white shadow-sm'
                                          : isLight
                                            ? 'bg-slate-100 text-slate-655 hover:bg-slate-200'
                                            : 'bg-slate-800 text-slate-355 hover:bg-slate-700'
                                      }`}
                                    >
                                      Video URL Link
                                    </button>
                                  </div>

                                  {/* Grid 1: Title & Slug */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Lecture Title</label>
                                      <input
                                        type="text"
                                        required
                                        value={editLecTitle}
                                        onChange={(e) => handleEditTitleChange(e.target.value)}
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Slug</label>
                                      <input
                                        type="text"
                                        value={editLecSlug}
                                        onChange={(e) => setEditLecSlug(e.target.value)}
                                        placeholder="e.g. setting-up-environment"
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {/* Grid 2: Video Provider & Thumbnail URL */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Video Provider</label>
                                      <select
                                        value={editLecVideoProvider}
                                        onChange={(e) => setEditLecVideoProvider(e.target.value)}
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      >
                                        <option value="html5">HTML5 Local Video</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="other">Other Link / External</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Thumbnail Image URL</label>
                                      <input
                                        type="url"
                                        value={editLecThumbnailUrl}
                                        onChange={(e) => setEditLecThumbnailUrl(e.target.value)}
                                        placeholder="https://domain.com/lecture-thumb.jpg"
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {/* Video File / URL Input */}
                                  {editLecUploadType === 'upload' ? (
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450 block">Upload Video File</label>
                                      <div className={`border-2 border-dashed rounded-xl p-2 text-center transition-all cursor-pointer relative ${
                                        editLecFile 
                                          ? 'border-emerald-500 bg-emerald-500/5' 
                                          : isLight 
                                            ? 'border-slate-200 hover:border-violet-400 bg-slate-50/50' 
                                            : 'border-slate-805 hover:border-violet-550 bg-slate-900/30'
                                      }`}>
                                        <input
                                          type="file"
                                          accept="video/*"
                                          onChange={handleEditFileChange}
                                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-0.5">
                                          <Upload className={`h-4 w-4 ${editLecFile ? 'text-emerald-500' : 'text-slate-400'}`} />
                                          {editLecFile ? (
                                            <div>
                                              <p className="text-[9px] font-bold text-emerald-500 truncate max-w-[180px]">{editLecFile.name}</p>
                                              <p className="text-[8px] text-slate-400 font-medium">{(editLecFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace</p>
                                            </div>
                                          ) : (
                                            <div>
                                              <p className="text-[9px] font-bold text-slate-500">Drag & drop or click</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Video URL Link (Optional)</label>
                                      <input
                                        type="url"
                                        value={editLecVideoUrl}
                                        onChange={(e) => handleEditVideoUrlChange(e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      />
                                    </div>
                                  )}

                                  {editLecUploading && (
                                    <div className="space-y-1 pt-0.5">
                                      <div className="flex items-center justify-between text-[8px] font-extrabold uppercase text-violet-555">
                                        <span>Uploading video file...</span>
                                        <span>{editLecProgress}%</span>
                                      </div>
                                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                                        <div 
                                          className="bg-violet-650 h-1 rounded-full transition-all duration-150" 
                                          style={{ width: `${editLecProgress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Grid 3: Duration, Previews, Downloads */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Duration (Minutes)</label>
                                      <input
                                        type="number"
                                        value={editLecDuration}
                                        onChange={(e) => setEditLecDuration(e.target.value)}
                                        placeholder="e.g. 15"
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      />
                                    </div>
                                    <div className="flex items-center pt-4">
                                      <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-650 dark:text-slate-350">
                                        <input
                                          type="checkbox"
                                          checked={editLecIsPreview}
                                          onChange={(e) => setEditLecIsPreview(e.target.checked)}
                                          className="rounded border-slate-300 dark:border-slate-850 text-violet-650 focus:ring-violet-550 h-3.5 w-3.5"
                                        />
                                        Free Preview
                                      </label>
                                    </div>
                                    <div className="flex items-center pt-4">
                                      <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-650 dark:text-slate-350">
                                        <input
                                          type="checkbox"
                                          checked={editLecIsDownloadable}
                                          onChange={(e) => setEditLecIsDownloadable(e.target.checked)}
                                          className="rounded border-slate-300 dark:border-slate-850 text-violet-650 focus:ring-violet-550 h-3.5 w-3.5"
                                        />
                                        Allow Downloads
                                      </label>
                                    </div>
                                  </div>

                                  {/* Grid 4: Status & Published At */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Status</label>
                                      <select
                                        value={editLecStatus}
                                        onChange={(e) => setEditLecStatus(e.target.value)}
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold uppercase text-slate-450">Published At</label>
                                      <input
                                        type="datetime-local"
                                        value={editLecPublishedAt}
                                        disabled={editLecStatus !== 'published'}
                                        onChange={(e) => setEditLecPublishedAt(e.target.value)}
                                        className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none disabled:opacity-50 ${
                                          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-extrabold uppercase text-slate-455">Description (Optional)</label>
                                    <textarea
                                      rows={2}
                                      value={editLecDesc}
                                      onChange={(e) => setEditLecDesc(e.target.value)}
                                      className={`w-full rounded-xl border py-1.5 px-3 text-xs font-semibold outline-none resize-none ${
                                        isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                                      }`}
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateLecture(section.id, lecture.id)}
                                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-700 transition-all"
                                    >
                                      <Save className="h-3 w-3" /> Save Lecture
                                    </button>
                                    <button
                                      onClick={() => setEditingLecId(null)}
                                      className={`px-3 py-1 border rounded-lg text-[10px] font-bold ${
                                        isLight ? 'bg-white text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
                                      }`}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {!isEditingLec && (
                                <div className="flex gap-1 self-end md:self-auto shrink-0 pt-2 md:pt-0">
                                  <button
                                    onClick={() => startEditLecture(lecture)}
                                    className={`p-2 rounded-lg border transition-all ${
                                      isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-50' : 'border-slate-800 text-slate-400 hover:bg-slate-800/80'
                                    }`}
                                    title="Edit Lecture Details"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLecture(section.id, lecture.id, lecture.title)}
                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all"
                                    title="Delete Lecture"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add Lecture Button & Form Trigger */}
                    {!isAddingLec ? (
                      <button
                        onClick={() => setAddingLectureSecId(section.id)}
                        className={`w-full py-2.5 border border-dashed rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                          isLight 
                            ? 'border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-violet-600 hover:border-violet-500' 
                            : 'border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:text-violet-400 hover:border-violet-900'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                        Add Lecture to Section
                      </button>
                    ) : (
                      <form
                        onSubmit={(e) => handleAddLecture(e, section.id)}
                        className={`p-4 rounded-xl border space-y-3.5 ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/30 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-1.5">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600">Create New Lecture</h4>
                          <button
                            type="button"
                            onClick={() => setAddingLectureSecId(null)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setNewLecUploadType('upload')}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${
                              newLecUploadType === 'upload'
                                ? 'bg-violet-600 text-white shadow-sm'
                                : isLight
                                  ? 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                  : 'bg-slate-800 text-slate-350 hover:bg-slate-700'
                            }`}
                          >
                            Upload Video File
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewLecUploadType('url')}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${
                              newLecUploadType === 'url'
                                ? 'bg-violet-600 text-white shadow-sm'
                                : isLight
                                  ? 'bg-slate-100 text-slate-655 hover:bg-slate-200'
                                  : 'bg-slate-800 text-slate-355 hover:bg-slate-700'
                            }`}
                          >
                            Video URL Link
                          </button>
                        </div>
                        {/* Grid 1: Title & Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Lecture Title</label>
                            <input
                              type="text"
                              required
                              value={newLecTitle}
                              onChange={(e) => handleNewTitleChange(e.target.value)}
                              placeholder="e.g. Setting Up Environment"
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Slug</label>
                            <input
                              type="text"
                              value={newLecSlug}
                              onChange={(e) => setNewLecSlug(e.target.value)}
                              placeholder="e.g. setting-up-environment"
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Grid 2: Video Provider & Thumbnail URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Video Provider</label>
                            <select
                              value={newLecVideoProvider}
                              onChange={(e) => setNewLecVideoProvider(e.target.value)}
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            >
                              <option value="html5">HTML5 Local Video</option>
                              <option value="youtube">YouTube</option>
                              <option value="vimeo">Vimeo</option>
                              <option value="other">Other Link / External</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Thumbnail Image URL</label>
                            <input
                              type="url"
                              value={newLecThumbnailUrl}
                              onChange={(e) => setNewLecThumbnailUrl(e.target.value)}
                              placeholder="https://domain.com/lecture-thumb.jpg"
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Video File / URL Input */}
                        {newLecUploadType === 'upload' ? (
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450 block">Upload Video File</label>
                            <div className={`border-2 border-dashed rounded-xl p-2 text-center transition-all cursor-pointer relative ${
                              newLecFile 
                                ? 'border-emerald-500 bg-emerald-500/5' 
                                : isLight 
                                  ? 'border-slate-200 hover:border-violet-400 bg-slate-50/50' 
                                  : 'border-slate-805 hover:border-violet-500 bg-slate-900/30'
                            }`}>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleNewFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div className="flex flex-col items-center justify-center space-y-0.5">
                                <Upload className={`h-4 w-4 ${newLecFile ? 'text-emerald-500' : 'text-slate-400'}`} />
                                {newLecFile ? (
                                  <div>
                                    <p className="text-[9px] font-bold text-emerald-500 truncate max-w-[180px]">{newLecFile.name}</p>
                                    <p className="text-[8px] text-slate-400 font-medium">{(newLecFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace</p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-[9px] font-bold text-slate-550">Drag & drop or click</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Video URL Link (Optional)</label>
                            <input
                              type="url"
                              value={newLecVideoUrl}
                              onChange={(e) => handleNewVideoUrlChange(e.target.value)}
                              placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            />
                          </div>
                        )}

                        {newLecUploading && (
                          <div className="space-y-1 pt-0.5">
                            <div className="flex items-center justify-between text-[8px] font-extrabold uppercase text-violet-600">
                              <span>Uploading video file...</span>
                              <span>{newLecProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-violet-600 h-1 rounded-full transition-all duration-150" 
                                style={{ width: `${newLecProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Grid 3: Duration, Previews, Downloads */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-455">Duration (Minutes)</label>
                            <input
                              type="number"
                              value={newLecDuration}
                              onChange={(e) => setNewLecDuration(e.target.value)}
                              placeholder="e.g. 10"
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            />
                          </div>
                          <div className="flex items-center pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-650 dark:text-slate-350">
                              <input
                                type="checkbox"
                                checked={newLecIsPreview}
                                onChange={(e) => setNewLecIsPreview(e.target.checked)}
                                className="rounded border-slate-300 dark:border-slate-850 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
                              />
                              Free Preview
                            </label>
                          </div>
                          <div className="flex items-center pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-650 dark:text-slate-350">
                              <input
                                type="checkbox"
                                checked={newLecIsDownloadable}
                                onChange={(e) => setNewLecIsDownloadable(e.target.checked)}
                                className="rounded border-slate-300 dark:border-slate-850 text-violet-600 focus:ring-violet-500 h-3.5 w-3.5"
                              />
                              Allow Downloads
                            </label>
                          </div>
                        </div>

                        {/* Grid 4: Status & Published At */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Status</label>
                            <select
                              value={newLecStatus}
                              onChange={(e) => setNewLecStatus(e.target.value)}
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-extrabold uppercase text-slate-450">Published At</label>
                            <input
                              type="datetime-local"
                              value={newLecPublishedAt}
                              disabled={newLecStatus !== 'published'}
                              onChange={(e) => setNewLecPublishedAt(e.target.value)}
                              className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none disabled:opacity-50 ${
                                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase text-slate-450">Description (Optional)</label>
                          <textarea
                            rows={2}
                            value={newLecDesc}
                            onChange={(e) => setNewLecDesc(e.target.value)}
                            placeholder="Details about what topics or files are covered in this lecture..."
                            className={`w-full rounded-xl border py-2 px-3 text-xs font-semibold outline-none resize-none focus:ring-2 focus:ring-violet-500/20 ${
                              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-1.5 border-t border-slate-100 dark:border-slate-800/50">
                          <button
                            type="button"
                            onClick={() => setAddingLectureSecId(null)}
                            className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold ${
                              isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={savingLecture}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            {savingLecture ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            Save Lecture
                          </button>
                        </div>
                      </form>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
