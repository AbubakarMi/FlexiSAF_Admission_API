// Skills-based learning platform course data
// Each program has 10 courses that students complete to finish the program

export const PROGRAM_COURSES = {
  'Web Development': [
    { id: 'WD01', code: 'WD01', name: 'HTML & CSS Fundamentals', credits: 3, instructor: 'Dr. Tunde Bakare', schedule: 'Mon, Wed 9:00 AM', enrolled: 45, capacity: 50, description: 'Learn the basics of HTML5 and CSS3 for web design' },
    { id: 'WD02', code: 'WD02', name: 'JavaScript Essentials', credits: 4, instructor: 'Prof. Ngozi Eze', schedule: 'Tue, Thu 10:00 AM', enrolled: 42, capacity: 50, description: 'Master JavaScript programming for interactive websites' },
    { id: 'WD03', code: 'WD03', name: 'Responsive Web Design', credits: 3, instructor: 'Dr. Segun Martins', schedule: 'Mon, Wed 1:00 PM', enrolled: 40, capacity: 45, description: 'Create mobile-friendly responsive websites' },
    { id: 'WD04', code: 'WD04', name: 'React.js Development', credits: 4, instructor: 'Prof. Amina Sule', schedule: 'Tue, Thu 2:00 PM', enrolled: 38, capacity: 45, description: 'Build modern web apps with React' },
    { id: 'WD05', code: 'WD05', name: 'Node.js & Express', credits: 4, instructor: 'Dr. Folake Adeleke', schedule: 'Mon, Wed 3:00 PM', enrolled: 35, capacity: 40, description: 'Backend development with Node.js' },
    { id: 'WD06', code: 'WD06', name: 'Database Design & SQL', credits: 3, instructor: 'Prof. Yemi Ogunleye', schedule: 'Tue, Thu 11:00 AM', enrolled: 37, capacity: 42, description: 'Learn database management and SQL queries' },
    { id: 'WD07', code: 'WD07', name: 'RESTful API Development', credits: 3, instructor: 'Dr. Kemi Adeoye', schedule: 'Mon, Wed 2:00 PM', enrolled: 33, capacity: 38, description: 'Create and consume RESTful APIs' },
    { id: 'WD08', code: 'WD08', name: 'Version Control with Git', credits: 2, instructor: 'Prof. Ibrahim Musa', schedule: 'Fri 10:00 AM', enrolled: 40, capacity: 45, description: 'Master Git and GitHub for collaboration' },
    { id: 'WD09', code: 'WD09', name: 'Web Security Best Practices', credits: 3, instructor: 'Dr. Grace Eze', schedule: 'Tue, Thu 1:00 PM', enrolled: 30, capacity: 35, description: 'Secure your web applications' },
    { id: 'WD10', code: 'WD10', name: 'Deployment & DevOps', credits: 3, instructor: 'Prof. Biodun Ige', schedule: 'Mon, Wed 11:00 AM', enrolled: 32, capacity: 38, description: 'Deploy and manage web applications' }
  ],

  'Mobile App Development': [
    { id: 'MA01', code: 'MA01', name: 'Mobile Development Fundamentals', credits: 3, instructor: 'Dr. Blessing Obi', schedule: 'Mon, Wed 9:00 AM', enrolled: 40, capacity: 45, description: 'Introduction to mobile app development' },
    { id: 'MA02', code: 'MA02', name: 'UI/UX Design for Mobile', credits: 3, instructor: 'Prof. Funke Ojo', schedule: 'Tue, Thu 10:00 AM', enrolled: 38, capacity: 42, description: 'Design beautiful mobile interfaces' },
    { id: 'MA03', code: 'MA03', name: 'React Native Basics', credits: 4, instructor: 'Dr. Chidi Okeke', schedule: 'Mon, Wed 1:00 PM', enrolled: 35, capacity: 40, description: 'Build cross-platform apps with React Native' },
    { id: 'MA04', code: 'MA04', name: 'Advanced React Native', credits: 4, instructor: 'Prof. Modupe Adeleke', schedule: 'Tue, Thu 2:00 PM', enrolled: 32, capacity: 38, description: 'Advanced React Native techniques' },
    { id: 'MA05', code: 'MA05', name: 'Mobile Backend Integration', credits: 4, instructor: 'Dr. Tunde Bakare', schedule: 'Mon, Wed 3:00 PM', enrolled: 30, capacity: 35, description: 'Connect mobile apps to backend services' },
    { id: 'MA06', code: 'MA06', name: 'Firebase & Cloud Services', credits: 3, instructor: 'Prof. Amina Bello', schedule: 'Tue, Thu 11:00 AM', enrolled: 28, capacity: 32, description: 'Use Firebase for mobile apps' },
    { id: 'MA07', code: 'MA07', name: 'Mobile App Testing', credits: 3, instructor: 'Dr. Yemi Adeyemi', schedule: 'Mon, Wed 2:00 PM', enrolled: 27, capacity: 32, description: 'Test and debug mobile applications' },
    { id: 'MA08', code: 'MA08', name: 'App Store Optimization', credits: 2, instructor: 'Prof. Biodun Ige', schedule: 'Fri 1:00 PM', enrolled: 30, capacity: 35, description: 'Optimize apps for app stores' },
    { id: 'MA09', code: 'MA09', name: 'Mobile Security', credits: 3, instructor: 'Dr. Ngozi Nwachukwu', schedule: 'Tue, Thu 1:00 PM', enrolled: 26, capacity: 30, description: 'Secure mobile applications' },
    { id: 'MA10', code: 'MA10', name: 'Publishing & Monetization', credits: 3, instructor: 'Prof. Seun Ogunleye', schedule: 'Mon, Wed 11:00 AM', enrolled: 25, capacity: 30, description: 'Publish and monetize your apps' }
  ],

  'Graphics Design': [
    { id: 'GD01', code: 'GD01', name: 'Design Fundamentals', credits: 3, instructor: 'Prof. Taiwo Ogunyemi', schedule: 'Mon, Wed 9:00 AM', enrolled: 48, capacity: 55, description: 'Principles of visual design' },
    { id: 'GD02', code: 'GD02', name: 'Adobe Photoshop Mastery', credits: 4, instructor: 'Dr. Emeka Nwosu', schedule: 'Tue, Thu 10:00 AM', enrolled: 45, capacity: 50, description: 'Master photo editing and manipulation' },
    { id: 'GD03', code: 'GD03', name: 'Adobe Illustrator', credits: 4, instructor: 'Prof. Grace Adebisi', schedule: 'Mon, Wed 1:00 PM', enrolled: 42, capacity: 48, description: 'Create vector graphics and illustrations' },
    { id: 'GD04', code: 'GD04', name: 'Brand Identity Design', credits: 3, instructor: 'Dr. Segun Oyedeji', schedule: 'Tue, Thu 2:00 PM', enrolled: 40, capacity: 45, description: 'Design logos and brand identities' },
    { id: 'GD05', code: 'GD05', name: 'Typography & Layout', credits: 3, instructor: 'Prof. Olaide Balogun', schedule: 'Mon, Wed 3:00 PM', enrolled: 38, capacity: 42, description: 'Master typography and page layout' },
    { id: 'GD06', code: 'GD06', name: 'Color Theory', credits: 2, instructor: 'Dr. Kola Adeyemi', schedule: 'Fri 10:00 AM', enrolled: 40, capacity: 45, description: 'Understanding color in design' },
    { id: 'GD07', code: 'GD07', name: 'Digital Illustration', credits: 4, instructor: 'Prof. Zainab Aliyu', schedule: 'Tue, Thu 11:00 AM', enrolled: 35, capacity: 40, description: 'Create digital artwork and illustrations' },
    { id: 'GD08', code: 'GD08', name: 'Packaging Design', credits: 3, instructor: 'Dr. Dayo Oladele', schedule: 'Mon, Wed 2:00 PM', enrolled: 33, capacity: 38, description: 'Design product packaging' },
    { id: 'GD09', code: 'GD09', name: 'Motion Graphics', credits: 4, instructor: 'Prof. Tayo Martins', schedule: 'Tue, Thu 1:00 PM', enrolled: 32, capacity: 36, description: 'Animate graphics for digital media' },
    { id: 'GD10', code: 'GD10', name: 'Portfolio Development', credits: 2, instructor: 'Dr. Nkechi Agu', schedule: 'Fri 2:00 PM', enrolled: 38, capacity: 42, description: 'Build your design portfolio' }
  ],

  'UI/UX Design': [
    { id: 'UX01', code: 'UX01', name: 'UX Design Fundamentals', credits: 3, instructor: 'Prof. Seyi Afolabi', schedule: 'Mon, Wed 9:00 AM', enrolled: 50, capacity: 58, description: 'Introduction to user experience design' },
    { id: 'UX02', code: 'UX02', name: 'User Research Methods', credits: 3, instructor: 'Dr. Ifeanyi Ogbu', schedule: 'Tue, Thu 10:00 AM', enrolled: 48, capacity: 55, description: 'Conduct user research and interviews' },
    { id: 'UX03', code: 'UX03', name: 'Wireframing & Prototyping', credits: 4, instructor: 'Prof. Adebayo Sule', schedule: 'Mon, Wed 1:00 PM', enrolled: 45, capacity: 52, description: 'Create wireframes and interactive prototypes' },
    { id: 'UX04', code: 'UX04', name: 'Figma for UI Design', credits: 4, instructor: 'Dr. Nneka Okoro', schedule: 'Tue, Thu 2:00 PM', enrolled: 42, capacity: 48, description: 'Master Figma for interface design' },
    { id: 'UX05', code: 'UX05', name: 'Information Architecture', credits: 3, instructor: 'Prof. Yusuf Ahmed', schedule: 'Mon, Wed 3:00 PM', enrolled: 40, capacity: 45, description: 'Organize information effectively' },
    { id: 'UX06', code: 'UX06', name: 'Interaction Design', credits: 3, instructor: 'Dr. Folake Adeoye', schedule: 'Tue, Thu 11:00 AM', enrolled: 38, capacity: 42, description: 'Design interactive user experiences' },
    { id: 'UX07', code: 'UX07', name: 'Usability Testing', credits: 3, instructor: 'Prof. Chukwudi Eze', schedule: 'Mon, Wed 2:00 PM', enrolled: 36, capacity: 40, description: 'Test and validate design decisions' },
    { id: 'UX08', code: 'UX08', name: 'Mobile UI Design', credits: 4, instructor: 'Dr. Aisha Mohammed', schedule: 'Tue, Thu 1:00 PM', enrolled: 35, capacity: 40, description: 'Design mobile app interfaces' },
    { id: 'UX09', code: 'UX09', name: 'Design Systems', credits: 3, instructor: 'Prof. Taiwo Ogunyemi', schedule: 'Mon, Wed 11:00 AM', enrolled: 33, capacity: 38, description: 'Create and maintain design systems' },
    { id: 'UX10', code: 'UX10', name: 'UX Portfolio Project', credits: 4, instructor: 'Dr. Emeka Nwosu', schedule: 'Fri 9:00 AM', enrolled: 32, capacity: 36, description: 'Complete a full UX design project' }
  ],

  'Data Science': [
    { id: 'DS01', code: 'DS01', name: 'Python for Data Science', credits: 4, instructor: 'Prof. Grace Adebisi', schedule: 'Mon, Wed 9:00 AM', enrolled: 52, capacity: 60, description: 'Learn Python programming for data analysis' },
    { id: 'DS02', code: 'DS02', name: 'Statistics for Data Science', credits: 4, instructor: 'Dr. Segun Oyedeji', schedule: 'Tue, Thu 10:00 AM', enrolled: 50, capacity: 58, description: 'Statistical methods and probability' },
    { id: 'DS03', code: 'DS03', name: 'Data Visualization', credits: 3, instructor: 'Prof. Olaide Balogun', schedule: 'Mon, Wed 1:00 PM', enrolled: 48, capacity: 55, description: 'Create compelling data visualizations' },
    { id: 'DS04', code: 'DS04', name: 'Machine Learning Basics', credits: 4, instructor: 'Dr. Kola Adeyemi', schedule: 'Tue, Thu 2:00 PM', enrolled: 45, capacity: 52, description: 'Introduction to machine learning algorithms' },
    { id: 'DS05', code: 'DS05', name: 'Data Cleaning & Preprocessing', credits: 3, instructor: 'Prof. Zainab Aliyu', schedule: 'Mon, Wed 3:00 PM', enrolled: 42, capacity: 48, description: 'Clean and prepare data for analysis' },
    { id: 'DS06', code: 'DS06', name: 'SQL & Database Query', credits: 3, instructor: 'Dr. Dayo Oladele', schedule: 'Tue, Thu 11:00 AM', enrolled: 40, capacity: 45, description: 'Query databases with SQL' },
    { id: 'DS07', code: 'DS07', name: 'Advanced Machine Learning', credits: 4, instructor: 'Prof. Tayo Martins', schedule: 'Mon, Wed 2:00 PM', enrolled: 38, capacity: 42, description: 'Deep learning and neural networks' },
    { id: 'DS08', code: 'DS08', name: 'Big Data Analytics', credits: 4, instructor: 'Dr. Nkechi Agu', schedule: 'Tue, Thu 1:00 PM', enrolled: 35, capacity: 40, description: 'Process and analyze big data' },
    { id: 'DS09', code: 'DS09', name: 'Natural Language Processing', credits: 3, instructor: 'Prof. Seyi Afolabi', schedule: 'Mon, Wed 11:00 AM', enrolled: 33, capacity: 38, description: 'Analyze and process text data' },
    { id: 'DS10', code: 'DS10', name: 'Data Science Capstone Project', credits: 4, instructor: 'Dr. Ifeanyi Ogbu', schedule: 'Fri 9:00 AM', enrolled: 32, capacity: 36, description: 'Complete real-world data science project' }
  ],

  'Artificial Intelligence': [
    { id: 'AI01', code: 'AI01', name: 'AI Fundamentals', credits: 3, instructor: 'Prof. Adebayo Sule', schedule: 'Mon, Wed 9:00 AM', enrolled: 48, capacity: 55, description: 'Introduction to artificial intelligence' },
    { id: 'AI02', code: 'AI02', name: 'Python for AI', credits: 4, instructor: 'Dr. Nneka Okoro', schedule: 'Tue, Thu 10:00 AM', enrolled: 45, capacity: 52, description: 'Python programming for AI development' },
    { id: 'AI03', code: 'AI03', name: 'Machine Learning Algorithms', credits: 4, instructor: 'Prof. Yusuf Ahmed', schedule: 'Mon, Wed 1:00 PM', enrolled: 42, capacity: 48, description: 'Supervised and unsupervised learning' },
    { id: 'AI04', code: 'AI04', name: 'Deep Learning', credits: 4, instructor: 'Dr. Folake Adeoye', schedule: 'Tue, Thu 2:00 PM', enrolled: 40, capacity: 45, description: 'Neural networks and deep learning' },
    { id: 'AI05', code: 'AI05', name: 'Computer Vision', credits: 4, instructor: 'Prof. Chukwudi Eze', schedule: 'Mon, Wed 3:00 PM', enrolled: 38, capacity: 42, description: 'Image and video processing with AI' },
    { id: 'AI06', code: 'AI06', name: 'Natural Language Processing', credits: 4, instructor: 'Dr. Aisha Mohammed', schedule: 'Tue, Thu 11:00 AM', enrolled: 36, capacity: 40, description: 'AI for text and language' },
    { id: 'AI07', code: 'AI07', name: 'Reinforcement Learning', credits: 3, instructor: 'Prof. Taiwo Ogunyemi', schedule: 'Mon, Wed 2:00 PM', enrolled: 33, capacity: 38, description: 'Training AI agents' },
    { id: 'AI08', code: 'AI08', name: 'AI Ethics & Bias', credits: 2, instructor: 'Dr. Emeka Nwosu', schedule: 'Fri 10:00 AM', enrolled: 35, capacity: 40, description: 'Ethical considerations in AI' },
    { id: 'AI09', code: 'AI09', name: 'Generative AI', credits: 4, instructor: 'Prof. Grace Adebisi', schedule: 'Tue, Thu 1:00 PM', enrolled: 32, capacity: 36, description: 'GPT, DALL-E, and generative models' },
    { id: 'AI10', code: 'AI10', name: 'AI Deployment', credits: 3, instructor: 'Dr. Segun Oyedeji', schedule: 'Mon, Wed 11:00 AM', enrolled: 30, capacity: 35, description: 'Deploy AI models to production' }
  ],

  'Digital Marketing': [
    { id: 'DM01', code: 'DM01', name: 'Digital Marketing Fundamentals', credits: 3, instructor: 'Prof. Olaide Balogun', schedule: 'Mon, Wed 9:00 AM', enrolled: 55, capacity: 65, description: 'Introduction to digital marketing' },
    { id: 'DM02', code: 'DM02', name: 'Social Media Marketing', credits: 3, instructor: 'Dr. Kola Adeyemi', schedule: 'Tue, Thu 10:00 AM', enrolled: 52, capacity: 60, description: 'Market on social media platforms' },
    { id: 'DM03', code: 'DM03', name: 'Content Marketing Strategy', credits: 3, instructor: 'Prof. Zainab Aliyu', schedule: 'Mon, Wed 1:00 PM', enrolled: 50, capacity: 58, description: 'Create and distribute valuable content' },
    { id: 'DM04', code: 'DM04', name: 'SEO & SEM', credits: 4, instructor: 'Dr. Dayo Oladele', schedule: 'Tue, Thu 2:00 PM', enrolled: 48, capacity: 55, description: 'Search engine optimization and marketing' },
    { id: 'DM05', code: 'DM05', name: 'Email Marketing', credits: 3, instructor: 'Prof. Tayo Martins', schedule: 'Mon, Wed 3:00 PM', enrolled: 45, capacity: 52, description: 'Build and manage email campaigns' },
    { id: 'DM06', code: 'DM06', name: 'Google Analytics', credits: 3, instructor: 'Dr. Nkechi Agu', schedule: 'Tue, Thu 11:00 AM', enrolled: 43, capacity: 50, description: 'Analyze website and campaign data' },
    { id: 'DM07', code: 'DM07', name: 'Paid Advertising (PPC)', credits: 4, instructor: 'Prof. Seyi Afolabi', schedule: 'Mon, Wed 2:00 PM', enrolled: 40, capacity: 48, description: 'Google Ads and Facebook Ads' },
    { id: 'DM08', code: 'DM08', name: 'Influencer Marketing', credits: 2, instructor: 'Dr. Ifeanyi Ogbu', schedule: 'Fri 1:00 PM', enrolled: 42, capacity: 48, description: 'Work with influencers effectively' },
    { id: 'DM09', code: 'DM09', name: 'Conversion Rate Optimization', credits: 3, instructor: 'Prof. Adebayo Sule', schedule: 'Tue, Thu 1:00 PM', enrolled: 38, capacity: 45, description: 'Optimize conversions and sales' },
    { id: 'DM10', code: 'DM10', name: 'Digital Marketing Campaign', credits: 3, instructor: 'Dr. Nneka Okoro', schedule: 'Mon, Wed 11:00 AM', enrolled: 36, capacity: 42, description: 'Plan and execute full campaigns' }
  ],

  'Cybersecurity': [
    { id: 'CS01', code: 'CS01', name: 'Introduction to Cybersecurity', credits: 3, instructor: 'Prof. Yusuf Ahmed', schedule: 'Mon, Wed 9:00 AM', enrolled: 45, capacity: 52, description: 'Fundamentals of information security' },
    { id: 'CS02', code: 'CS02', name: 'Network Security', credits: 4, instructor: 'Dr. Folake Adeoye', schedule: 'Tue, Thu 10:00 AM', enrolled: 42, capacity: 48, description: 'Secure network infrastructure' },
    { id: 'CS03', code: 'CS03', name: 'Ethical Hacking', credits: 4, instructor: 'Prof. Chukwudi Eze', schedule: 'Mon, Wed 1:00 PM', enrolled: 40, capacity: 45, description: 'Penetration testing and ethical hacking' },
    { id: 'CS04', code: 'CS04', name: 'Cryptography', credits: 4, instructor: 'Dr. Aisha Mohammed', schedule: 'Tue, Thu 2:00 PM', enrolled: 38, capacity: 42, description: 'Encryption and cryptographic protocols' },
    { id: 'CS05', code: 'CS05', name: 'Security Operations', credits: 3, instructor: 'Prof. Taiwo Ogunyemi', schedule: 'Mon, Wed 3:00 PM', enrolled: 36, capacity: 40, description: 'Monitor and respond to security threats' },
    { id: 'CS06', code: 'CS06', name: 'Web Application Security', credits: 3, instructor: 'Dr. Emeka Nwosu', schedule: 'Tue, Thu 11:00 AM', enrolled: 35, capacity: 40, description: 'Secure web applications from attacks' },
    { id: 'CS07', code: 'CS07', name: 'Incident Response', credits: 3, instructor: 'Prof. Grace Adebisi', schedule: 'Mon, Wed 2:00 PM', enrolled: 33, capacity: 38, description: 'Handle security incidents' },
    { id: 'CS08', code: 'CS08', name: 'Cloud Security', credits: 4, instructor: 'Dr. Segun Oyedeji', schedule: 'Tue, Thu 1:00 PM', enrolled: 32, capacity: 36, description: 'Secure cloud infrastructure' },
    { id: 'CS09', code: 'CS09', name: 'Malware Analysis', credits: 3, instructor: 'Prof. Olaide Balogun', schedule: 'Mon, Wed 11:00 AM', enrolled: 30, capacity: 35, description: 'Analyze and reverse engineer malware' },
    { id: 'CS10', code: 'CS10', name: 'Security Certifications Prep', credits: 3, instructor: 'Dr. Kola Adeyemi', schedule: 'Fri 9:00 AM', enrolled: 28, capacity: 32, description: 'Prepare for industry certifications' }
  ],

  'Video Editing': [
    { id: 'VE01', code: 'VE01', name: 'Video Editing Fundamentals', credits: 3, instructor: 'Prof. Zainab Aliyu', schedule: 'Mon, Wed 9:00 AM', enrolled: 42, capacity: 48, description: 'Basics of video editing' },
    { id: 'VE02', code: 'VE02', name: 'Adobe Premiere Pro', credits: 4, instructor: 'Dr. Dayo Oladele', schedule: 'Tue, Thu 10:00 AM', enrolled: 40, capacity: 45, description: 'Master Premiere Pro for video editing' },
    { id: 'VE03', code: 'VE03', name: 'Final Cut Pro', credits: 4, instructor: 'Prof. Tayo Martins', schedule: 'Mon, Wed 1:00 PM', enrolled: 38, capacity: 42, description: 'Edit videos with Final Cut Pro' },
    { id: 'VE04', code: 'VE04', name: 'Color Grading & Correction', credits: 3, instructor: 'Dr. Nkechi Agu', schedule: 'Tue, Thu 2:00 PM', enrolled: 36, capacity: 40, description: 'Professional color correction' },
    { id: 'VE05', code: 'VE05', name: 'Audio Editing for Video', credits: 3, instructor: 'Prof. Seyi Afolabi', schedule: 'Mon, Wed 3:00 PM', enrolled: 35, capacity: 40, description: 'Edit and mix audio tracks' },
    { id: 'VE06', code: 'VE06', name: 'Motion Graphics with After Effects', credits: 4, instructor: 'Dr. Ifeanyi Ogbu', schedule: 'Tue, Thu 11:00 AM', enrolled: 33, capacity: 38, description: 'Create motion graphics and VFX' },
    { id: 'VE07', code: 'VE07', name: 'Video Storytelling', credits: 2, instructor: 'Prof. Adebayo Sule', schedule: 'Fri 10:00 AM', enrolled: 37, capacity: 42, description: 'Craft compelling video narratives' },
    { id: 'VE08', code: 'VE08', name: 'YouTube Content Creation', credits: 3, instructor: 'Dr. Nneka Okoro', schedule: 'Mon, Wed 2:00 PM', enrolled: 40, capacity: 45, description: 'Create and optimize YouTube videos' },
    { id: 'VE09', code: 'VE09', name: 'Commercial Video Production', credits: 4, instructor: 'Prof. Yusuf Ahmed', schedule: 'Tue, Thu 1:00 PM', enrolled: 32, capacity: 36, description: 'Produce professional commercial videos' },
    { id: 'VE10', code: 'VE10', name: 'Portfolio Reel Creation', credits: 2, instructor: 'Dr. Folake Adeoye', schedule: 'Fri 2:00 PM', enrolled: 35, capacity: 40, description: 'Build your video editing portfolio' }
  ],

  'Content Creation': [
    { id: 'CC01', code: 'CC01', name: 'Content Strategy', credits: 3, instructor: 'Prof. Chukwudi Eze', schedule: 'Mon, Wed 9:00 AM', enrolled: 50, capacity: 58, description: 'Plan and strategize content creation' },
    { id: 'CC02', code: 'CC02', name: 'Writing for Digital Media', credits: 3, instructor: 'Dr. Aisha Mohammed', schedule: 'Tue, Thu 10:00 AM', enrolled: 48, capacity: 55, description: 'Write engaging online content' },
    { id: 'CC03', code: 'CC03', name: 'Photography for Content', credits: 4, instructor: 'Prof. Taiwo Ogunyemi', schedule: 'Mon, Wed 1:00 PM', enrolled: 45, capacity: 52, description: 'Take professional photos for content' },
    { id: 'CC04', code: 'CC04', name: 'Video Content Creation', credits: 4, instructor: 'Dr. Emeka Nwosu', schedule: 'Tue, Thu 2:00 PM', enrolled: 42, capacity: 48, description: 'Create video content for platforms' },
    { id: 'CC05', code: 'CC05', name: 'Social Media Content', credits: 3, instructor: 'Prof. Grace Adebisi', schedule: 'Mon, Wed 3:00 PM', enrolled: 47, capacity: 55, description: 'Create content for social media' },
    { id: 'CC06', code: 'CC06', name: 'Podcasting', credits: 3, instructor: 'Dr. Segun Oyedeji', schedule: 'Tue, Thu 11:00 AM', enrolled: 40, capacity: 45, description: 'Start and grow a podcast' },
    { id: 'CC07', code: 'CC07', name: 'Live Streaming', credits: 3, instructor: 'Prof. Olaide Balogun', schedule: 'Mon, Wed 2:00 PM', enrolled: 38, capacity: 42, description: 'Master live streaming platforms' },
    { id: 'CC08', code: 'CC08', name: 'Content Analytics', credits: 3, instructor: 'Dr. Kola Adeyemi', schedule: 'Tue, Thu 1:00 PM', enrolled: 36, capacity: 40, description: 'Measure and analyze content performance' },
    { id: 'CC09', code: 'CC09', name: 'Monetization Strategies', credits: 3, instructor: 'Prof. Zainab Aliyu', schedule: 'Mon, Wed 11:00 AM', enrolled: 40, capacity: 45, description: 'Monetize your content' },
    { id: 'CC10', code: 'CC10', name: 'Building Your Brand', credits: 2, instructor: 'Dr. Dayo Oladele', schedule: 'Fri 1:00 PM', enrolled: 42, capacity: 48, description: 'Build a personal brand as a creator' }
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
