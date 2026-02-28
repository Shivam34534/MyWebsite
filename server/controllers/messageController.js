import fs from "fs"
import path from "path"
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";


// Create an empty object to store SS Event connections
const connections = {};

// Controller function for the SSE endpoint
export const sseController = (req, res) => {
    const { userId } = req.params
    console.log('New client  connected : ', userId)

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    //Add the client's response object to the connections object
    connections[userId] = res

    //Send an initial event to the client
    res.write('log: Connected to SSE stream\n\n');

    //Handle client disconnection
    req.on('close', () => {
        //Remove the client's response object from the connections array
        delete connections[userId];
        console.log('Client disconnected')
    })
}

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

        const message = await Message.create({
            from_user_id: userId,
            to_user_id: targetUserId,
            text,
            message_type,
            media_url
        })

        res.json({ success: true, message });

        //Send message to to_user_id using SSE

        const messageWithUserData = await Message.findById(message._id).populate
            ('from_user_id ');

        if (connections[targetUserId]) {
            connections[targetUserId].write(`data: ${JSON.stringify
                (messageWithUserData)}]\n\n`)

        }

    } catch (error) {
        console.log(error);
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
        await Message.updateMany({
            from_user_id: to_user_id, to_user_id: userId
        }, { seen: true })

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