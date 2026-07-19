import { useState, useEffect, useCallback } from 'react';
import { Course } from '../types/course';
import { courseService } from '../services/courseService';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.fetchPublishedCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching courses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
}
