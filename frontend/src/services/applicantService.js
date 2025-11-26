import api from './api';

const applicantService = {
  // Create new applicant (public endpoint)
  createApplicant: async (applicantData) => {
    const response = await api.post('/applicants', applicantData);
    return response.data;
  },

  // Get all applicants with pagination and filters
  getApplicants: async (params = {}) => {
    const {
      page = 0,
      size = 10,
      sort = 'createdAt',
      direction = 'desc',
      email = '',
      program = '',
      status = ''
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      direction
    });

    if (email) queryParams.append('email', email);
    if (program) queryParams.append('program', program);
    if (status) queryParams.append('status', status);

    const response = await api.get(`/applicants?${queryParams}`);
    return response.data;
  },

  // Get applicant by ID
  getApplicantById: async (id) => {
    const response = await api.get(`/applicants/${id}`);
    return response.data;
  },

  // Update applicant
  updateApplicant: async (id, updateData) => {
    const response = await api.put(`/applicants/${id}`, updateData);
    return response.data;
  },

  // Delete applicant (soft delete)
  deleteApplicant: async (id) => {
    await api.delete(`/applicants/${id}`);
  },

  // Get AI hint for applicant
  getAIHint: async (id) => {
    const response = await api.get(`/applicants/${id}/ai-hint`);
    return response.data;
  },

  // Get current user's application
  getMyApplication: async () => {
    const response = await api.get('/applicants/my-application');
    return response.data;
  }
};

export default applicantService;
