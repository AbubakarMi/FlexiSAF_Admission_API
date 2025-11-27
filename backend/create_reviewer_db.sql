-- Create reviewer account directly in database
-- Password: admin123 (BCrypt encrypted)

-- First, delete any existing reviewer account with this email
DELETE FROM users WHERE email = 'reviewer@flexisaf.com';

-- Insert new reviewer account
-- Password is 'admin123' encrypted with BCrypt
-- This hash was generated using BCryptPasswordEncoder with strength 10
INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
VALUES (
    'Admin',
    'Reviewer',
    'reviewer@flexisaf.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'REVIEWER',
    NOW(),
    NOW()
);

-- Verify the account was created
SELECT id, first_name, last_name, email, role, created_at
FROM users
WHERE email = 'reviewer@flexisaf.com';

-- Display login credentials
SELECT 'Reviewer account created successfully!' as message;
SELECT 'Email: reviewer@flexisaf.com' as credential;
SELECT 'Password: admin123' as credential;
