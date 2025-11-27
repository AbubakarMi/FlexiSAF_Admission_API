import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const EnrollmentContext = createContext();

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};

export const EnrollmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`enrollments_${user.id}`);
      if (stored) {
        setEnrolledCourses(JSON.parse(stored));
      }
    }
    setLoading(false);
  }, [user]);

  // Save enrolled courses to localStorage whenever they change
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`enrollments_${user.id}`, JSON.stringify(enrolledCourses));
    }
  }, [enrolledCourses, user, loading]);

  const enrollInCourse = (course) => {
    // Check if already enrolled
    if (enrolledCourses.find(c => c.id === course.id)) {
      return { success: false, message: 'Already enrolled in this course' };
    }

    // Add enrollment
    setEnrolledCourses(prev => [...prev, {
      ...course,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      assignments: generateAssignments(course),
      tests: generateTests(course),
      midterm: generateMidterm(),
      finalExam: null // Final exam not yet taken
    }]);

    return { success: true, message: 'Successfully enrolled in course' };
  };

  const enrollInMultipleCourses = (courses) => {
    const newEnrollments = courses.filter(course =>
      !enrolledCourses.find(c => c.id === course.id)
    );

    if (newEnrollments.length === 0) {
      return { success: false, message: 'Already enrolled in all selected courses' };
    }

    const coursesWithData = newEnrollments.map(course => ({
      ...course,
      enrolledDate: new Date().toISOString(),
      progress: Math.floor(Math.random() * 30) + 50, // Random progress 50-80%
      assignments: generateAssignments(course),
      tests: generateTests(course),
      midterm: generateMidterm(),
      finalExam: null
    }));

    setEnrolledCourses(prev => [...prev, ...coursesWithData]);

    return {
      success: true,
      message: `Successfully enrolled in ${newEnrollments.length} course${newEnrollments.length > 1 ? 's' : ''}`
    };
  };

  const unenrollFromCourse = (courseId) => {
    setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
    return { success: true, message: 'Successfully unenrolled from course' };
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c.id === courseId);
  };

  const getCourseById = (courseId) => {
    return enrolledCourses.find(c => c.id === courseId);
  };

  // Calculate GPA from enrolled courses
  const calculateGPA = () => {
    if (enrolledCourses.length === 0) return 0;

    const totalPoints = enrolledCourses.reduce((sum, course) => {
      const gradePoints = getGradePoints(course.grade || calculateCourseGrade(course));
      return sum + (gradePoints * course.credits);
    }, 0);

    const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credits, 0);

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  // Helper functions
  const generateAssignments = (course) => {
    const count = Math.floor(Math.random() * 2) + 2; // 2-3 assignments
    return Array.from({ length: count }, (_, i) => ({
      name: `Assignment ${i + 1}`,
      score: Math.floor(Math.random() * 16) + 85, // 85-100
      weight: 10
    }));
  };

  const generateTests = (course) => {
    return [
      { name: 'Test 1', score: Math.floor(Math.random() * 16) + 80, weight: 15 },
      { name: 'Test 2', score: Math.floor(Math.random() * 16) + 80, weight: 15 }
    ];
  };

  const generateMidterm = () => {
    return { score: Math.floor(Math.random() * 16) + 80, weight: 20 };
  };

  const calculateCourseGrade = (course) => {
    const assignments = course.assignments || [];
    const tests = course.tests || [];
    const midterm = course.midterm || { score: 0, weight: 0 };
    const finalExam = course.finalExam || { score: Math.floor(Math.random() * 16) + 85, weight: 20 };

    const assignmentAvg = assignments.reduce((sum, a) => sum + a.score, 0) / assignments.length;
    const testAvg = tests.reduce((sum, t) => sum + t.score, 0) / tests.length;

    const total = (assignmentAvg * 0.3) + (testAvg * 0.3) + (midterm.score * 0.2) + (finalExam.score * 0.2);

    if (total >= 90) return 'A';
    if (total >= 85) return 'A-';
    if (total >= 80) return 'B+';
    if (total >= 75) return 'B';
    if (total >= 70) return 'B-';
    if (total >= 65) return 'C+';
    if (total >= 60) return 'C';
    return 'D';
  };

  const getGradePoints = (grade) => {
    const gradeMap = {
      'A': 4.0, 'A-': 3.7,
      'B+': 3.5, 'B': 3.0, 'B-': 2.7,
      'C+': 2.5, 'C': 2.0, 'C-': 1.7,
      'D+': 1.5, 'D': 1.0,
      'F': 0.0
    };
    return gradeMap[grade] || 0;
  };

  const value = {
    enrolledCourses,
    loading,
    enrollInCourse,
    enrollInMultipleCourses,
    unenrollFromCourse,
    isEnrolled,
    getCourseById,
    calculateGPA
  };

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};
