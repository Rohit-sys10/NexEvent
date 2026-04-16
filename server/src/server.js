import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/database.js';
import { setupSocketHandlers } from './socket/socketHandlers.js';
import { setRealtimeIO } from './socket/realtime.js';

const PORT = process.env.BACKEND_PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Setup Socket.io handlers
setupSocketHandlers(io);
setRealtimeIO(io);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    server.once('error', (error) => {
      if (error?.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or use a different PORT.`);
      } else {
        console.error('Server startup error:', error);
      }
      process.exit(1);
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server ready at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();
