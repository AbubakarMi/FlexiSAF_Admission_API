-- Create payments table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT,
    applicant_id BIGINT,
    student_name VARCHAR(200) NOT NULL,
    program VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    semester VARCHAR(50),
    payment_method VARCHAR(30),
    payment_date TIMESTAMP,
    processed_by BIGINT,
    refunded_at TIMESTAMP,
    refund_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_applicant_id ON payments(applicant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_program ON payments(program);
CREATE INDEX idx_payments_payment_type ON payments(payment_type);

-- Add comments for documentation
COMMENT ON TABLE payments IS 'Stores payment records for students and applicants';
COMMENT ON COLUMN payments.student_id IS 'Reference to student (nullable for applicant payments)';
COMMENT ON COLUMN payments.applicant_id IS 'Reference to applicant (nullable for student payments)';
COMMENT ON COLUMN payments.transaction_id IS 'Unique transaction identifier';
COMMENT ON COLUMN payments.status IS 'Payment status: COMPLETED, PENDING, FAILED, REFUNDED';
COMMENT ON COLUMN payments.payment_type IS 'Type: TUITION_FEE, LAB_FEE, LIBRARY_FEE, REGISTRATION_FEE, EXAM_FEE, OTHER';

-- Insert sample payment data (20 records with various statuses, programs, and amounts)

-- Web Development Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(1, 'Adewale Johnson', 'Web Development', 450000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-WD001', 'Spring 2024', 'BANK_TRANSFER', '2024-01-15 10:30:00', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
(2, 'Ngozi Okafor', 'Web Development', 450000.00, 'TUITION_FEE', 'PENDING', 'TXN-2024-WD002', 'Spring 2024', 'CARD', NULL, '2024-01-20 14:00:00', '2024-01-20 14:00:00'),
(1, 'Adewale Johnson', 'Web Development', 75000.00, 'LAB_FEE', 'COMPLETED', 'TXN-2024-WD003', 'Spring 2024', 'BANK_TRANSFER', '2024-01-18 09:15:00', '2024-01-18 09:15:00', '2024-01-18 09:15:00'),
(3, 'Chioma Eze', 'Web Development', 450000.00, 'TUITION_FEE', 'FAILED', 'TXN-2024-WD004', 'Spring 2024', 'CARD', NULL, '2024-01-22 16:45:00', '2024-01-22 16:45:00');

-- Mobile App Development Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(4, 'Yusuf Abdullahi', 'Mobile App Development', 480000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-MA001', 'Spring 2024', 'BANK_TRANSFER', '2024-01-12 11:20:00', '2024-01-12 11:20:00', '2024-01-12 11:20:00'),
(5, 'Fatima Bello', 'Mobile App Development', 80000.00, 'LAB_FEE', 'COMPLETED', 'TXN-2024-MA002', 'Spring 2024', 'CASH', '2024-01-25 13:30:00', '2024-01-25 13:30:00', '2024-01-25 13:30:00'),
(6, 'Ibrahim Musa', 'Mobile App Development', 480000.00, 'TUITION_FEE', 'PENDING', 'TXN-2024-MA003', 'Spring 2024', 'BANK_TRANSFER', NULL, '2024-01-28 08:00:00', '2024-01-28 08:00:00');

-- Graphics Design Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(7, 'Blessing Okonkwo', 'Graphics Design', 420000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-GD001', 'Spring 2024', 'CARD', '2024-01-08 15:45:00', '2024-01-08 15:45:00', '2024-01-08 15:45:00'),
(8, 'Tunde Adeleke', 'Graphics Design', 50000.00, 'REGISTRATION_FEE', 'COMPLETED', 'TXN-2024-GD002', 'Spring 2024', 'BANK_TRANSFER', '2024-01-10 10:00:00', '2024-01-10 10:00:00', '2024-01-10 10:00:00'),
(7, 'Blessing Okonkwo', 'Graphics Design', 420000.00, 'TUITION_FEE', 'REFUNDED', 'TXN-2024-GD003', 'Fall 2023', 'CARD', '2023-12-15 14:20:00', '2023-12-15 14:20:00', '2024-01-05 16:30:00');

-- UI/UX Design Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(9, 'Kemi Adeyemi', 'UI/UX Design', 460000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-UX001', 'Spring 2024', 'BANK_TRANSFER', '2024-01-16 12:30:00', '2024-01-16 12:30:00', '2024-01-16 12:30:00'),
(10, 'Segun Ogunleye', 'UI/UX Design', 460000.00, 'TUITION_FEE', 'PENDING', 'TXN-2024-UX002', 'Spring 2024', 'CARD', NULL, '2024-01-29 09:45:00', '2024-01-29 09:45:00'),
(9, 'Kemi Adeyemi', 'UI/UX Design', 30000.00, 'LIBRARY_FEE', 'COMPLETED', 'TXN-2024-UX003', 'Spring 2024', 'CASH', '2024-01-20 11:00:00', '2024-01-20 11:00:00', '2024-01-20 11:00:00');

-- Data Science Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(11, 'Amina Sani', 'Data Science', 520000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-DS001', 'Spring 2024', 'BANK_TRANSFER', '2024-01-14 13:15:00', '2024-01-14 13:15:00', '2024-01-14 13:15:00'),
(12, 'Chukwudi Igwe', 'Data Science', 520000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-DS002', 'Spring 2024', 'CARD', '2024-01-17 10:30:00', '2024-01-17 10:30:00', '2024-01-17 10:30:00'),
(13, 'Grace Nwankwo', 'Data Science', 100000.00, 'LAB_FEE', 'PENDING', 'TXN-2024-DS003', 'Spring 2024', 'BANK_TRANSFER', NULL, '2024-01-30 14:20:00', '2024-01-30 14:20:00');

-- Artificial Intelligence Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(14, 'Olumide Balogun', 'Artificial Intelligence', 550000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-AI001', 'Spring 2024', 'BANK_TRANSFER', '2024-01-11 09:00:00', '2024-01-11 09:00:00', '2024-01-11 09:00:00'),
(15, 'Aisha Garba', 'Artificial Intelligence', 550000.00, 'TUITION_FEE', 'FAILED', 'TXN-2024-AI002', 'Spring 2024', 'CARD', NULL, '2024-01-26 15:30:00', '2024-01-26 15:30:00'),
(14, 'Olumide Balogun', 'Artificial Intelligence', 85000.00, 'EXAM_FEE', 'COMPLETED', 'TXN-2024-AI003', 'Spring 2024', 'BANK_TRANSFER', '2024-01-23 11:45:00', '2024-01-23 11:45:00', '2024-01-23 11:45:00');

-- Digital Marketing Program Payments
INSERT INTO payments (student_id, student_name, program, amount, payment_type, status, transaction_id, semester, payment_method, payment_date, created_at, updated_at) VALUES
(16, 'Funke Oluwaseun', 'Digital Marketing', 400000.00, 'TUITION_FEE', 'COMPLETED', 'TXN-2024-DM001', 'Spring 2024', 'CARD', '2024-01-09 14:00:00', '2024-01-09 14:00:00', '2024-01-09 14:00:00'),
(17, 'Emeka Obi', 'Digital Marketing', 400000.00, 'TUITION_FEE', 'PENDING', 'TXN-2024-DM002', 'Spring 2024', 'BANK_TRANSFER', NULL, '2024-01-31 10:15:00', '2024-01-31 10:15:00');

-- Update refunded payment with refund details
UPDATE payments
SET refunded_at = '2024-01-05 16:30:00',
    refund_reason = 'Student withdrew from program due to personal reasons. Full refund approved by administration.'
WHERE transaction_id = 'TXN-2024-GD003';
