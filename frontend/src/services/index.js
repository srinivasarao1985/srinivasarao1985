import apiClient from './api';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const profileService = {
  updateProfile: (data) => apiClient.put('/profiles/update', data),
  getUserProfile: (userId) => apiClient.get(`/profiles/${userId}`),
  searchProfiles: (params) => apiClient.get('/profiles/search', { params }),
  likeProfile: (profileId) => apiClient.post(`/profiles/${profileId}/like`),
  blockUser: (userId) => apiClient.post(`/profiles/${userId}/block`),
};

export const messageService = {
  sendMessage: (data) => apiClient.post('/messages/send', data),
  getConversation: (userId, params) => apiClient.get(`/messages/${userId}`, { params }),
  getAllConversations: () => apiClient.get('/messages/conversations'),
};

export const paymentService = {
  createPaymentIntent: (data) => apiClient.post('/payments/create-intent', data),
  confirmPayment: (data) => apiClient.post('/payments/confirm', data),
  getPaymentHistory: () => apiClient.get('/payments/history'),
  cancelSubscription: (subscriptionId) => apiClient.post(`/payments/${subscriptionId}/cancel`),
};

export const notificationService = {
  getNotifications: (params) => apiClient.get('/notifications', { params }),
  markAsRead: (notificationId) => apiClient.post(`/notifications/${notificationId}/read`),
  markAllAsRead: () => apiClient.post('/notifications/read-all'),
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
};

export const adminService = {
  adminLogin: (credentials) => apiClient.post('/admin/login', credentials),
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  verifyUserProfile: (userId) => apiClient.post(`/admin/users/${userId}/verify`),
  getReports: (params) => apiClient.get('/admin/reports', { params }),
  resolveReport: (reportId, data) => apiClient.post(`/admin/reports/${reportId}/resolve`, data),
  getDashboardStats: () => apiClient.get('/admin/stats'),
};
