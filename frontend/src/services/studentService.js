import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const studentService = {
  getAllStudents: async (params = {}) => {
    const {
      page = 0,
      size = 20,
      sort = 'createdAt',
      direction = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      direction
    });

    const response = await axios.get(`${API_URL}?${queryParams}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getStudentsByProgram: async (program) => {
    const response = await axios.get(`${API_URL}/program/${encodeURIComponent(program)}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getStudentsByStatus: async (status) => {
    const response = await axios.get(`${API_URL}/status/${status}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  suspendStudent: async (id) => {
    const response = await axios.post(`${API_URL}/${id}/suspend`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  reactivateStudent: async (id) => {
    const response = await axios.post(`${API_URL}/${id}/reactivate`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default studentService;
