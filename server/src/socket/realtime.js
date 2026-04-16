let ioInstance = null;

export const setRealtimeIO = (io) => {
  ioInstance = io;
};

export const getRealtimeIO = () => ioInstance;

export const emitToUser = (userId, eventName, payload) => {
  if (!ioInstance || !userId) return;
  ioInstance.to(`user_${String(userId)}`).emit(eventName, payload);
};

export const emitToUsers = (userIds, eventName, payload) => {
  if (!ioInstance || !Array.isArray(userIds)) return;
  userIds.forEach((userId) => emitToUser(userId, eventName, payload));
};

export const emitGlobal = (eventName, payload) => {
  if (!ioInstance) return;
  ioInstance.to('global').emit(eventName, payload);
};

export const emitToEventRoom = (eventId, eventName, payload) => {
  if (!ioInstance || !eventId) return;
  ioInstance.to(`event_${String(eventId)}`).emit(eventName, payload);
};
