import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { 
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`[SOCKET] User connected: ${userId} (Socket: ${socket.id})`);
    }

    // Broadcast online users status to everyone
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Typing Event Tracking
    socket.on('typing', ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing', { senderId: userId });
        }
    });

    socket.on('stopTyping', ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('stopTyping', { senderId: userId });
        }
    });

    socket.on('disconnect', () => {
        if (userId) {
            console.log(`[SOCKET] User disconnected: ${userId}`);
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, server, io };
