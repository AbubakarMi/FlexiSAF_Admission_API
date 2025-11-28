import axios from 'axios';

const API_URL = 'http://localhost:8080/api/courses';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const courseService = {
  getAllCourses: async () => {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getCoursesByProgram: async (program) => {
    const response = await axios.get(`${API_URL}/program/${encodeURIComponent(program)}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getActiveCourses: async () => {
    const response = await axios.get(`${API_URL}/active`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await axios.post(API_URL, courseData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await axios.put(`${API_URL}/${id}`, courseData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default courseService;
