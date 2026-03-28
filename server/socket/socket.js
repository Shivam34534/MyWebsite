import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import Message from '../models/Message.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;

        try {
            // Track when message reaches receiver -> delivered
            const updated = await Message.updateMany(
                { to_user_id: userId, status: 'sent' },
                { $set: { status: 'delivered' } }
            );
            
            // If we wanted to alert every sender of delivery immediately, we could aggregate distinct senders and emit, 
            // but tracking it correctly locally is the primary requirement.
            if(updated.modifiedCount > 0){
                // Could emit global or targeted update if required
            }
        } catch (err) {
            console.error("Error updating delivered status:", err);
        }
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
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, server, io };
