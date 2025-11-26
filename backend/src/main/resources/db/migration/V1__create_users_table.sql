-- Create users table for reviewers and admins
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Insert default admin user (password: admin123)
-- BCrypt hash for 'admin123'
INSERT INTO users (username, email, password, role, created_at, updated_at)
VALUES (
    'admin',
    'admin@flexisaf.com',
    '$2a$10$YZ6rqKvQNqE8yR0nkF2NkeGWOWJQHZp4gH9TRl0jzKJGxLf8nWYFa',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
