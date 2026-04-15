const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');


const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if available
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
};


// Authentication

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

  getCurrentUser: () =>
    apiCall('/api/auth/me', { method: 'GET' }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};


// Events

export const eventService = {
  getAll: (category = '', page = 1, limit = 10) =>
    apiCall(`/api/events?category=${category}&page=${page}&limit=${limit}`, {
      method: 'GET',
    }),

  getById: (id) =>
    apiCall(`/api/events/${id}`, { method: 'GET' }),

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

  delete: (id) =>
    apiCall(`/api/events/${id}`, { method: 'DELETE' }),

  getOrganizerEvents: () =>
    apiCall('/api/events/organizer/my-events', { method: 'GET' }),
};


// Registrations

export const registrationService = {
  register: (eventId) =>
    apiCall('/api/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    }),

  unregister: (eventId) =>
    apiCall(`/api/registrations/${eventId}`, { method: 'DELETE' }),

  getMyRegistrations: (page = 1, limit = 10) =>
    apiCall(`/api/registrations/my-registrations?page=${page}&limit=${limit}`, {
      method: 'GET',
    }),

  getEventRegistrations: (eventId) =>
    apiCall(`/api/registrations/event/${eventId}/registrations`, {
      method: 'GET',
    }),
};


// Notifications

export const notificationService = {
  getAll: (page = 1, limit = 10, unreadOnly = false) =>
    apiCall(
      `/api/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
      { method: 'GET' }
    ),

  markAsRead: (notificationId) =>
    apiCall(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    }),

  markAllAsRead: () =>
    apiCall('/api/notifications/mark-all-read', { method: 'PATCH' }),

  delete: (notificationId) =>
    apiCall(`/api/notifications/${notificationId}`, { method: 'DELETE' }),
};
