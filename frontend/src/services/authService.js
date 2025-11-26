import api from './api';

const authService = {
  login: async (email, password) => {
    // Clear any old data first to prevent old username data from persisting
    localStorage.clear();

    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        role: response.data.role,
        firstName: response.data.firstName,
        lastName: response.data.lastName
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.clear();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Validate that we have firstName and lastName (not old username data)
        if (user && user.firstName && user.lastName) {
          return user;
        }
        // If old data format, clear it
        localStorage.clear();
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.clear();
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
