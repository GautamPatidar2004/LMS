export interface InstructorProfile {
  full_name: string;
  avatar_url: string | null;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  intro_video_url: string | null;
  instructor_id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  language: string | null;
  price: number;
  discount_price: number | null;
  currency: string | null;
  duration_minutes: number | null;
  total_sections: number | null;
  total_lectures: number | null;
  certificate_enabled: boolean | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  status: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  // Joined from profiles table using instructor_id
  instructor?: InstructorProfile;
}

export interface Lecture {
  id: string;
  course_id: string;
  section_id: string;
  title: string;
  slug: string | null;
  description: string | null;
  video_url: string | null;
  video_provider: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  position: number;
  is_preview: boolean | null;
  is_downloadable: boolean | null;
  status: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  lectures?: Lecture[];
}
