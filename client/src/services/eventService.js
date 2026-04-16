import { apiCall } from './http';

export const eventService = {
  getAll: (category = '', page = 1, limit = 10) =>
    apiCall(`/api/events?category=${category}&page=${page}&limit=${limit}`, {
      method: 'GET',
    }),

  getById: (id) => apiCall(`/api/events/${id}`, { method: 'GET' }),

  create: (event) =>
    apiCall('/api/events', {
      method: 'POST',
      body: JSON.stringify(event),
    }),

  update: (id, event) =>
    apiCall(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    }),

  delete: (id) => apiCall(`/api/events/${id}`, { method: 'DELETE' }),

  getOrganizerEvents: () => apiCall('/api/events/organizer/my-events', { method: 'GET' }),

  register: (eventId) => apiCall(`/api/events/${eventId}/register`, { method: 'POST' }),

  unregister: (eventId) => apiCall(`/api/events/${eventId}/unregister`, { method: 'POST' }),
};
