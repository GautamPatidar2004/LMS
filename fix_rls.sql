-- RLS Policies for course_sections table
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone to view sections (public read access)
DROP POLICY IF EXISTS "Allow public read access to course_sections" ON course_sections;
CREATE POLICY "Allow public read access to course_sections" 
ON course_sections FOR SELECT 
USING (true);

-- 2. Allow authenticated instructors to insert sections for courses they own
DROP POLICY IF EXISTS "Allow instructors to insert course_sections" ON course_sections;
CREATE POLICY "Allow instructors to insert course_sections" 
ON course_sections FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_sections.course_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- 3. Allow authenticated instructors to update sections for courses they own
DROP POLICY IF EXISTS "Allow instructors to update course_sections" ON course_sections;
CREATE POLICY "Allow instructors to update course_sections" 
ON course_sections FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_sections.course_id 
    AND courses.instructor_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_sections.course_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- 4. Allow authenticated instructors to delete sections for courses they own
DROP POLICY IF EXISTS "Allow instructors to delete course_sections" ON course_sections;
CREATE POLICY "Allow instructors to delete course_sections" 
ON course_sections FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_sections.course_id 
    AND courses.instructor_id = auth.uid()
  )
);


-- RLS Policies for lectures table
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone to view lectures
DROP POLICY IF EXISTS "Allow public read access to lectures" ON lectures;
CREATE POLICY "Allow public read access to lectures" 
ON lectures FOR SELECT 
USING (true);

-- 2. Allow authenticated instructors to insert lectures into sections of courses they own
DROP POLICY IF EXISTS "Allow instructors to insert lectures" ON lectures;
CREATE POLICY "Allow instructors to insert lectures" 
ON lectures FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM course_sections 
    JOIN courses ON courses.id = course_sections.course_id 
    WHERE course_sections.id = lectures.section_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- 3. Allow authenticated instructors to update lectures of courses they own
DROP POLICY IF EXISTS "Allow instructors to update lectures" ON lectures;
CREATE POLICY "Allow instructors to update lectures" 
ON lectures FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM course_sections 
    JOIN courses ON courses.id = course_sections.course_id 
    WHERE course_sections.id = lectures.section_id 
    AND courses.instructor_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM course_sections 
    JOIN courses ON courses.id = course_sections.course_id 
    WHERE course_sections.id = lectures.section_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- 4. Allow authenticated instructors to delete lectures of courses they own
DROP POLICY IF EXISTS "Allow instructors to delete lectures" ON lectures;
CREATE POLICY "Allow instructors to delete lectures" 
ON lectures FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM course_sections 
    JOIN courses ON courses.id = course_sections.course_id 
    WHERE course_sections.id = lectures.section_id 
    AND courses.instructor_id = auth.uid()
  )
);
