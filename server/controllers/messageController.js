import fs from "fs"
import path from "path"
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

//Send Message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { to_user_id, receiverId, text } = req.body;

        const targetUserId = to_user_id || receiverId;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if (message_type === 'image') {
            try {
                const fileBuffer = image.buffer || fs.readFileSync(image.path);
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalname,
                });
                media_url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '1280' }
                    ]
                })
            } catch (error) {
                if (error.message === "ImageKit not configured") {
                    const buffer = image.buffer;
                    const uploadsDir = path.resolve(process.cwd(), 'uploads', 'messages');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    const filename = `${Date.now()}_${image.originalname.replace(/\s+/g, '_')}`;
                    const filepath = path.join(uploadsDir, filename);
                    fs.writeFileSync(filepath, buffer);

                    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
                    media_url = `${baseUrl}/uploads/messages/${filename}`;
                } else {
                    throw error;
                }
            }
        }

        const receiverSocketId = getReceiverSocketId(targetUserId);
        const status = receiverSocketId ? 'delivered' : 'sent';

        const message = await Message.create({
            from_user_id: userId,
            to_user_id: targetUserId,
            text,
            message_type,
            media_url,
            status
        })

        res.json({ success: true, message });

        //Send message to target user via Socket.io in real-time
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

    } catch (error) {
        console.log("Socket/Message Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Get Chat Messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: -1 })
        // mark messages as seen
        const updated = await Message.updateMany({
            from_user_id: to_user_id, to_user_id: userId, status: { $ne: 'seen' }
        }, { status: 'seen' });

        // Notify sender via socket if messages were just marked as seen
        if (updated.modifiedCount > 0) {
            const senderSocketId = getReceiverSocketId(to_user_id);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesSeen", { receiverId: userId });
            }
        }

        res.json({ success: true, messages });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const messages = await Message.find({ to_user_id: userId })
            .populate('from_user_id to_user_id')
            .sort({ createdAt: -1 })

        res.json({ success: true, data: messages, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}