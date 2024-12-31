import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

const SOCKET_PORT = 4100; 

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Allow all origins or specify frontend URL
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the Socket.IO server
httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server is running on port ${SOCKET_PORT}`);
});

// Export `io` for emitting events from other modules
export { io };
