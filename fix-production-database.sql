-- Fix Production Database Issues
-- Run this on Render PostgreSQL database

-- Delete empty Applicant records that were created during registration
-- These are records with null or default values that shouldn't exist yet
DELETE FROM applicants
WHERE (gpa IS NULL OR gpa = 0 OR gpa = 0.0)
  AND (test_score IS NULL OR test_score = 0)
  AND (program IS NULL OR program = '' OR TRIM(program) = '');

-- Verify the results
SELECT COUNT(*) as total_applicants_remaining FROM applicants;
SELECT COUNT(*) as total_users FROM users;
SELECT email, role FROM users WHERE role IN ('REVIEWER', 'ADMIN');
