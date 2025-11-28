import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useEnrollment } from './EnrollmentContext';

const ExamContext = createContext();

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

export const ExamProvider = ({ children }) => {
  const { user } = useAuth();
  const { enrolledCourses, updateCourseAssessment, updateCourseProgress } = useEnrollment();
  const [examData, setExamData] = useState({});
  const [loading, setLoading] = useState(true);

  // Load exam data from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`exams_${user.id}`);
      if (stored) {
        setExamData(JSON.parse(stored));
      }
    }
    setLoading(false);
  }, [user]);

  // Save exam data to localStorage
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`exams_${user.id}`, JSON.stringify(examData));
    }
  }, [examData, user, loading]);

  // Generate exam questions for a course
  const generateExamQuestions = (course) => {
    const questions = [
      {
        id: 1,
        question: `What is the primary focus of ${course.name}?`,
        options: [
          'Building web applications',
          'Data analysis',
          'Network security',
          'Mobile development'
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: `Which skill is essential for ${course.name}?`,
        options: [
          'Problem solving',
          'Creative thinking',
          'Technical expertise',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: `What tools are commonly used in ${course.name}?`,
        options: [
          'Industry-standard software',
          'Open-source frameworks',
          'Commercial platforms',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 4,
        question: `How does ${course.name} contribute to your career?`,
        options: [
          'Builds foundational knowledge',
          'Develops practical skills',
          'Enhances portfolio',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 5,
        question: `What is a key project in ${course.name}?`,
        options: [
          'Research paper',
          'Practical application',
          'Case study',
          'Group presentation'
        ],
        correctAnswer: 1
      },
      {
        id: 6,
        question: `Which concept is fundamental to ${course.name}?`,
        options: [
          'Theoretical principles',
          'Hands-on practice',
          'Industry standards',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 7,
        question: `What best practice applies to ${course.name}?`,
        options: [
          'Continuous learning',
          'Regular practice',
          'Project-based work',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 8,
        question: `How should you approach ${course.name}?`,
        options: [
          'Study theory only',
          'Practice only',
          'Balance theory and practice',
          'Focus on exams only'
        ],
        correctAnswer: 2
      },
      {
        id: 9,
        question: `What outcome is expected from ${course.name}?`,
        options: [
          'Job-ready skills',
          'Certificate only',
          'Basic knowledge',
          'Networking opportunities'
        ],
        correctAnswer: 0
      },
      {
        id: 10,
        question: `Why is ${course.name} important for your program?`,
        options: [
          'Required for graduation',
          'Builds career skills',
          'Industry demand',
          'All of the above'
        ],
        correctAnswer: 3
      }
    ];

    return questions;
  };

  // Submit assignment
  const submitAssignment = (courseId, assignmentData) => {
    const score = assignmentData.score || Math.floor(Math.random() * 16) + 85; // 85-100

    setExamData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        assignments: [...(prev[courseId]?.assignments || []), {
          name: assignmentData.name,
          score: score,
          weight: 10,
          submittedAt: new Date().toISOString()
        }]
      }
    }));

    return { success: true, score };
  };

  // Submit test
  const submitTest = (courseId, testData) => {
    const score = testData.score || Math.floor(Math.random() * 16) + 80; // 80-95

    setExamData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        tests: [...(prev[courseId]?.tests || []), {
          name: testData.name,
          score: score,
          weight: 15,
          submittedAt: new Date().toISOString()
        }]
      }
    }));

    return { success: true, score };
  };

  // Submit midterm exam
  const submitMidterm = (courseId, answers) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (!course) return { success: false, message: 'Course not found' };

    const questions = generateExamQuestions(course);
    let correctAnswers = 0;

    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    setExamData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        midterm: {
          score: score,
          weight: 20,
          submittedAt: new Date().toISOString(),
          answers: answers
        }
      }
    }));

    return { success: true, score, correctAnswers, totalQuestions: questions.length };
  };

  // Submit final exam
  const submitFinalExam = (courseId, answers) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (!course) return { success: false, message: 'Course not found' };

    const questions = generateExamQuestions(course);
    let correctAnswers = 0;

    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    setExamData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        finalExam: {
          score: score,
          weight: 20,
          submittedAt: new Date().toISOString(),
          answers: answers
        }
      }
    }));

    return { success: true, score, correctAnswers, totalQuestions: questions.length };
  };

  // Get course exam status
  const getCourseExamStatus = (courseId) => {
    const data = examData[courseId] || {};
    return {
      hasAssignments: (data.assignments?.length || 0) > 0,
      hasTests: (data.tests?.length || 0) > 0,
      hasMidterm: !!data.midterm,
      hasFinalExam: !!data.finalExam,
      assignmentsCount: data.assignments?.length || 0,
      testsCount: data.tests?.length || 0,
      isComplete: (data.assignments?.length || 0) > 0 &&
                  (data.tests?.length || 0) > 0 &&
                  !!data.midterm &&
                  !!data.finalExam
    };
  };

  // Get exam data for a course
  const getCourseExamData = (courseId) => {
    return examData[courseId] || {
      assignments: [],
      tests: [],
      midterm: null,
      finalExam: null
    };
  };

  const value = {
    examData,
    loading,
    generateExamQuestions,
    submitAssignment,
    submitTest,
    submitMidterm,
    submitFinalExam,
    getCourseExamStatus,
    getCourseExamData
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};
