import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/database.js';
import { setupSocketHandlers } from './socket/socketHandlers.js';
import { setRealtimeIO } from './socket/realtime.js';
import { corsOriginDelegate } from './config/cors.js';

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: corsOriginDelegate,
    credentials: true,
  },
});

setupSocketHandlers(io);
setRealtimeIO(io);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});

startServer();