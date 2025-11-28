import axios from 'axios';

const API_URL = 'http://localhost:8080/api/exams';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const examService = {
  getExamsByCourse: async (courseId) => {
    const response = await axios.get(`${API_URL}/course/${courseId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  publishExam: async (examId) => {
    const response = await axios.post(`${API_URL}/${examId}/publish`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  unpublishExam: async (examId) => {
    const response = await axios.post(`${API_URL}/${examId}/unpublish`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getExamStatus: async (courseId) => {
    const response = await axios.get(`${API_URL}/${courseId}/status`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default examService;
