-- Create courses table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    credits INTEGER NOT NULL,
    instructor VARCHAR(100),
    schedule VARCHAR(100),
    program VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL DEFAULT 50,
    enrolled INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create exams table
CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    exam_type VARCHAR(20) NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    exam_date TIMESTAMP,
    duration_minutes INTEGER,
    instructions TEXT,
    total_marks INTEGER DEFAULT 100,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    published_by BIGINT,
    CONSTRAINT unique_course_exam_type UNIQUE (course_id, exam_type)
);

-- Create students table
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    applicant_id BIGINT,
    student_id VARCHAR(50) UNIQUE,
    program VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    enrollment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    graduation_date TIMESTAMP,
    gpa DECIMAL(3, 2) NOT NULL DEFAULT 0.0,
    credits_earned INTEGER DEFAULT 0,
    credits_required INTEGER DEFAULT 120,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create results table
CREATE TABLE results (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    exam_type VARCHAR(20) NOT NULL,
    assignments_score DECIMAL(5, 2),
    tests_score DECIMAL(5, 2),
    exam_score DECIMAL(5, 2),
    overall_score DECIMAL(5, 2),
    grade VARCHAR(5),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    comments TEXT,
    graded_by BIGINT,
    graded_at TIMESTAMP,
    published_at TIMESTAMP,
    published_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_course_exam UNIQUE (student_id, course_id, exam_type)
);

-- Create indexes for better query performance
CREATE INDEX idx_courses_program ON courses(program);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_active ON courses(active);

CREATE INDEX idx_exams_course_id ON exams(course_id);
CREATE INDEX idx_exams_exam_type ON exams(exam_type);
CREATE INDEX idx_exams_published ON exams(published);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_program ON students(program);
CREATE INDEX idx_students_status ON students(status);

CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_results_course_id ON results(course_id);
CREATE INDEX idx_results_published ON results(published);

-- Add comments for documentation
COMMENT ON TABLE courses IS 'Stores course information for different programs';
COMMENT ON TABLE exams IS 'Stores exam information for courses';
COMMENT ON TABLE students IS 'Stores student enrollment and academic information';
COMMENT ON TABLE results IS 'Stores student results for courses and exams';

-- Insert sample course data for all programs
-- Web Development Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('WD01', 'HTML & CSS Fundamentals', 3, 'Dr. Tunde Bakare', 'Mon, Wed 9:00 AM', 'Web Development', 'Learn the basics of HTML5 and CSS3 for web design', 50, 45, true),
('WD02', 'JavaScript Essentials', 4, 'Prof. Ngozi Eze', 'Tue, Thu 10:00 AM', 'Web Development', 'Master JavaScript programming for interactive websites', 50, 42, true),
('WD03', 'Responsive Web Design', 3, 'Dr. Segun Martins', 'Mon, Wed 1:00 PM', 'Web Development', 'Create mobile-friendly responsive websites', 45, 40, true),
('WD04', 'React.js Development', 4, 'Prof. Amina Sule', 'Tue, Thu 2:00 PM', 'Web Development', 'Build modern web apps with React', 45, 38, true),
('WD05', 'Node.js & Express', 4, 'Dr. Folake Adeleke', 'Mon, Wed 3:00 PM', 'Web Development', 'Backend development with Node.js', 40, 35, true),
('WD06', 'Database Design & SQL', 3, 'Prof. Yemi Ogunleye', 'Tue, Thu 11:00 AM', 'Web Development', 'Learn database management and SQL queries', 42, 37, true),
('WD07', 'RESTful API Development', 3, 'Dr. Kemi Adeoye', 'Mon, Wed 2:00 PM', 'Web Development', 'Create and consume RESTful APIs', 38, 33, true),
('WD08', 'Version Control with Git', 2, 'Prof. Ibrahim Musa', 'Fri 10:00 AM', 'Web Development', 'Master Git and GitHub for collaboration', 45, 40, true),
('WD09', 'Web Security Best Practices', 3, 'Dr. Grace Eze', 'Tue, Thu 1:00 PM', 'Web Development', 'Secure your web applications', 35, 30, true),
('WD10', 'Deployment & DevOps', 3, 'Prof. Biodun Ige', 'Mon, Wed 11:00 AM', 'Web Development', 'Deploy and manage web applications', 38, 32, true);

-- Mobile App Development Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('MA01', 'Mobile Development Fundamentals', 3, 'Dr. Blessing Obi', 'Mon, Wed 9:00 AM', 'Mobile App Development', 'Introduction to mobile app development', 45, 40, true),
('MA02', 'UI/UX Design for Mobile', 3, 'Prof. Funke Ojo', 'Tue, Thu 10:00 AM', 'Mobile App Development', 'Design beautiful mobile interfaces', 42, 38, true),
('MA03', 'React Native Basics', 4, 'Dr. Chidi Okeke', 'Mon, Wed 1:00 PM', 'Mobile App Development', 'Build cross-platform apps with React Native', 40, 35, true),
('MA04', 'Advanced React Native', 4, 'Prof. Modupe Adeleke', 'Tue, Thu 2:00 PM', 'Mobile App Development', 'Advanced React Native techniques', 38, 32, true),
('MA05', 'Mobile Backend Integration', 4, 'Dr. Tunde Bakare', 'Mon, Wed 3:00 PM', 'Mobile App Development', 'Connect mobile apps to backend services', 35, 30, true),
('MA06', 'Firebase & Cloud Services', 3, 'Prof. Amina Bello', 'Tue, Thu 11:00 AM', 'Mobile App Development', 'Use Firebase for mobile apps', 32, 28, true),
('MA07', 'Mobile App Testing', 3, 'Dr. Yemi Adeyemi', 'Mon, Wed 2:00 PM', 'Mobile App Development', 'Test and debug mobile applications', 32, 27, true),
('MA08', 'App Store Optimization', 2, 'Prof. Biodun Ige', 'Fri 1:00 PM', 'Mobile App Development', 'Optimize apps for app stores', 35, 30, true),
('MA09', 'Mobile Security', 3, 'Dr. Ngozi Nwachukwu', 'Tue, Thu 1:00 PM', 'Mobile App Development', 'Secure mobile applications', 30, 26, true),
('MA10', 'Publishing & Monetization', 3, 'Prof. Seun Ogunleye', 'Mon, Wed 11:00 AM', 'Mobile App Development', 'Publish and monetize your apps', 30, 25, true);

-- Graphics Design Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('GD01', 'Design Fundamentals', 3, 'Prof. Taiwo Ogunyemi', 'Mon, Wed 9:00 AM', 'Graphics Design', 'Principles of visual design', 55, 48, true),
('GD02', 'Adobe Photoshop Mastery', 4, 'Dr. Emeka Nwosu', 'Tue, Thu 10:00 AM', 'Graphics Design', 'Master photo editing and manipulation', 50, 45, true),
('GD03', 'Adobe Illustrator', 4, 'Prof. Grace Adebisi', 'Mon, Wed 1:00 PM', 'Graphics Design', 'Create vector graphics and illustrations', 48, 42, true),
('GD04', 'Brand Identity Design', 3, 'Dr. Segun Oyedeji', 'Tue, Thu 2:00 PM', 'Graphics Design', 'Design logos and brand identities', 45, 40, true),
('GD05', 'Typography & Layout', 3, 'Prof. Olaide Balogun', 'Mon, Wed 3:00 PM', 'Graphics Design', 'Master typography and page layout', 42, 38, true),
('GD06', 'Color Theory', 2, 'Dr. Kola Adeyemi', 'Fri 10:00 AM', 'Graphics Design', 'Understanding color in design', 45, 40, true),
('GD07', 'Digital Illustration', 4, 'Prof. Zainab Aliyu', 'Tue, Thu 11:00 AM', 'Graphics Design', 'Create digital artwork and illustrations', 40, 35, true),
('GD08', 'Packaging Design', 3, 'Dr. Dayo Oladele', 'Mon, Wed 2:00 PM', 'Graphics Design', 'Design product packaging', 38, 33, true),
('GD09', 'Motion Graphics', 4, 'Prof. Tayo Martins', 'Tue, Thu 1:00 PM', 'Graphics Design', 'Animate graphics for digital media', 36, 32, true),
('GD10', 'Portfolio Development', 2, 'Dr. Nkechi Agu', 'Fri 2:00 PM', 'Graphics Design', 'Build your design portfolio', 42, 38, true);

-- UI/UX Design Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('UX01', 'UX Design Fundamentals', 3, 'Prof. Seyi Afolabi', 'Mon, Wed 9:00 AM', 'UI/UX Design', 'Introduction to user experience design', 58, 50, true),
('UX02', 'User Research Methods', 3, 'Dr. Ifeanyi Ogbu', 'Tue, Thu 10:00 AM', 'UI/UX Design', 'Conduct user research and interviews', 55, 48, true),
('UX03', 'Wireframing & Prototyping', 4, 'Prof. Adebayo Sule', 'Mon, Wed 1:00 PM', 'UI/UX Design', 'Create wireframes and interactive prototypes', 52, 45, true),
('UX04', 'Figma for UI Design', 4, 'Dr. Nneka Okoro', 'Tue, Thu 2:00 PM', 'UI/UX Design', 'Master Figma for interface design', 48, 42, true),
('UX05', 'Information Architecture', 3, 'Prof. Yusuf Ahmed', 'Mon, Wed 3:00 PM', 'UI/UX Design', 'Organize information effectively', 45, 40, true),
('UX06', 'Interaction Design', 3, 'Dr. Folake Adeoye', 'Tue, Thu 11:00 AM', 'UI/UX Design', 'Design interactive user experiences', 42, 38, true),
('UX07', 'Usability Testing', 3, 'Prof. Chukwudi Eze', 'Mon, Wed 2:00 PM', 'UI/UX Design', 'Test and validate design decisions', 40, 36, true),
('UX08', 'Mobile UI Design', 4, 'Dr. Aisha Mohammed', 'Tue, Thu 1:00 PM', 'UI/UX Design', 'Design mobile app interfaces', 40, 35, true),
('UX09', 'Design Systems', 3, 'Prof. Taiwo Ogunyemi', 'Mon, Wed 11:00 AM', 'UI/UX Design', 'Create and maintain design systems', 38, 33, true),
('UX10', 'UX Portfolio Project', 4, 'Dr. Emeka Nwosu', 'Fri 9:00 AM', 'UI/UX Design', 'Complete a full UX design project', 36, 32, true);

-- Data Science Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('DS01', 'Python for Data Science', 4, 'Prof. Grace Adebisi', 'Mon, Wed 9:00 AM', 'Data Science', 'Learn Python programming for data analysis', 60, 52, true),
('DS02', 'Statistics for Data Science', 4, 'Dr. Segun Oyedeji', 'Tue, Thu 10:00 AM', 'Data Science', 'Statistical methods and probability', 58, 50, true),
('DS03', 'Data Visualization', 3, 'Prof. Olaide Balogun', 'Mon, Wed 1:00 PM', 'Data Science', 'Create compelling data visualizations', 55, 48, true),
('DS04', 'Machine Learning Basics', 4, 'Dr. Kola Adeyemi', 'Tue, Thu 2:00 PM', 'Data Science', 'Introduction to machine learning algorithms', 52, 45, true),
('DS05', 'Data Cleaning & Preprocessing', 3, 'Prof. Zainab Aliyu', 'Mon, Wed 3:00 PM', 'Data Science', 'Clean and prepare data for analysis', 48, 42, true),
('DS06', 'SQL & Database Query', 3, 'Dr. Dayo Oladele', 'Tue, Thu 11:00 AM', 'Data Science', 'Query databases with SQL', 45, 40, true),
('DS07', 'Advanced Machine Learning', 4, 'Prof. Tayo Martins', 'Mon, Wed 2:00 PM', 'Data Science', 'Deep learning and neural networks', 42, 38, true),
('DS08', 'Big Data Analytics', 4, 'Dr. Nkechi Agu', 'Tue, Thu 1:00 PM', 'Data Science', 'Process and analyze big data', 40, 35, true),
('DS09', 'Natural Language Processing', 3, 'Prof. Seyi Afolabi', 'Mon, Wed 11:00 AM', 'Data Science', 'Analyze and process text data', 38, 33, true),
('DS10', 'Data Science Capstone Project', 4, 'Dr. Ifeanyi Ogbu', 'Fri 9:00 AM', 'Data Science', 'Complete real-world data science project', 36, 32, true);

-- Artificial Intelligence Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('AI01', 'AI Fundamentals', 3, 'Prof. Adebayo Sule', 'Mon, Wed 9:00 AM', 'Artificial Intelligence', 'Introduction to artificial intelligence', 55, 48, true),
('AI02', 'Python for AI', 4, 'Dr. Nneka Okoro', 'Tue, Thu 10:00 AM', 'Artificial Intelligence', 'Python programming for AI development', 52, 45, true),
('AI03', 'Machine Learning Algorithms', 4, 'Prof. Yusuf Ahmed', 'Mon, Wed 1:00 PM', 'Artificial Intelligence', 'Supervised and unsupervised learning', 48, 42, true),
('AI04', 'Deep Learning', 4, 'Dr. Folake Adeoye', 'Tue, Thu 2:00 PM', 'Artificial Intelligence', 'Neural networks and deep learning', 45, 40, true),
('AI05', 'Computer Vision', 4, 'Prof. Chukwudi Eze', 'Mon, Wed 3:00 PM', 'Artificial Intelligence', 'Image and video processing with AI', 42, 38, true),
('AI06', 'Natural Language Processing', 4, 'Dr. Aisha Mohammed', 'Tue, Thu 11:00 AM', 'Artificial Intelligence', 'AI for text and language', 40, 36, true),
('AI07', 'Reinforcement Learning', 3, 'Prof. Taiwo Ogunyemi', 'Mon, Wed 2:00 PM', 'Artificial Intelligence', 'Training AI agents', 38, 33, true),
('AI08', 'AI Ethics & Bias', 2, 'Dr. Emeka Nwosu', 'Fri 10:00 AM', 'Artificial Intelligence', 'Ethical considerations in AI', 40, 35, true),
('AI09', 'Generative AI', 4, 'Prof. Grace Adebisi', 'Tue, Thu 1:00 PM', 'Artificial Intelligence', 'GPT, DALL-E, and generative models', 36, 32, true),
('AI10', 'AI Deployment', 3, 'Dr. Segun Oyedeji', 'Mon, Wed 11:00 AM', 'Artificial Intelligence', 'Deploy AI models to production', 35, 30, true);

-- Digital Marketing Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('DM01', 'Digital Marketing Fundamentals', 3, 'Prof. Olaide Balogun', 'Mon, Wed 9:00 AM', 'Digital Marketing', 'Introduction to digital marketing', 65, 55, true),
('DM02', 'Social Media Marketing', 3, 'Dr. Kola Adeyemi', 'Tue, Thu 10:00 AM', 'Digital Marketing', 'Market on social media platforms', 60, 52, true),
('DM03', 'Content Marketing Strategy', 3, 'Prof. Zainab Aliyu', 'Mon, Wed 1:00 PM', 'Digital Marketing', 'Create and distribute valuable content', 58, 50, true),
('DM04', 'SEO & SEM', 4, 'Dr. Dayo Oladele', 'Tue, Thu 2:00 PM', 'Digital Marketing', 'Search engine optimization and marketing', 55, 48, true),
('DM05', 'Email Marketing', 3, 'Prof. Tayo Martins', 'Mon, Wed 3:00 PM', 'Digital Marketing', 'Build and manage email campaigns', 52, 45, true),
('DM06', 'Google Analytics', 3, 'Dr. Nkechi Agu', 'Tue, Thu 11:00 AM', 'Digital Marketing', 'Analyze website and campaign data', 50, 43, true),
('DM07', 'Paid Advertising (PPC)', 4, 'Prof. Seyi Afolabi', 'Mon, Wed 2:00 PM', 'Digital Marketing', 'Google Ads and Facebook Ads', 48, 40, true),
('DM08', 'Influencer Marketing', 2, 'Dr. Ifeanyi Ogbu', 'Fri 1:00 PM', 'Digital Marketing', 'Work with influencers effectively', 48, 42, true),
('DM09', 'Conversion Rate Optimization', 3, 'Prof. Adebayo Sule', 'Tue, Thu 1:00 PM', 'Digital Marketing', 'Optimize conversions and sales', 45, 38, true),
('DM10', 'Digital Marketing Campaign', 3, 'Dr. Nneka Okoro', 'Mon, Wed 11:00 AM', 'Digital Marketing', 'Plan and execute full campaigns', 42, 36, true);

-- Cybersecurity Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('CS01', 'Introduction to Cybersecurity', 3, 'Prof. Yusuf Ahmed', 'Mon, Wed 9:00 AM', 'Cybersecurity', 'Fundamentals of information security', 52, 45, true),
('CS02', 'Network Security', 4, 'Dr. Folake Adeoye', 'Tue, Thu 10:00 AM', 'Cybersecurity', 'Secure network infrastructure', 48, 42, true),
('CS03', 'Ethical Hacking', 4, 'Prof. Chukwudi Eze', 'Mon, Wed 1:00 PM', 'Cybersecurity', 'Penetration testing and ethical hacking', 45, 40, true),
('CS04', 'Cryptography', 4, 'Dr. Aisha Mohammed', 'Tue, Thu 2:00 PM', 'Cybersecurity', 'Encryption and cryptographic protocols', 42, 38, true),
('CS05', 'Security Operations', 3, 'Prof. Taiwo Ogunyemi', 'Mon, Wed 3:00 PM', 'Cybersecurity', 'Monitor and respond to security threats', 40, 36, true),
('CS06', 'Web Application Security', 3, 'Dr. Emeka Nwosu', 'Tue, Thu 11:00 AM', 'Cybersecurity', 'Secure web applications from attacks', 40, 35, true),
('CS07', 'Incident Response', 3, 'Prof. Grace Adebisi', 'Mon, Wed 2:00 PM', 'Cybersecurity', 'Handle security incidents', 38, 33, true),
('CS08', 'Cloud Security', 4, 'Dr. Segun Oyedeji', 'Tue, Thu 1:00 PM', 'Cybersecurity', 'Secure cloud infrastructure', 36, 32, true),
('CS09', 'Malware Analysis', 3, 'Prof. Olaide Balogun', 'Mon, Wed 11:00 AM', 'Cybersecurity', 'Analyze and reverse engineer malware', 35, 30, true),
('CS10', 'Security Certifications Prep', 3, 'Dr. Kola Adeyemi', 'Fri 9:00 AM', 'Cybersecurity', 'Prepare for industry certifications', 32, 28, true);

-- Video Editing Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('VE01', 'Video Editing Fundamentals', 3, 'Prof. Zainab Aliyu', 'Mon, Wed 9:00 AM', 'Video Editing', 'Basics of video editing', 48, 42, true),
('VE02', 'Adobe Premiere Pro', 4, 'Dr. Dayo Oladele', 'Tue, Thu 10:00 AM', 'Video Editing', 'Master Premiere Pro for video editing', 45, 40, true),
('VE03', 'Final Cut Pro', 4, 'Prof. Tayo Martins', 'Mon, Wed 1:00 PM', 'Video Editing', 'Edit videos with Final Cut Pro', 42, 38, true),
('VE04', 'Color Grading & Correction', 3, 'Dr. Nkechi Agu', 'Tue, Thu 2:00 PM', 'Video Editing', 'Professional color correction', 40, 36, true),
('VE05', 'Audio Editing for Video', 3, 'Prof. Seyi Afolabi', 'Mon, Wed 3:00 PM', 'Video Editing', 'Edit and mix audio tracks', 40, 35, true),
('VE06', 'Motion Graphics with After Effects', 4, 'Dr. Ifeanyi Ogbu', 'Tue, Thu 11:00 AM', 'Video Editing', 'Create motion graphics and VFX', 38, 33, true),
('VE07', 'Video Storytelling', 2, 'Prof. Adebayo Sule', 'Fri 10:00 AM', 'Video Editing', 'Craft compelling video narratives', 42, 37, true),
('VE08', 'YouTube Content Creation', 3, 'Dr. Nneka Okoro', 'Mon, Wed 2:00 PM', 'Video Editing', 'Create and optimize YouTube videos', 45, 40, true),
('VE09', 'Commercial Video Production', 4, 'Prof. Yusuf Ahmed', 'Tue, Thu 1:00 PM', 'Video Editing', 'Produce professional commercial videos', 36, 32, true),
('VE10', 'Portfolio Reel Creation', 2, 'Dr. Folake Adeoye', 'Fri 2:00 PM', 'Video Editing', 'Build your video editing portfolio', 40, 35, true);

-- Content Creation Courses
INSERT INTO courses (code, name, credits, instructor, schedule, program, description, capacity, enrolled, active) VALUES
('CC01', 'Content Strategy', 3, 'Prof. Chukwudi Eze', 'Mon, Wed 9:00 AM', 'Content Creation', 'Plan and strategize content creation', 58, 50, true),
('CC02', 'Writing for Digital Media', 3, 'Dr. Aisha Mohammed', 'Tue, Thu 10:00 AM', 'Content Creation', 'Write engaging online content', 55, 48, true),
('CC03', 'Photography for Content', 4, 'Prof. Taiwo Ogunyemi', 'Mon, Wed 1:00 PM', 'Content Creation', 'Take professional photos for content', 52, 45, true),
('CC04', 'Video Content Creation', 4, 'Dr. Emeka Nwosu', 'Tue, Thu 2:00 PM', 'Content Creation', 'Create video content for platforms', 48, 42, true),
('CC05', 'Social Media Content', 3, 'Prof. Grace Adebisi', 'Mon, Wed 3:00 PM', 'Content Creation', 'Create content for social media', 55, 47, true),
('CC06', 'Podcasting', 3, 'Dr. Segun Oyedeji', 'Tue, Thu 11:00 AM', 'Content Creation', 'Start and grow a podcast', 45, 40, true),
('CC07', 'Live Streaming', 3, 'Prof. Olaide Balogun', 'Mon, Wed 2:00 PM', 'Content Creation', 'Master live streaming platforms', 42, 38, true),
('CC08', 'Content Analytics', 3, 'Dr. Kola Adeyemi', 'Tue, Thu 1:00 PM', 'Content Creation', 'Measure and analyze content performance', 40, 36, true),
('CC09', 'Monetization Strategies', 3, 'Prof. Zainab Aliyu', 'Mon, Wed 11:00 AM', 'Content Creation', 'Monetize your content', 45, 40, true),
('CC10', 'Building Your Brand', 2, 'Dr. Dayo Oladele', 'Fri 1:00 PM', 'Content Creation', 'Build a personal brand as a creator', 48, 42, true);
