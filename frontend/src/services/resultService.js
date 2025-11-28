import axios from 'axios';

const API_URL = 'http://localhost:8080/api/results';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const resultService = {
  getResultsByCourse: async (courseId) => {
    const response = await axios.get(`${API_URL}/course/${courseId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getResultsByStudent: async (studentId) => {
    const response = await axios.get(`${API_URL}/student/${studentId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  publishResults: async (courseId) => {
    const response = await axios.post(`${API_URL}/${courseId}/publish`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  unpublishResults: async (courseId) => {
    const response = await axios.post(`${API_URL}/${courseId}/unpublish`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default resultService;
