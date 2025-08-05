const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`[CONNECTED] User with socket ID: ${socket.id}`);

  const leaveRoom = () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      const user = rooms[roomId].users.find(u => u.id === socket.id);
      rooms[roomId].users = rooms[roomId].users.filter(u => u.id !== socket.id);
      
      console.log(`[LEFT ROOM] User ${user ? user.username : socket.id} left room ${roomId}`);
      
      socket.to(roomId).emit('peerLeft');
      
      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
        console.log(`[DELETED ROOM] Room ${roomId} was empty and has been deleted.`);
      }
    }
    socket.roomId = null;
  };

  socket.on('createRoom', ({ code, password }) => {
    if (rooms[code]) {
      return socket.emit('roomError', 'This room code is already taken.');
    }
    rooms[code] = { 
        password: password, 
        users: [], 
        messages: [] 
    };
    socket.emit('roomActionSuccess');
    console.log(`[CREATED ROOM] Room: ${code}`);
  });

  socket.on('joinRoom', ({ code, password }) => {
    const room = rooms[code];
    if (!room) {
      return socket.emit('roomError', 'No room found with that code.');
    }
    if (room.password !== password) {
      return socket.emit('roomError', 'Incorrect password.');
    }
    if (room.users.length >= 2) {
      return socket.emit('roomError', 'This room is full.');
    }
    socket.emit('roomActionSuccess');
  });

  socket.on('enterRoom', ({ code, user }) => {
    leaveRoom(); // Leave any previous room
    
    const room = rooms[code];
    if (!room) return; // Room might have been deleted

    socket.join(code);
    socket.roomId = code;
    
    const newUser = { id: socket.id, username: user.username };
    const peer = room.users.length > 0 ? room.users[0] : null;
    
    room.users.push(newUser);
    
    socket.emit('initialRoomData', { 
      messages: room.messages, 
      peer: peer 
    });

    if (peer) {
      socket.to(peer.id).emit('peerJoined', newUser);
    }
    console.log(`[ENTERED ROOM] User ${user.username} entered room ${code}`);
  });

  socket.on('sendMessage', ({ roomCode, message }) => {
    const room = rooms[roomCode];
    if (room) {
      room.messages.push(message);
      socket.to(roomCode).emit('receiveMessage', message);
    }
  });

  socket.on('typing', ({ roomCode }) => {
    socket.to(roomCode).emit('peerTyping');
  });

  socket.on('stopTyping', ({ roomCode }) => {
    socket.to(roomCode).emit('peerStoppedTyping');
  });

  socket.on('disconnect', () => {
    leaveRoom();
    console.log(`[DISCONNECTED] User with socket ID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});