const app = require('./src/app');
const connectDB = require('./src/config/db');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

// Connect to database
connectDB();

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  // Handle new message
  socket.on('new_message', (data) => {
    io.to(data.receiverId).emit('message_received', data);
  });

  // Handle online status
  socket.on('user_online', (userId) => {
    socket.broadcast.emit('user_status', { userId, status: 'online' });
  });

  socket.on('user_offline', (userId) => {
    socket.broadcast.emit('user_status', { userId, status: 'offline' });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
