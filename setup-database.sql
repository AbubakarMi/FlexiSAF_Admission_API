-- FlexiSAF Admissions System - Database Setup Script
-- Run this in PostgreSQL as the postgres user

-- Create the database
CREATE DATABASE "Admission_Db"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the database
\c "Admission_Db"

-- Grant all privileges to postgres user (already the owner)
GRANT ALL ON SCHEMA public TO postgres;

-- Note: The Spring Boot application will automatically create tables via Flyway migrations
-- when you start the application for the first time.
