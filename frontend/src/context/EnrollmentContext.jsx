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
  const [paidCourses, setPaidCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load enrolled courses and paid courses from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`enrollments_${user.id}`);
      if (stored) {
        setEnrolledCourses(JSON.parse(stored));
      }

      const paidStored = localStorage.getItem(`paidCourses_${user.id}`);
      if (paidStored) {
        setPaidCourses(JSON.parse(paidStored));
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

  // Save paid courses to localStorage whenever they change
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`paidCourses_${user.id}`, JSON.stringify(paidCourses));
    }
  }, [paidCourses, user, loading]);

  const enrollInCourse = (course) => {
    // Check if already enrolled
    if (enrolledCourses.find(c => c.id === course.id)) {
      return { success: false, message: 'Already enrolled in this course' };
    }

    // Add enrollment without mock assessment data
    setEnrolledCourses(prev => [...prev, {
      ...course,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      assignments: [], // No assignments until actually assigned
      tests: [], // No tests until actually taken
      midterm: null, // No midterm until taken
      finalExam: null // No final exam until taken
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
      progress: 0,
      assignments: [], // No assignments until actually assigned
      tests: [], // No tests until actually taken
      midterm: null, // No midterm until taken
      finalExam: null // No final exam until taken
    }));

    setEnrolledCourses(prev => [...prev, ...coursesWithData]);

    return {
      success: true,
      message: `Successfully enrolled in ${newEnrollments.length} course${newEnrollments.length > 1 ? 's' : ''}`
    };
  };

  const unenrollFromCourse = (courseId) => {
    // Check if course has been paid for
    if (paidCourses.includes(courseId)) {
      return { success: false, message: 'Cannot drop course - payment has been made' };
    }

    setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
    return { success: true, message: 'Successfully unenrolled from course' };
  };

  // Mark course as paid
  const markCourseAsPaid = (courseId) => {
    if (!paidCourses.includes(courseId)) {
      setPaidCourses(prev => [...prev, courseId]);
    }
  };

  // Mark all courses as paid
  const markAllCoursesAsPaid = () => {
    const allCourseIds = enrolledCourses.map(c => c.id);
    setPaidCourses(allCourseIds);
  };

  // Check if course is paid
  const isCoursePaid = (courseId) => {
    return paidCourses.includes(courseId);
  };

  // Check if any courses are paid
  const hasAnyPaidCourses = () => {
    return paidCourses.length > 0;
  };

  // Update course assessment data
  const updateCourseAssessment = (courseId, assessmentType, data) => {
    setEnrolledCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        switch (assessmentType) {
          case 'assignment':
            return {
              ...course,
              assignments: [...(course.assignments || []), data]
            };
          case 'test':
            return {
              ...course,
              tests: [...(course.tests || []), data]
            };
          case 'midterm':
            return { ...course, midterm: data };
          case 'finalExam':
            return { ...course, finalExam: data };
          default:
            return course;
        }
      }
      return course;
    }));
  };

  // Update course progress
  const updateCourseProgress = (courseId) => {
    setEnrolledCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const assignments = course.assignments || [];
        const tests = course.tests || [];
        const hasMidterm = !!course.midterm;
        const hasFinalExam = !!course.finalExam;

        // Calculate progress based on completed assessments
        let progress = 0;
        if (assignments.length > 0) progress += 30;
        if (tests.length > 0) progress += 30;
        if (hasMidterm) progress += 20;
        if (hasFinalExam) progress += 20;

        return { ...course, progress };
      }
      return course;
    }));
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

  // Helper function to calculate course grade from actual assessment data
  const calculateCourseGrade = (course) => {
    const assignments = course.assignments || [];
    const tests = course.tests || [];
    const midterm = course.midterm;
    const finalExam = course.finalExam;

    // Only calculate grade if all assessments are completed
    if (assignments.length === 0 || tests.length === 0 || !midterm || !finalExam) {
      return null; // No grade yet - assessments not completed
    }

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
    paidCourses,
    loading,
    enrollInCourse,
    enrollInMultipleCourses,
    unenrollFromCourse,
    markCourseAsPaid,
    markAllCoursesAsPaid,
    isCoursePaid,
    hasAnyPaidCourses,
    updateCourseAssessment,
    updateCourseProgress,
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
