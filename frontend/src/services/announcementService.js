import api from './api';

const announcementService = {
  getAllAnnouncements: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },

  getAnnouncementById: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  getAnnouncementsByAudience: async (audience) => {
    const response = await api.get(`/announcements/audience/${audience}`);
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },

  updateAnnouncement: async (id, announcementData) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  togglePin: async (id) => {
    const response = await api.post(`/announcements/${id}/toggle-pin`);
    return response.data;
  }
};

export default announcementService;
