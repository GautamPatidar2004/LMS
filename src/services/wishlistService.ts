import { supabase } from '../lib/supabase';
import { Course } from '../types/course';

export const wishlistService = {
  /**
   * Fetches the complete Course objects in the student's wishlist from Supabase.
   */
  async fetchWishlist(studentId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('course_wishlist')
      .select(`
        id,
        student_id,
        course_id,
        created_at,
        course:courses (
          id,
          title,
          slug,
          subtitle,
          description,
          thumbnail_url,
          instructor_id,
          category,
          level,
          language,
          price,
          discount_price,
          duration_minutes,
          total_sections,
          total_lectures,
          is_featured,
          created_at,
          instructor:profiles!instructor_id (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('student_id', studentId);

    if (error) {
      console.error('Error fetching wishlist from Supabase:', error);
      throw new Error(error.message || 'Failed to fetch wishlist.');
    }

    return (data || [])
      .map((item: any) => item.course)
      .filter(Boolean) as Course[];
  },

  /**
   * Fetches only the course_ids that are in the student's wishlist.
   */
  async getWishlistIds(studentId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('course_wishlist')
      .select('course_id')
      .eq('student_id', studentId);

    if (error) {
      console.error('Error fetching wishlist course IDs:', error);
      throw new Error(error.message || 'Failed to fetch wishlist IDs.');
    }

    return (data || []).map((item: any) => item.course_id);
  },

  /**
   * Adds a course to the student's wishlist.
   */
  async addToWishlist(studentId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('course_wishlist')
      .insert([
        {
          student_id: studentId,
          course_id: courseId
        }
      ]);

    if (error) {
      console.error('Error inserting wishlist item:', error);
      throw new Error(error.message || 'Failed to save to wishlist.');
    }
  },

  /**
   * Removes a course from the student's wishlist.
   */
  async removeFromWishlist(studentId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('course_wishlist')
      .delete()
      .eq('student_id', studentId)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error deleting wishlist item:', error);
      throw new Error(error.message || 'Failed to remove from wishlist.');
    }
  }
};
