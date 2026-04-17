import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL;

let socket = null;

export const initSocket = () => {
  if (socket) return socket;
  if (!SOCKET_URL) {
    throw new Error('VITE_API_URL is not defined');
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
    socket.emit('joinGlobal');
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
  });

  socket.on('error', (error) => {
    console.error('[Socket] Error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper methods for common socket operations
export const joinEventRoom = (eventId) => {
  const sock = getSocket();
  sock.emit('joinEvent', eventId);
};

export const leaveEventRoom = (eventId) => {
  const sock = getSocket();
  sock.emit('leaveEvent', eventId);
};

export const joinUserRoom = (userId) => {
  const sock = getSocket();
  sock.emit('joinUserRoom', userId);
};

export const joinGlobalRoom = () => {
  const sock = getSocket();
  sock.emit('joinGlobal');
};

export const broadcastRegistration = (data) => {
  const sock = getSocket();
  sock.emit('userRegistered', data);
};

export const broadcastUnregistration = (data) => {
  const sock = getSocket();
  sock.emit('userUnregistered', data);
};
