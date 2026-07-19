import { supabase } from '../lib/supabase';
import { Course, CourseSection } from '../types/course';

export const courseService = {
  /**
   * Fetches only published courses from Supabase including the joined instructor profiles.
   */
  async fetchPublishedCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
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
      `);
    // Note: We leave .eq('status', 'published') commented out to align with the user's dev environment.

    console.log('courseService.fetchPublishedCourses: Fetched raw data from Supabase:', data);
    if (error) {
      console.error('Error fetching published courses from Supabase:', error);
      throw new Error(error.message || 'Failed to fetch published courses');
    }

    return (data || []) as unknown as Course[];
  },

  /**
   * Fetches a single course by its slug, including the joined instructor profile.
   */
  async fetchCourseBySlug(slug: string): Promise<Course> {
    const decodedSlug = decodeURIComponent(slug);
    const { data, error } = await supabase
      .from('courses')
      .select(`
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
      `)
      .or(`slug.eq."${slug}",slug.eq."${decodedSlug}"`)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching course by slug "${slug}":`, error);
      throw new Error(error.message || 'Failed to fetch course details.');
    }

    if (!data) {
      throw new Error('Course not found.');
    }

    return data as unknown as Course;
  },

  /**
   * Fetches the curriculum (sections and nested lectures) for a course, sorted by position.
   * If the lectures table/relationship does not exist in the database, falls back gracefully.
   */
  async fetchCourseCurriculum(courseId: string): Promise<CourseSection[]> {
    try {
      const { data, error } = await supabase
        .from('course_sections')
        .select(`
          id,
          course_id,
          title,
          description,
          position,
          created_at,
          updated_at,
          lectures (
            id,
            course_id,
            section_id,
            title,
            slug,
            description,
            video_url,
            video_provider,
            thumbnail_url,
            duration_seconds,
            position,
            is_preview,
            is_downloadable,
            status,
            published_at,
            created_at,
            updated_at
          )
        `)
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []) as unknown as CourseSection[];
    } catch (err: any) {
      console.warn(`Database relationship to lectures not found or failed for course ID "${courseId}". Falling back to sections only. Details:`, err);

      // Fallback query: select sections only without joining the missing/restricted lectures relation
      const { data, error } = await supabase
        .from('course_sections')
        .select(`
          id,
          course_id,
          title,
          description,
          position,
          created_at,
          updated_at
        `)
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (error) {
        console.error(`Failed to fetch fallback course sections:`, error);
        throw new Error(error.message || 'Failed to fetch course curriculum.');
      }

      return (data || []).map((sec: any) => ({
        ...sec,
        lectures: []
      })) as unknown as CourseSection[];
    }
  },

  /**
   * Fetches the courses that the student has purchased / enrolled in.
   */
  async fetchEnrolledCourses(studentId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('course_enrollments')
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
      console.error('Error fetching enrolled courses:', error);
      throw new Error(error.message || 'Failed to fetch enrolled courses.');
    }

    return (data || [])
      .map((item: any) => item.course)
      .filter(Boolean) as Course[];
  },

  /**
   * Fetches the courses that the instructor has created.
   */
  async fetchInstructorCourses(instructorId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
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
      `)
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching instructor courses:', error);
      throw new Error(error.message || 'Failed to fetch instructor courses.');
    }

    return (data || []) as unknown as Course[];
  },

  /**
   * Inserts a new course record into the courses table.
   */
  async createCourse(courseData: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating course record:', error);
      throw new Error(error.message || 'Failed to create new course.');
    }

    return data;
  },

  /**
   * Updates an existing course record in the courses table.
   */
  async updateCourse(courseId: string, courseData: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating course record:', error);
      throw new Error(error.message || 'Failed to update course.');
    }

    return data;
  },

  /**
   * Deletes a course record from the courses table.
   */
  async deleteCourse(courseId: string): Promise<any> {
    const { data, error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .select();

    if (error) {
      console.error('Error deleting course record:', error);
      throw new Error(error.message || 'Failed to delete course.');
    }

    if (!data || data.length === 0) {
      throw new Error('Course could not be deleted from the database. This might be because you do not have deletion permissions (RLS) or because the course contains dependent curriculum sections.');
    }

    return data;
  },

  /**
   * Creates a new course section.
   */
  async createSection(sectionData: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .from('course_sections')
      .insert([sectionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating section:', error);
      throw new Error(error.message || 'Failed to create section.');
    }

    return data;
  },

  /**
   * Updates an existing course section.
   */
  async updateSection(sectionId: string, sectionData: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .from('course_sections')
      .update(sectionData)
      .eq('id', sectionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating section:', error);
      throw new Error(error.message || 'Failed to update section.');
    }

    return data;
  },

  /**
   * Deletes a course section.
   */
  async deleteSection(sectionId: string): Promise<any> {
    const { data, error } = await supabase
      .from('course_sections')
      .delete()
      .eq('id', sectionId)
      .select();

    if (error) {
      console.error('Error deleting section:', error);
      throw new Error(error.message || 'Failed to delete section.');
    }

    if (!data || data.length === 0) {
      throw new Error('Section could not be deleted from the database.');
    }

    return data;
  },

  /**
   * Creates a new lecture under a section.
   */
  async createLecture(lectureData: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .from('lectures')
      .insert([lectureData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lecture:', error);
      throw new Error(error.message || 'Failed to create lecture.');
    }

    return data;
  },

  /**
   * Updates an existing lecture.
   */
  async updateLecture(lectureId: string, lectureData: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .from('lectures')
      .update(lectureData)
      .eq('id', lectureId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lecture:', error);
      throw new Error(error.message || 'Failed to update lecture.');
    }

    return data;
  },

  /**
   * Deletes a lecture.
   */
  async deleteLecture(lectureId: string): Promise<any> {
    const { data, error } = await supabase
      .from('lectures')
      .delete()
      .eq('id', lectureId)
      .select();

    if (error) {
      console.error('Error deleting lecture:', error);
      throw new Error(error.message || 'Failed to delete lecture.');
    }

    if (!data || data.length === 0) {
      throw new Error('Lecture could not be deleted from the database.');
    }

    return data;
  },

  /**
   * Uploads a lecture video to Supabase Storage.
   * Attempts multiple buckets sequentially: course-videos, lectures, media, courses.
   */
  async uploadLectureVideo(
    file: File,
    courseId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${courseId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    // Simulate upload progress since supabase client does not easily expose progress callbacks
    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      if (simulatedProgress < 90) {
        simulatedProgress += 10;
        if (onProgress) onProgress(simulatedProgress);
      }
    }, 200);

    const buckets = ['course-videos', 'lectures', 'media', 'courses'];
    let lastError: any = null;
    let uploadData: any = null;
    let successfulBucket = '';

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          lastError = error;
          continue;
        }

        uploadData = data;
        successfulBucket = bucket;
        break; // Successfully uploaded!
      } catch (err: any) {
        lastError = err;
      }
    }

    clearInterval(progressInterval);

    if (!uploadData) {
      console.error('All storage upload attempts failed:', lastError);
      throw new Error(
        lastError?.message || 
        'Failed to upload file to Supabase storage. Please check if buckets (course-videos, lectures, media, courses) exist and allow uploads.'
      );
    }

    if (onProgress) onProgress(100);

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(successfulBucket)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Could not retrieve public URL for the uploaded file.');
    }

    return publicUrlData.publicUrl;
  },

  /**
   * Updates positions of multiple sections in a single batch query.
   */
  async updateSectionPositions(sectionPositions: any[]): Promise<any> {
    const { data, error } = await supabase
      .from('course_sections')
      .upsert(sectionPositions)
      .select();

    if (error) {
      console.error('Error updating section positions:', error);
      throw new Error(error.message || 'Failed to update section positions.');
    }
    return data;
  },

  /**
   * Updates positions and section IDs of multiple lectures in a single batch query.
   */
  async updateLecturePositions(lecturePositions: any[]): Promise<any> {
    const { data, error } = await supabase
      .from('lectures')
      .upsert(lecturePositions)
      .select();

    if (error) {
      console.error('Error updating lecture positions:', error);
      throw new Error(error.message || 'Failed to update lecture positions.');
    }
    return data;
  },

  /**
   * Fetches all students enrolled in any course of a given instructor,
   * along with their profiles, the specific courses they are enrolled in,
   * and the count of their completed courses (certificates done).
   */
  async fetchInstructorStudents(instructorId: string): Promise<any[]> {
    // 1. Fetch all courses created by this instructor
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('instructor_id', instructorId);

    if (coursesError) {
      console.error('Error fetching instructor courses for student list:', coursesError);
      throw new Error(coursesError.message || 'Failed to retrieve instructor courses.');
    }

    if (!courses || courses.length === 0) {
      return [];
    }

    const courseIds = courses.map(c => c.id);
    const courseMap = new Map(courses.map(c => [c.id, c.title]));

    // 2. Fetch all enrollments for these courses, joining student profiles
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('course_enrollments')
      .select(`
        student_id,
        course_id,
        completed_at,
        student:profiles!student_id (
          id,
          full_name,
          email
        )
      `)
      .in('course_id', courseIds);

    if (enrollmentsError) {
      console.error('Error fetching course enrollments for student list:', enrollmentsError);
      throw new Error(enrollmentsError.message || 'Failed to retrieve student enrollments.');
    }

    if (!enrollments || enrollments.length === 0) {
      return [];
    }

    // Extract unique student IDs
    const studentIds = Array.from(new Set(enrollments.map(e => e.student_id).filter(Boolean)));

    if (studentIds.length === 0) {
      return [];
    }

    // 3. Fetch all completed enrollments for these unique students (to count certificates)
    const { data: completedEnrollments, error: completedError } = await supabase
      .from('course_enrollments')
      .select('student_id')
      .in('student_id', studentIds)
      .not('completed_at', 'is', null);

    if (completedError) {
      console.error('Error fetching completed enrollments for student certificates:', completedError);
      throw new Error(completedError.message || 'Failed to retrieve completed enrollments.');
    }

    // Map completed counts in memory
    const completedCountsMap = new Map<string, number>();
    completedEnrollments?.forEach(ce => {
      const sId = ce.student_id;
      completedCountsMap.set(sId, (completedCountsMap.get(sId) || 0) + 1);
    });

    // Group enrollments by student
    const studentMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      coursesEnrolled: string[];
      certificatesCount: number;
    }>();

    enrollments.forEach(enroll => {
      const studentProfile = enroll.student as any;
      if (!studentProfile) return;

      const studentId = studentProfile.id;
      const courseTitle = courseMap.get(enroll.course_id) || 'Unknown Course';

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: studentId,
          name: studentProfile.full_name || 'Anonymous Student',
          email: studentProfile.email || 'N/A',
          coursesEnrolled: [courseTitle],
          certificatesCount: completedCountsMap.get(studentId) || 0
        });
      } else {
        const studentData = studentMap.get(studentId)!;
        if (!studentData.coursesEnrolled.includes(courseTitle)) {
          studentData.coursesEnrolled.push(courseTitle);
        }
      }
    });

    return Array.from(studentMap.values());
  }
};
