import axios from 'axios';

const API_URL = 'http://localhost:8080/api/enrollments';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const enrollmentService = {
  // Enroll student in a single course
  enrollInCourse: async (studentId, courseId) => {
    const response = await axios.post(
      `${API_URL}/student/${studentId}/course/${courseId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Enroll student in multiple courses
  enrollInMultipleCourses: async (studentId, courseIds) => {
    const response = await axios.post(
      `${API_URL}/student/${studentId}/courses`,
      { courseIds },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get all enrollments for a student
  getStudentEnrollments: async (studentId) => {
    const response = await axios.get(
      `${API_URL}/student/${studentId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get active enrollments for a student
  getActiveEnrollments: async (studentId) => {
    const response = await axios.get(
      `${API_URL}/student/${studentId}/active`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Drop a course
  dropCourse: async (studentId, courseId) => {
    const response = await axios.delete(
      `${API_URL}/student/${studentId}/course/${courseId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Check if student is enrolled in a course
  checkEnrollment: async (studentId, courseId) => {
    const response = await axios.get(
      `${API_URL}/student/${studentId}/course/${courseId}/check`,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};

export default enrollmentService;
