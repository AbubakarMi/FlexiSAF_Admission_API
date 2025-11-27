// Centralized course data for all programs
// Each program has its own set of courses

export const PROGRAM_COURSES = {
  'Computer Science': [
    { id: 'CS101', code: 'CS101', name: 'Introduction to Programming', level: '100', credits: 3, instructor: 'Dr. Sarah Johnson', schedule: 'Mon, Wed 9:00 AM', enrolled: 45, capacity: 50, description: 'Fundamentals of programming using Python' },
    { id: 'CS102', code: 'CS102', name: 'Data Structures & Algorithms', level: '100', credits: 4, instructor: 'Prof. Michael Chen', schedule: 'Tue, Thu 10:00 AM', enrolled: 38, capacity: 40, description: 'Introduction to data structures and algorithmic thinking' },
    { id: 'CS103', code: 'CS103', name: 'Discrete Mathematics', level: '100', credits: 3, instructor: 'Dr. Ahmed Oladele', schedule: 'Mon, Wed, Fri 11:00 AM', enrolled: 42, capacity: 50, description: 'Mathematical foundations for computer science' },
    { id: 'CS201', code: 'CS201', name: 'Object-Oriented Programming', level: '200', credits: 3, instructor: 'Dr. Emily Rodriguez', schedule: 'Mon, Wed, Fri 11:00 AM', enrolled: 30, capacity: 35, description: 'Advanced OOP concepts using Java' },
    { id: 'CS202', code: 'CS202', name: 'Database Management Systems', level: '200', credits: 4, instructor: 'Prof. David Kim', schedule: 'Tue, Thu 2:00 PM', enrolled: 42, capacity: 45, description: 'Relational databases, SQL, and database design' },
    { id: 'CS203', code: 'CS203', name: 'Computer Organization', level: '200', credits: 3, instructor: 'Dr. Chinedu Okoro', schedule: 'Mon, Wed 1:00 PM', enrolled: 35, capacity: 40, description: 'Computer architecture and organization' },
    { id: 'CS301', code: 'CS301', name: 'Software Engineering', level: '300', credits: 3, instructor: 'Dr. Amanda White', schedule: 'Mon, Wed 1:00 PM', enrolled: 35, capacity: 40, description: 'Software development lifecycle and methodologies' },
    { id: 'CS302', code: 'CS302', name: 'Computer Networks', level: '300', credits: 4, instructor: 'Prof. James Brown', schedule: 'Tue, Thu 3:00 PM', enrolled: 28, capacity: 35, description: 'Network protocols, TCP/IP, and internet technologies' },
    { id: 'CS303', code: 'CS303', name: 'Operating Systems', level: '300', credits: 4, instructor: 'Dr. Lisa Anderson', schedule: 'Mon, Wed 3:00 PM', enrolled: 32, capacity: 38, description: 'OS concepts, process management, and memory management' },
    { id: 'CS304', code: 'CS304', name: 'Web Development', level: '300', credits: 3, instructor: 'Prof. Tunde Bakare', schedule: 'Tue, Thu 11:00 AM', enrolled: 40, capacity: 45, description: 'Full-stack web development with modern frameworks' },
    { id: 'CS401', code: 'CS401', name: 'Artificial Intelligence', level: '400', credits: 3, instructor: 'Prof. Robert Lee', schedule: 'Tue, Thu 11:00 AM', enrolled: 25, capacity: 30, description: 'AI concepts, search algorithms, and expert systems' },
    { id: 'CS402', code: 'CS402', name: 'Machine Learning', level: '400', credits: 4, instructor: 'Dr. Maria Garcia', schedule: 'Mon, Wed 2:00 PM', enrolled: 22, capacity: 28, description: 'ML algorithms and practical applications' },
    { id: 'CS403', code: 'CS403', name: 'Cybersecurity', level: '400', credits: 3, instructor: 'Prof. John Wilson', schedule: 'Tue, Thu 1:00 PM', enrolled: 27, capacity: 32, description: 'Security principles, cryptography, and network security' },
    { id: 'CS404', code: 'CS404', name: 'Mobile App Development', level: '400', credits: 3, instructor: 'Dr. Folake Adeyemi', schedule: 'Mon, Wed 10:00 AM', enrolled: 30, capacity: 35, description: 'iOS and Android app development' }
  ],

  'Electrical Engineering': [
    { id: 'EE101', code: 'EE101', name: 'Circuit Analysis I', level: '100', credits: 4, instructor: 'Prof. Ibrahim Musa', schedule: 'Mon, Wed 8:00 AM', enrolled: 40, capacity: 45, description: 'Basic circuit analysis and network theorems' },
    { id: 'EE102', code: 'EE102', name: 'Engineering Mathematics I', level: '100', credits: 3, instructor: 'Dr. Grace Eze', schedule: 'Tue, Thu 9:00 AM', enrolled: 38, capacity: 45, description: 'Calculus and differential equations' },
    { id: 'EE103', code: 'EE103', name: 'Introduction to Electronics', level: '100', credits: 3, instructor: 'Dr. Yemi Ogunleye', schedule: 'Mon, Wed, Fri 10:00 AM', enrolled: 35, capacity: 40, description: 'Semiconductor devices and basic electronics' },
    { id: 'EE201', code: 'EE201', name: 'Circuit Analysis II', level: '200', credits: 4, instructor: 'Prof. Akinwale Ojo', schedule: 'Tue, Thu 11:00 AM', enrolled: 32, capacity: 40, description: 'AC circuits and frequency response' },
    { id: 'EE202', code: 'EE202', name: 'Signals and Systems', level: '200', credits: 3, instructor: 'Dr. Bola Adebayo', schedule: 'Mon, Wed 1:00 PM', enrolled: 30, capacity: 35, description: 'Signal processing and system analysis' },
    { id: 'EE203', code: 'EE203', name: 'Digital Logic Design', level: '200', credits: 3, instructor: 'Prof. Chinwe Nwankwo', schedule: 'Tue, Thu 2:00 PM', enrolled: 28, capacity: 35, description: 'Boolean algebra and digital circuits' },
    { id: 'EE301', code: 'EE301', name: 'Electromagnetic Fields', level: '300', credits: 4, instructor: 'Dr. Olumide Taiwo', schedule: 'Mon, Wed 9:00 AM', enrolled: 25, capacity: 30, description: 'Electromagnetic theory and applications' },
    { id: 'EE302', code: 'EE302', name: 'Power Systems', level: '300', credits: 4, instructor: 'Prof. Ngozi Okeke', schedule: 'Tue, Thu 10:00 AM', enrolled: 27, capacity: 32, description: 'Power generation, transmission, and distribution' },
    { id: 'EE303', code: 'EE303', name: 'Control Systems', level: '300', credits: 3, instructor: 'Dr. Segun Adewale', schedule: 'Mon, Wed 2:00 PM', enrolled: 26, capacity: 30, description: 'Feedback control and system stability' },
    { id: 'EE304', code: 'EE304', name: 'Microprocessors', level: '300', credits: 3, instructor: 'Prof. Kemi Adeoye', schedule: 'Tue, Thu 3:00 PM', enrolled: 29, capacity: 35, description: 'Microprocessor architecture and programming' },
    { id: 'EE401', code: 'EE401', name: 'Renewable Energy Systems', level: '400', credits: 3, instructor: 'Dr. Adeola Oni', schedule: 'Mon, Wed 11:00 AM', enrolled: 22, capacity: 28, description: 'Solar, wind, and other renewable technologies' },
    { id: 'EE402', code: 'EE402', name: 'Communication Systems', level: '400', credits: 4, instructor: 'Prof. Fatima Hassan', schedule: 'Tue, Thu 1:00 PM', enrolled: 24, capacity: 30, description: 'Analog and digital communication' },
    { id: 'EE403', code: 'EE403', name: 'Power Electronics', level: '400', credits: 3, instructor: 'Dr. Emeka Okafor', schedule: 'Mon, Wed 3:00 PM', enrolled: 20, capacity: 25, description: 'Power semiconductor devices and converters' },
    { id: 'EE404', code: 'EE404', name: 'Robotics & Automation', level: '400', credits: 3, instructor: 'Prof. Amina Bello', schedule: 'Tue, Thu 2:00 PM', enrolled: 23, capacity: 28, description: 'Industrial automation and robotics' }
  ],

  'Mechanical Engineering': [
    { id: 'ME101', code: 'ME101', name: 'Engineering Mechanics I', level: '100', credits: 4, instructor: 'Prof. Kunle Ajayi', schedule: 'Mon, Wed 8:00 AM', enrolled: 42, capacity: 50, description: 'Statics and dynamics fundamentals' },
    { id: 'ME102', code: 'ME102', name: 'Engineering Drawing', level: '100', credits: 3, instructor: 'Dr. Blessing Obi', schedule: 'Tue, Thu 9:00 AM', enrolled: 40, capacity: 45, description: 'Technical drawing and CAD basics' },
    { id: 'ME103', code: 'ME103', name: 'Materials Science', level: '100', credits: 3, instructor: 'Prof. Uche Nnaji', schedule: 'Mon, Wed, Fri 10:00 AM', enrolled: 38, capacity: 45, description: 'Properties and structure of engineering materials' },
    { id: 'ME201', code: 'ME201', name: 'Thermodynamics I', level: '200', credits: 4, instructor: 'Dr. Rasheed Alabi', schedule: 'Mon, Wed 11:00 AM', enrolled: 35, capacity: 40, description: 'Laws of thermodynamics and energy systems' },
    { id: 'ME202', code: 'ME202', name: 'Fluid Mechanics', level: '200', credits: 4, instructor: 'Prof. Chioma Eze', schedule: 'Tue, Thu 1:00 PM', enrolled: 32, capacity: 38, description: 'Fluid properties and flow analysis' },
    { id: 'ME203', code: 'ME203', name: 'Strength of Materials', level: '200', credits: 3, instructor: 'Dr. Babatunde Cole', schedule: 'Mon, Wed 2:00 PM', enrolled: 30, capacity: 35, description: 'Stress, strain, and material failure' },
    { id: 'ME301', code: 'ME301', name: 'Machine Design', level: '300', credits: 4, instructor: 'Prof. Funmi Adeleke', schedule: 'Tue, Thu 10:00 AM', enrolled: 28, capacity: 35, description: 'Design of machine elements and systems' },
    { id: 'ME302', code: 'ME302', name: 'Heat Transfer', level: '300', credits: 3, instructor: 'Dr. Musa Ibrahim', schedule: 'Mon, Wed 9:00 AM', enrolled: 27, capacity: 32, description: 'Conduction, convection, and radiation' },
    { id: 'ME303', code: 'ME303', name: 'Manufacturing Processes', level: '300', credits: 3, instructor: 'Prof. Stella Okoro', schedule: 'Tue, Thu 2:00 PM', enrolled: 29, capacity: 35, description: 'Machining, casting, and forming processes' },
    { id: 'ME304', code: 'ME304', name: 'Dynamics of Machinery', level: '300', credits: 3, instructor: 'Dr. Olamide Adisa', schedule: 'Mon, Wed 3:00 PM', enrolled: 26, capacity: 30, description: 'Kinematics and dynamics of machines' },
    { id: 'ME401', code: 'ME401', name: 'Automotive Engineering', level: '400', credits: 3, instructor: 'Prof. Tayo Martins', schedule: 'Mon, Wed 1:00 PM', enrolled: 25, capacity: 30, description: 'Vehicle systems and automotive technology' },
    { id: 'ME402', code: 'ME402', name: 'HVAC Systems', level: '400', credits: 3, instructor: 'Dr. Nkechi Agu', schedule: 'Tue, Thu 11:00 AM', enrolled: 22, capacity: 28, description: 'Heating, ventilation, and air conditioning' },
    { id: 'ME403', code: 'ME403', name: 'Finite Element Analysis', level: '400', credits: 4, instructor: 'Prof. Seyi Afolabi', schedule: 'Mon, Wed 10:00 AM', enrolled: 20, capacity: 25, description: 'Numerical methods for engineering analysis' },
    { id: 'ME404', code: 'ME404', name: 'Mechatronics', level: '400', credits: 3, instructor: 'Dr. Ifeanyi Ogbu', schedule: 'Tue, Thu 3:00 PM', enrolled: 24, capacity: 28, description: 'Integration of mechanical and electronic systems' }
  ],

  'Civil Engineering': [
    { id: 'CE101', code: 'CE101', name: 'Surveying I', level: '100', credits: 3, instructor: 'Prof. Adebayo Sule', schedule: 'Mon, Wed 8:00 AM', enrolled: 38, capacity: 45, description: 'Basic surveying techniques and instruments' },
    { id: 'CE102', code: 'CE102', name: 'Engineering Mechanics', level: '100', credits: 4, instructor: 'Dr. Nneka Okoro', schedule: 'Tue, Thu 9:00 AM', enrolled: 40, capacity: 45, description: 'Statics and strength of materials' },
    { id: 'CE103', code: 'CE103', name: 'Construction Materials', level: '100', credits: 3, instructor: 'Prof. Yusuf Ahmed', schedule: 'Mon, Wed, Fri 10:00 AM', enrolled: 35, capacity: 40, description: 'Properties of concrete, steel, and other materials' },
    { id: 'CE201', code: 'CE201', name: 'Structural Analysis I', level: '200', credits: 4, instructor: 'Dr. Folake Adeoye', schedule: 'Mon, Wed 11:00 AM', enrolled: 32, capacity: 38, description: 'Analysis of beams, frames, and trusses' },
    { id: 'CE202', code: 'CE202', name: 'Geotechnical Engineering I', level: '200', credits: 3, instructor: 'Prof. Chukwudi Eze', schedule: 'Tue, Thu 1:00 PM', enrolled: 30, capacity: 35, description: 'Soil mechanics and foundation engineering' },
    { id: 'CE203', code: 'CE203', name: 'Hydraulics', level: '200', credits: 4, instructor: 'Dr. Aisha Mohammed', schedule: 'Mon, Wed 2:00 PM', enrolled: 28, capacity: 32, description: 'Fluid flow in pipes and open channels' },
    { id: 'CE301', code: 'CE301', name: 'Structural Design I', level: '300', credits: 4, instructor: 'Prof. Taiwo Ogunyemi', schedule: 'Tue, Thu 10:00 AM', enrolled: 27, capacity: 32, description: 'Design of steel and concrete structures' },
    { id: 'CE302', code: 'CE302', name: 'Transportation Engineering', level: '300', credits: 3, instructor: 'Dr. Emeka Nwosu', schedule: 'Mon, Wed 9:00 AM', enrolled: 25, capacity: 30, description: 'Highway design and traffic engineering' },
    { id: 'CE303', code: 'CE303', name: 'Environmental Engineering', level: '300', credits: 3, instructor: 'Prof. Grace Adebisi', schedule: 'Tue, Thu 2:00 PM', enrolled: 26, capacity: 30, description: 'Water and wastewater treatment' },
    { id: 'CE304', code: 'CE304', name: 'Construction Management', level: '300', credits: 3, instructor: 'Dr. Segun Oyedeji', schedule: 'Mon, Wed 3:00 PM', enrolled: 29, capacity: 35, description: 'Project planning and construction methods' },
    { id: 'CE401', code: 'CE401', name: 'Bridge Engineering', level: '400', credits: 4, instructor: 'Prof. Olaide Balogun', schedule: 'Mon, Wed 1:00 PM', enrolled: 22, capacity: 28, description: 'Design and analysis of bridge structures' },
    { id: 'CE402', code: 'CE402', name: 'Earthquake Engineering', level: '400', credits: 3, instructor: 'Dr. Kola Adeyemi', schedule: 'Tue, Thu 11:00 AM', enrolled: 20, capacity: 25, description: 'Seismic design and analysis' },
    { id: 'CE403', code: 'CE403', name: 'Water Resources Engineering', level: '400', credits: 3, instructor: 'Prof. Zainab Aliyu', schedule: 'Mon, Wed 10:00 AM', enrolled: 23, capacity: 28, description: 'Hydrology and water resource management' },
    { id: 'CE404', code: 'CE404', name: 'Urban Planning', level: '400', credits: 3, instructor: 'Dr. Dayo Oladele', schedule: 'Tue, Thu 3:00 PM', enrolled: 24, capacity: 30, description: 'City planning and land use' }
  ],

  'Business Administration': [
    { id: 'BA101', code: 'BA101', name: 'Principles of Management', level: '100', credits: 3, instructor: 'Prof. Modupe Adeleke', schedule: 'Mon, Wed 9:00 AM', enrolled: 50, capacity: 60, description: 'Fundamentals of management theory' },
    { id: 'BA102', code: 'BA102', name: 'Financial Accounting', level: '100', credits: 4, instructor: 'Dr. Chidi Okeke', schedule: 'Tue, Thu 10:00 AM', enrolled: 48, capacity: 55, description: 'Basic accounting principles and practices' },
    { id: 'BA103', code: 'BA103', name: 'Business Mathematics', level: '100', credits: 3, instructor: 'Prof. Funke Ojo', schedule: 'Mon, Wed, Fri 11:00 AM', enrolled: 45, capacity: 55, description: 'Quantitative methods for business' },
    { id: 'BA201', code: 'BA201', name: 'Marketing Management', level: '200', credits: 3, instructor: 'Dr. Tunde Bakare', schedule: 'Mon, Wed 1:00 PM', enrolled: 42, capacity: 50, description: 'Marketing strategies and consumer behavior' },
    { id: 'BA202', code: 'BA202', name: 'Human Resource Management', level: '200', credits: 3, instructor: 'Prof. Amina Bello', schedule: 'Tue, Thu 2:00 PM', enrolled: 40, capacity: 48, description: 'Personnel management and organizational behavior' },
    { id: 'BA203', code: 'BA203', name: 'Managerial Accounting', level: '200', credits: 4, instructor: 'Dr. Yemi Adeyemi', schedule: 'Mon, Wed 3:00 PM', enrolled: 38, capacity: 45, description: 'Cost accounting and budgeting' },
    { id: 'BA301', code: 'BA301', name: 'Corporate Finance', level: '300', credits: 4, instructor: 'Prof. Biodun Ige', schedule: 'Tue, Thu 10:00 AM', enrolled: 35, capacity: 42, description: 'Financial management and investment decisions' },
    { id: 'BA302', code: 'BA302', name: 'Operations Management', level: '300', credits: 3, instructor: 'Dr. Ngozi Nwachukwu', schedule: 'Mon, Wed 9:00 AM', enrolled: 33, capacity: 40, description: 'Production and service operations' },
    { id: 'BA303', code: 'BA303', name: 'Business Strategy', level: '300', credits: 3, instructor: 'Prof. Seun Ogunleye', schedule: 'Tue, Thu 1:00 PM', enrolled: 36, capacity: 42, description: 'Strategic planning and competitive analysis' },
    { id: 'BA304', code: 'BA304', name: 'Entrepreneurship', level: '300', credits: 3, instructor: 'Dr. Folake Williams', schedule: 'Mon, Wed 2:00 PM', enrolled: 40, capacity: 48, description: 'Starting and managing new ventures' },
    { id: 'BA401', code: 'BA401', name: 'International Business', level: '400', credits: 3, instructor: 'Prof. Ibrahim Sule', schedule: 'Mon, Wed 11:00 AM', enrolled: 30, capacity: 38, description: 'Global business operations and trade' },
    { id: 'BA402', code: 'BA402', name: 'Business Analytics', level: '400', credits: 4, instructor: 'Dr. Kemi Adeoye', schedule: 'Tue, Thu 11:00 AM', enrolled: 32, capacity: 40, description: 'Data-driven decision making' },
    { id: 'BA403', code: 'BA403', name: 'Business Law', level: '400', credits: 3, instructor: 'Prof. Olu Adebayo', schedule: 'Mon, Wed 10:00 AM', enrolled: 28, capacity: 35, description: 'Legal aspects of business operations' },
    { id: 'BA404', code: 'BA404', name: 'Digital Marketing', level: '400', credits: 3, instructor: 'Dr. Chioma Eze', schedule: 'Tue, Thu 3:00 PM', enrolled: 35, capacity: 42, description: 'Online marketing and social media strategies' }
  ],

  'Nursing': [
    { id: 'NU101', code: 'NU101', name: 'Anatomy & Physiology I', level: '100', credits: 4, instructor: 'Prof. Adaeze Okafor', schedule: 'Mon, Wed 8:00 AM', enrolled: 40, capacity: 45, description: 'Structure and function of the human body' },
    { id: 'NU102', code: 'NU102', name: 'Fundamentals of Nursing', level: '100', credits: 4, instructor: 'Dr. Fatima Hassan', schedule: 'Tue, Thu 9:00 AM', enrolled: 38, capacity: 45, description: 'Basic nursing principles and skills' },
    { id: 'NU103', code: 'NU103', name: 'Microbiology', level: '100', credits: 3, instructor: 'Prof. Uche Nnaji', schedule: 'Mon, Wed, Fri 10:00 AM', enrolled: 35, capacity: 40, description: 'Study of microorganisms and disease' },
    { id: 'NU201', code: 'NU201', name: 'Medical-Surgical Nursing I', level: '200', credits: 4, instructor: 'Dr. Blessing Obi', schedule: 'Mon, Wed 11:00 AM', enrolled: 32, capacity: 38, description: 'Care of adult patients with medical conditions' },
    { id: 'NU202', code: 'NU202', name: 'Pharmacology', level: '200', credits: 4, instructor: 'Prof. Tunde Bakare', schedule: 'Tue, Thu 1:00 PM', enrolled: 30, capacity: 35, description: 'Drug actions and nursing implications' },
    { id: 'NU203', code: 'NU203', name: 'Pathophysiology', level: '200', credits: 3, instructor: 'Dr. Ngozi Okeke', schedule: 'Mon, Wed 2:00 PM', enrolled: 28, capacity: 35, description: 'Disease processes and mechanisms' },
    { id: 'NU301', code: 'NU301', name: 'Pediatric Nursing', level: '300', credits: 4, instructor: 'Prof. Grace Adebisi', schedule: 'Tue, Thu 10:00 AM', enrolled: 27, capacity: 32, description: 'Nursing care of children and adolescents' },
    { id: 'NU302', code: 'NU302', name: 'Maternal-Child Nursing', level: '300', credits: 4, instructor: 'Dr. Kemi Adeoye', schedule: 'Mon, Wed 9:00 AM', enrolled: 25, capacity: 30, description: 'Obstetric and neonatal nursing' },
    { id: 'NU303', code: 'NU303', name: 'Mental Health Nursing', level: '300', credits: 3, instructor: 'Prof. Yemi Ogunleye', schedule: 'Tue, Thu 2:00 PM', enrolled: 26, capacity: 32, description: 'Psychiatric nursing and mental disorders' },
    { id: 'NU304', code: 'NU304', name: 'Community Health Nursing', level: '300', credits: 3, instructor: 'Dr. Amina Bello', schedule: 'Mon, Wed 3:00 PM', enrolled: 29, capacity: 35, description: 'Public health and community care' },
    { id: 'NU401', code: 'NU401', name: 'Critical Care Nursing', level: '400', credits: 4, instructor: 'Prof. Segun Adewale', schedule: 'Mon, Wed 1:00 PM', enrolled: 22, capacity: 28, description: 'ICU and emergency nursing' },
    { id: 'NU402', code: 'NU402', name: 'Leadership in Nursing', level: '400', credits: 3, instructor: 'Dr. Folake Williams', schedule: 'Tue, Thu 11:00 AM', enrolled: 20, capacity: 25, description: 'Management and leadership skills' },
    { id: 'NU403', code: 'NU403', name: 'Research Methods', level: '400', credits: 3, instructor: 'Prof. Chinwe Nwankwo', schedule: 'Mon, Wed 10:00 AM', enrolled: 23, capacity: 28, description: 'Evidence-based practice and research' },
    { id: 'NU404', code: 'NU404', name: 'Ethics in Nursing', level: '400', credits: 3, instructor: 'Dr. Olu Adebayo', schedule: 'Tue, Thu 3:00 PM', enrolled: 24, capacity: 30, description: 'Professional ethics and legal issues' }
  ]
};

// Get courses for a specific program
export const getCoursesByProgram = (program) => {
  return PROGRAM_COURSES[program] || [];
};

// Get course by ID
export const getCourseById = (courseId) => {
  for (const program in PROGRAM_COURSES) {
    const course = PROGRAM_COURSES[program].find(c => c.id === courseId);
    if (course) return course;
  }
  return null;
};

// Get all available programs
export const getAllPrograms = () => {
  return Object.keys(PROGRAM_COURSES);
};
