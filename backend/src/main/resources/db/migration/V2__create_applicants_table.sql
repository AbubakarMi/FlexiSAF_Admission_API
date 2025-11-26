-- Create applicants table
CREATE TABLE applicants (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    program VARCHAR(200) NOT NULL,
    gpa DECIMAL(3, 2) NOT NULL CHECK (gpa >= 0.0 AND gpa <= 4.0),
    test_score INTEGER NOT NULL CHECK (test_score >= 0 AND test_score <= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    ai_hint VARCHAR(50),
    ai_score DECIMAL(5, 2),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_program ON applicants(program);
CREATE INDEX idx_applicants_status ON applicants(status);
CREATE INDEX idx_applicants_deleted ON applicants(deleted);
CREATE INDEX idx_applicants_created_at ON applicants(created_at);

-- Add comments for documentation
COMMENT ON TABLE applicants IS 'Stores student applicant information';
COMMENT ON COLUMN applicants.status IS 'Application status: PENDING, IN_REVIEW, ACCEPTED, REJECTED';
COMMENT ON COLUMN applicants.ai_hint IS 'AI-generated recommendation: RECOMMENDED_ACCEPT, RECOMMENDED_REVIEW, RECOMMENDED_REJECT';
COMMENT ON COLUMN applicants.ai_score IS 'AI-calculated score (0-100) based on GPA and test score';
COMMENT ON COLUMN applicants.deleted IS 'Soft delete flag';
COMMENT ON COLUMN applicants.version IS 'Optimistic locking version';
