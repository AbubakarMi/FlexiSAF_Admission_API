-- Add firstName and lastName columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Migrate existing username data to firstName/lastName for existing users
-- For users with username, use username as firstName and 'User' as lastName
UPDATE users
SET first_name = username, last_name = 'User'
WHERE first_name IS NULL;

-- Make firstName and lastName NOT NULL after migration
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;

-- Drop the username column
ALTER TABLE users DROP COLUMN username;
