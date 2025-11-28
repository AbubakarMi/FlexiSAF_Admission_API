-- Complete cleanup script to remove all sample data created by DataLoader
-- Database: Admission_Db
-- This will leave only real data from actual system usage

-- Step 1: Delete sample payments
DELETE FROM payments WHERE transaction_id LIKE 'TXN-NGN-2025-%';

-- Step 2: Delete sample students
DELETE FROM students WHERE student_id LIKE 'STU-2024-%';

-- Step 3: Delete user accounts for sample students
DELETE FROM users
WHERE role = 'STUDENT'
AND email LIKE '%@flexisaf.edu.ng'
AND id NOT IN (SELECT user_id FROM students WHERE student_id NOT LIKE 'STU-2024-%');

-- Verify results
SELECT 'Remaining Payments' as data_type, COUNT(*) as count FROM payments
UNION ALL
SELECT 'Remaining Students', COUNT(*) FROM students
UNION ALL
SELECT 'Remaining Users (Students)', COUNT(*) FROM users WHERE role = 'STUDENT';
