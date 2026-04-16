export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    socket.join('global');

    // Join a room for a specific event
    socket.on('joinEvent', (eventId) => {
      socket.join(`event_${eventId}`);
      console.log(`User ${socket.id} joined event room: event_${eventId}`);
    });

    // Leave event room
    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event_${eventId}`);
      console.log(`User ${socket.id} left event room: event_${eventId}`);
    });

    // Broadcast registration update
    socket.on('userRegistered', (data) => {
      const { eventId, registrationCount } = data;
      io.to(`event_${eventId}`).emit('registrationUpdate', {
        eventId,
        registrationCount,
        timestamp: new Date(),
      });
    });

    // Broadcast unregistration update
    socket.on('userUnregistered', (data) => {
      const { eventId, registrationCount } = data;
      io.to(`event_${eventId}`).emit('registrationUpdate', {
        eventId,
        registrationCount,
        timestamp: new Date(),
      });
    });

    // Broadcast new notification to specific user
    socket.on('sendNotification', (data) => {
      const { userId, notification } = data;
      io.to(`user_${userId}`).emit('notificationReceived', notification);
    });

    // User joins their notification room
    socket.on('joinUserRoom', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${socket.id} joined notification room: user_${userId}`);
    });

    socket.on('joinGlobal', () => {
      socket.join('global');
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};
