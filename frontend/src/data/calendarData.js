// Program-specific academic calendar for skills-based programs
// Spring 2025 semester

export const PROGRAM_CALENDARS = {
  'Web Development': [
    { id: 'WD001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '10:00 AM', location: 'Online', type: 'orientation', description: 'Introduction to Web Development program and learning platform' },
    { id: 'WD002', title: 'HTML & CSS - First Assessment', date: 'February 5, 2025', month: 'February', time: '9:00 AM', location: 'Online Portal', type: 'assessment', description: 'WD01 - HTML & CSS Fundamentals assessment' },
    { id: 'WD003', title: 'JavaScript - Mid-term Project', date: 'March 10, 2025', month: 'March', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'WD02 - JavaScript Programming project submission' },
    { id: 'WD004', title: 'React - Portfolio Project Due', date: 'April 20, 2025', month: 'April', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'WD05 - React Fundamentals final portfolio' },
    { id: 'WD005', title: 'Final Capstone Project', date: 'May 10, 2025', month: 'May', time: '11:59 PM', location: 'Online Submission', type: 'capstone', description: 'Complete web application project' }
  ],

  'Mobile App Development': [
    { id: 'MA001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '2:00 PM', location: 'Online', type: 'orientation', description: 'Introduction to Mobile App Development program' },
    { id: 'MA002', title: 'Mobile Fundamentals - Quiz', date: 'February 8, 2025', month: 'February', time: '10:00 AM', location: 'Online Portal', type: 'assessment', description: 'MA01 - Mobile Development Fundamentals quiz' },
    { id: 'MA003', title: 'React Native - First App Project', date: 'March 15, 2025', month: 'March', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'MA03 - Build your first mobile app' },
    { id: 'MA004', title: 'App Store Deployment Workshop', date: 'April 5, 2025', month: 'April', time: '3:00 PM', location: 'Online', type: 'workshop', description: 'Learn to deploy apps to stores' },
    { id: 'MA005', title: 'Final Mobile App Project', date: 'May 12, 2025', month: 'May', time: '11:59 PM', location: 'Online Submission', type: 'capstone', description: 'Complete mobile application project' }
  ],

  'Graphics Design': [
    { id: 'GD001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '11:00 AM', location: 'Online', type: 'orientation', description: 'Introduction to Graphics Design program' },
    { id: 'GD002', title: 'Adobe Photoshop - First Project', date: 'February 12, 2025', month: 'February', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'GD02 - Photo editing and manipulation project' },
    { id: 'GD003', title: 'Brand Identity - Portfolio Review', date: 'March 20, 2025', month: 'March', time: '2:00 PM', location: 'Online', type: 'review', description: 'GD05 - Brand identity design critique' },
    { id: 'GD004', title: 'Print Design - Final Project', date: 'April 25, 2025', month: 'April', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'GD07 - Print design collection' },
    { id: 'GD005', title: 'Design Portfolio Presentation', date: 'May 8, 2025', month: 'May', time: '10:00 AM', location: 'Online', type: 'capstone', description: 'Present complete design portfolio' }
  ],

  'UI/UX Design': [
    { id: 'UX001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '1:00 PM', location: 'Online', type: 'orientation', description: 'Introduction to UI/UX Design program' },
    { id: 'UX002', title: 'User Research - Case Study', date: 'February 18, 2025', month: 'February', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'UX02 - User research methodology project' },
    { id: 'UX003', title: 'Wireframing - Mid-term Review', date: 'March 12, 2025', month: 'March', time: '3:00 PM', location: 'Online', type: 'review', description: 'UX03 - Wireframing peer review session' },
    { id: 'UX004', title: 'Figma - Interactive Prototype', date: 'April 15, 2025', month: 'April', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'UX06 - Complete interactive prototype' },
    { id: 'UX005', title: 'UX Portfolio Presentation', date: 'May 6, 2025', month: 'May', time: '2:00 PM', location: 'Online', type: 'capstone', description: 'Final UX case study presentation' }
  ],

  'Data Science': [
    { id: 'DS001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '9:00 AM', location: 'Online', type: 'orientation', description: 'Introduction to Data Science program' },
    { id: 'DS002', title: 'Python - Coding Assessment', date: 'February 10, 2025', month: 'February', time: '10:00 AM', location: 'Online Portal', type: 'assessment', description: 'DS01 - Python for Data Science test' },
    { id: 'DS003', title: 'Data Analysis - Project Submission', date: 'March 8, 2025', month: 'March', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'DS03 - Statistical analysis project' },
    { id: 'DS004', title: 'Machine Learning - Model Building', date: 'April 18, 2025', month: 'April', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'DS06 - Build and train ML model' },
    { id: 'DS005', title: 'Data Science Capstone Project', date: 'May 15, 2025', month: 'May', time: '11:59 PM', location: 'Online Submission', type: 'capstone', description: 'End-to-end data science project' }
  ],

  'Artificial Intelligence': [
    { id: 'AI001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '3:00 PM', location: 'Online', type: 'orientation', description: 'Introduction to AI program' },
    { id: 'AI002', title: 'AI Fundamentals - Quiz', date: 'February 15, 2025', month: 'February', time: '11:00 AM', location: 'Online Portal', type: 'assessment', description: 'AI01 - Introduction to AI assessment' },
    { id: 'AI003', title: 'Neural Networks - Project', date: 'March 18, 2025', month: 'March', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'AI04 - Build neural network model' },
    { id: 'AI004', title: 'Computer Vision - Demo Day', date: 'April 22, 2025', month: 'April', time: '1:00 PM', location: 'Online', type: 'demo', description: 'AI06 - Computer vision project demos' },
    { id: 'AI005', title: 'AI Research Paper Presentation', date: 'May 13, 2025', month: 'May', time: '10:00 AM', location: 'Online', type: 'capstone', description: 'Final AI research project' }
  ],

  'Digital Marketing': [
    { id: 'DM001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '4:00 PM', location: 'Online', type: 'orientation', description: 'Introduction to Digital Marketing program' },
    { id: 'DM002', title: 'Marketing Fundamentals - Quiz', date: 'February 6, 2025', month: 'February', time: '2:00 PM', location: 'Online Portal', type: 'assessment', description: 'DM01 - Digital marketing basics test' },
    { id: 'DM003', title: 'SEO - Campaign Project', date: 'March 5, 2025', month: 'March', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'DM03 - SEO strategy and implementation' },
    { id: 'DM004', title: 'Social Media - Campaign Review', date: 'April 10, 2025', month: 'April', time: '3:00 PM', location: 'Online', type: 'review', description: 'DM05 - Social media campaign analysis' },
    { id: 'DM005', title: 'Marketing Campaign Presentation', date: 'May 7, 2025', month: 'May', time: '2:00 PM', location: 'Online', type: 'capstone', description: 'Complete digital marketing campaign' }
  ],

  'Cybersecurity': [
    { id: 'CS001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '11:00 AM', location: 'Online', type: 'orientation', description: 'Introduction to Cybersecurity program' },
    { id: 'CS002', title: 'Network Security - Lab Assessment', date: 'February 20, 2025', month: 'February', time: '10:00 AM', location: 'Online Lab', type: 'assessment', description: 'CS02 - Network security practical' },
    { id: 'CS003', title: 'Ethical Hacking - CTF Challenge', date: 'March 22, 2025', month: 'March', time: '9:00 AM', location: 'Online', type: 'challenge', description: 'CS04 - Capture the flag competition' },
    { id: 'CS004', title: 'Incident Response - Simulation', date: 'April 12, 2025', month: 'April', time: '10:00 AM', location: 'Online', type: 'simulation', description: 'CS07 - Security incident simulation' },
    { id: 'CS005', title: 'Security Audit Final Project', date: 'May 14, 2025', month: 'May', time: '11:59 PM', location: 'Online Submission', type: 'capstone', description: 'Complete security audit report' }
  ],

  'Video Editing': [
    { id: 'VE001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '12:00 PM', location: 'Online', type: 'orientation', description: 'Introduction to Video Editing program' },
    { id: 'VE002', title: 'Premiere Pro - First Edit', date: 'February 22, 2025', month: 'February', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'VE02 - Basic video editing project' },
    { id: 'VE003', title: 'Color Grading - Workshop', date: 'March 14, 2025', month: 'March', time: '2:00 PM', location: 'Online', type: 'workshop', description: 'VE05 - Advanced color grading techniques' },
    { id: 'VE004', title: 'Motion Graphics - Project', date: 'April 28, 2025', month: 'April', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'VE08 - Motion graphics sequence' },
    { id: 'VE005', title: 'Video Portfolio Showcase', date: 'May 11, 2025', month: 'May', time: '3:00 PM', location: 'Online', type: 'capstone', description: 'Final video editing portfolio' }
  ],

  'Content Creation': [
    { id: 'CC001', title: 'Program Orientation', date: 'January 15, 2025', month: 'January', time: '1:30 PM', location: 'Online', type: 'orientation', description: 'Introduction to Content Creation program' },
    { id: 'CC002', title: 'Content Strategy - Plan Submission', date: 'February 25, 2025', month: 'February', time: '11:59 PM', location: 'Online Submission', type: 'project', description: 'CC02 - Content strategy document' },
    { id: 'CC003', title: 'Blog Writing - Portfolio Review', date: 'March 25, 2025', month: 'March', time: '4:00 PM', location: 'Online', type: 'review', description: 'CC04 - Blog post portfolio review' },
    { id: 'CC004', title: 'Video Content - Channel Launch', date: 'April 8, 2025', month: 'April', time: '11:59 PM', location: 'Online', type: 'project', description: 'CC06 - Launch content channel' },
    { id: 'CC005', title: 'Content Portfolio Presentation', date: 'May 9, 2025', month: 'May', time: '11:00 AM', location: 'Online', type: 'capstone', description: 'Multi-platform content showcase' }
  ]
};

// Common events for all programs
export const COMMON_EVENTS = [
  { id: 'COM001', title: 'Spring Semester Begins', date: 'January 15, 2025', month: 'January', time: '8:00 AM', location: 'Online', type: 'semester', description: 'First day of Spring 2025 semester for all programs' },
  { id: 'COM002', title: 'Course Enrollment Deadline', date: 'January 22, 2025', month: 'January', time: '11:59 PM', location: 'Online Portal', type: 'deadline', description: 'Last day to enroll in courses' },
  { id: 'COM003', title: 'Mid-Semester Break', date: 'March 17-21, 2025', month: 'March', time: 'All Week', location: 'N/A', type: 'holiday', description: 'Spring break - No classes' },
  { id: 'COM004', title: 'Course Withdrawal Deadline', date: 'April 1, 2025', month: 'April', time: '11:59 PM', location: 'Online Portal', type: 'deadline', description: 'Last day to withdraw from courses' },
  { id: 'COM005', title: 'Final Projects Due', date: 'May 5, 2025', month: 'May', time: '11:59 PM', location: 'Online Submission', type: 'deadline', description: 'All final project submissions due' },
  { id: 'COM006', title: 'Spring Semester Ends', date: 'May 15, 2025', month: 'May', time: '11:59 PM', location: 'Online', type: 'semester', description: 'Last day of Spring 2025 semester' },
  { id: 'COM007', title: 'Virtual Graduation Ceremony', date: 'May 20, 2025', month: 'May', time: '10:00 AM', location: 'Online', type: 'special', description: 'Graduation ceremony for completing students' }
];

// Get events for a specific program
export const getEventsByProgram = (program) => {
  const programEvents = PROGRAM_CALENDARS[program] || [];
  return [...COMMON_EVENTS, ...programEvents];
};

// Get all programs that have calendars
export const getAllCalendarPrograms = () => {
  return Object.keys(PROGRAM_CALENDARS);
};
