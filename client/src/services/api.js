import { apiCall } from './http';
import { eventService } from './eventService';
import { notificationService } from './notificationService';

export const authService = {
  register: (name, email, password, role = 'user') =>
    apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email, password) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => apiCall('/api/auth/me', { method: 'GET' }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const registrationService = {
  register: (eventId) => eventService.register(eventId),
  unregister: (eventId) => eventService.unregister(eventId),
  getMyRegistrations: (page = 1, limit = 10) =>
    apiCall(`/api/registrations/my-registrations?page=${page}&limit=${limit}`, {
      method: 'GET',
    }),
  getEventRegistrations: (eventId) =>
    apiCall(`/api/registrations/event/${eventId}/registrations`, {
      method: 'GET',
    }),
};

export { apiCall, eventService, notificationService };
