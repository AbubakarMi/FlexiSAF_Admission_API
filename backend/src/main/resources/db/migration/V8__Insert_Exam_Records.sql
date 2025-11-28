-- Insert MIDTERM and FINAL exams for each course
-- This creates 200 exam records (2 per course) for the 100 courses in the system

-- Insert MIDTERM exams for all courses
INSERT INTO exams (course_id, exam_type, published, exam_date, duration_minutes, total_marks, instructions, created_at, updated_at)
SELECT
    id as course_id,
    'MIDTERM' as exam_type,
    false as published,
    CURRENT_TIMESTAMP + INTERVAL '30 days' as exam_date,
    120 as duration_minutes,
    100 as total_marks,
    'Midterm Exam: Complete all questions. No external materials allowed. Show all work for partial credit.' as instructions,
    CURRENT_TIMESTAMP as created_at,
    CURRENT_TIMESTAMP as updated_at
FROM courses;

-- Insert FINAL exams for all courses
INSERT INTO exams (course_id, exam_type, published, exam_date, duration_minutes, total_marks, instructions, created_at, updated_at)
SELECT
    id as course_id,
    'FINAL' as exam_type,
    false as published,
    CURRENT_TIMESTAMP + INTERVAL '90 days' as exam_date,
    180 as duration_minutes,
    100 as total_marks,
    'Final Comprehensive Exam: Answer all sections. Covers all course material. No external materials allowed.' as instructions,
    CURRENT_TIMESTAMP as created_at,
    CURRENT_TIMESTAMP as updated_at
FROM courses;
