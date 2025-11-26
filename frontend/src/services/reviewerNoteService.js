import api from './api';

const reviewerNoteService = {
  // Add note to applicant
  addNote: async (applicantId, content) => {
    const response = await api.post(`/applicants/${applicantId}/notes`, { content });
    return response.data;
  },

  // Get all notes for applicant
  getNotes: async (applicantId) => {
    const response = await api.get(`/applicants/${applicantId}/notes`);
    return response.data;
  }
};

export default reviewerNoteService;
