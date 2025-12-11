-- Delete empty Applicant records created during registration
-- These should not exist - Applicants should only be created when students submit applications

DELETE FROM applicants
WHERE (program IS NULL OR program = '' OR program = 'null')
  AND (gpa = 0 OR gpa IS NULL)
  AND (test_score = 0 OR test_score IS NULL);

-- Verify deletion
SELECT COUNT(*) as remaining_applicants FROM applicants;
