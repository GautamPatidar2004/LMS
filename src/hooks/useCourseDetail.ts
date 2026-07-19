import { useState, useEffect, useCallback } from 'react';
import { Course, CourseSection } from '../types/course';
import { courseService } from '../services/courseService';

export function useCourseDetail(slug: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch course details
      const courseData = await courseService.fetchCourseBySlug(slug);
      setCourse(courseData);

      // 2. Fetch course curriculum sections and lectures
      const curriculumData = await courseService.fetchCourseCurriculum(courseData.id);
      setCurriculum(curriculumData);
    } catch (err: any) {
      console.error('Error loading course details:', err);
      setError(err?.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    course,
    curriculum,
    loading,
    error,
    refetch: fetchDetail
  };
}
