-- Create reviewer_notes table
CREATE TABLE reviewer_notes (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviewer_notes_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reviewer_notes_reviewer
        FOREIGN KEY (reviewer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_reviewer_notes_applicant_id ON reviewer_notes(applicant_id);
CREATE INDEX idx_reviewer_notes_reviewer_id ON reviewer_notes(reviewer_id);
CREATE INDEX idx_reviewer_notes_created_at ON reviewer_notes(created_at);

-- Add comments for documentation
COMMENT ON TABLE reviewer_notes IS 'Stores reviewer notes for applicants';
COMMENT ON COLUMN reviewer_notes.content IS 'Note content written by the reviewer';
