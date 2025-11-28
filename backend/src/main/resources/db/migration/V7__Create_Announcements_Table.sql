-- Create announcements table
CREATE TABLE announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience VARCHAR(20) NOT NULL DEFAULT 'ALL',
    priority VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    author VARCHAR(100),
    author_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_announcements_pinned ON announcements(pinned);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_announcements_audience ON announcements(audience);
CREATE INDEX idx_announcements_priority ON announcements(priority);

-- Add comments for documentation
COMMENT ON TABLE announcements IS 'Stores system-wide announcements for students and applicants';
COMMENT ON COLUMN announcements.audience IS 'Target audience: ALL, STUDENTS, APPLICANTS';
COMMENT ON COLUMN announcements.priority IS 'Priority level: HIGH, NORMAL';
COMMENT ON COLUMN announcements.pinned IS 'Whether the announcement is pinned to the top';

-- Insert sample announcement data (7 records with various audiences and priorities)

INSERT INTO announcements (title, content, audience, priority, pinned, author, author_id, created_at, updated_at) VALUES
(
    'Spring 2024 Admission Results Now Available',
    'We are pleased to announce that Spring 2024 admission results are now available. All applicants can check their application status by logging into the admission portal. Successful applicants should proceed with the enrollment process within 14 days of receiving their admission letter. Congratulations to all admitted students!',
    'APPLICANTS',
    'HIGH',
    TRUE,
    'Admissions Office',
    1,
    '2024-01-15 10:00:00',
    '2024-01-15 10:00:00'
),
(
    'Course Registration Deadline - January 31st',
    'Reminder: Course registration for Spring 2024 semester closes on January 31st, 2024 at 11:59 PM. All currently enrolled students must complete their course registration before the deadline. Late registration will incur a penalty fee of N50,000. If you need assistance with course selection, please contact your academic advisor or visit the Registrar Office during business hours.',
    'STUDENTS',
    'HIGH',
    TRUE,
    'Registrar Office',
    2,
    '2024-01-18 09:30:00',
    '2024-01-18 09:30:00'
),
(
    'New Student Orientation - February 5th',
    'All new students are invited to attend the mandatory orientation session on February 5th, 2024 at 10:00 AM in the Main Auditorium (Block A, 3rd Floor). During this session, you will learn about campus facilities, academic policies, student support services, and meet your peers and faculty members. Please arrive 15 minutes early for registration. Refreshments will be provided.',
    'ALL',
    'NORMAL',
    FALSE,
    'Student Affairs',
    3,
    '2024-01-20 14:00:00',
    '2024-01-20 14:00:00'
),
(
    'Library Extended Hours During Exam Period',
    'The university library will be open 24/7 during the exam period from February 10th to February 28th, 2024 to support your studies. Take advantage of our quiet study spaces, computer labs, and extensive resource collection. Free coffee and snacks will be available from 8 PM to 8 AM. Group study rooms can be booked online through the library portal.',
    'STUDENTS',
    'NORMAL',
    FALSE,
    'Library Services',
    4,
    '2024-01-22 11:00:00',
    '2024-01-22 11:00:00'
),
(
    'Tuition Payment Deadline Reminder',
    'This is an important reminder that tuition payment for Spring 2024 semester is due by January 28th, 2024. Students who fail to pay by the deadline will incur a late payment penalty of N100,000. Multiple payment options are available including bank transfer, online payment, and in-person payment at the Bursary Office. For financial assistance or payment plan inquiries, please contact the Finance Office.',
    'ALL',
    'HIGH',
    FALSE,
    'Finance Office',
    5,
    '2024-01-24 08:00:00',
    '2024-01-24 08:00:00'
),
(
    'Career Fair and Industry Networking Event',
    'Join us for our annual Career Fair on March 15th, 2024 from 9:00 AM to 4:00 PM at the Campus Sports Complex. Meet with representatives from leading tech companies, startups, and multinational corporations. Bring multiple copies of your resume and dress professionally. Workshop sessions on resume writing, interview skills, and career planning will be held throughout the day. This is an excellent opportunity to explore internship and job opportunities.',
    'STUDENTS',
    'NORMAL',
    FALSE,
    'Career Services',
    6,
    '2024-01-26 13:30:00',
    '2024-01-26 13:30:00'
),
(
    'Campus WiFi Network Upgrade - Scheduled Maintenance',
    'Please be informed that we will be performing a major upgrade to our campus WiFi network on Saturday, February 3rd, 2024 from 12:00 AM to 6:00 AM. Internet services will be temporarily unavailable during this period. This upgrade will significantly improve network speed, coverage, and reliability. We apologize for any inconvenience and appreciate your understanding. For urgent connectivity needs during this time, please use the computer labs in the Library building.',
    'ALL',
    'NORMAL',
    FALSE,
    'IT Services',
    7,
    '2024-01-28 16:00:00',
    '2024-01-28 16:00:00'
);
