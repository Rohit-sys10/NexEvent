import { apiCall } from './http';

export const notificationService = {
  getAll: (page = 1, limit = 10, unreadOnly = false) =>
    apiCall(`/api/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`, {
      method: 'GET',
    }),

  markAsRead: (notificationId) =>
    apiCall(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    }),

  markAllAsRead: () => apiCall('/api/notifications/read', { method: 'PUT' }),

  delete: (notificationId) =>
    apiCall(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    }),
};
