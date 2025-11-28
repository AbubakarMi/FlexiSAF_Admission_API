import api from './api';

const paymentService = {
  getAllPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getPaymentsByStudent: async (studentId) => {
    const response = await api.get(`/payments/student/${studentId}`);
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  updatePayment: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  processPayment: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/process`);
    return response.data;
  },

  refundPayment: async (paymentId, reason) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  }
};

export default paymentService;
