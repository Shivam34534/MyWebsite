import fs from 'fs';
import path from 'path'
import imagekit from "../configs/imageKit.js";
import Story from '../models/Story.js';
import User from '../models/User.js';
// import { inngest } from '../inngest/index.js';


// Add User Story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { content, caption, media_type, background_color } = req.body;
        const media = req.file;
        let media_url = '';

        const storyContent = content || caption;

        //upload media to imagekit or fallback to local uploads
        if (media_type === 'image' || media_type === 'video') {
            const fileBuffer = media.buffer || fs.readFileSync(media.path)

            if (process.env.IMAGEKIT_PRIVATE_KEY) {
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: media.originalname,
                })
                media_url = response.url;
            } else {
                // save to local uploads folder
                const uploadsDir = path.resolve(process.cwd(), 'uploads', 'stories')
                fs.mkdirSync(uploadsDir, { recursive: true })
                const filename = `${Date.now()}_${media.originalname.replace(/\s+/g, '_')}`
                const filepath = path.join(uploadsDir, filename)
                fs.writeFileSync(filepath, fileBuffer)

                const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`
                media_url = `${baseUrl}/uploads/stories/${filename}`
            }
        }

        //create story
        const story = await Story.create({
            user: userId,
            content: storyContent,
            media_url,
            media_type,
            background_color

        })

        res.json({ success: true, message: "Story added successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get User Stories
export const getStories = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const user = await User.findById(userId)

        //User connections and followings
        const userIds = [userId, ...user.connections, ...user.following]

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const stories = await Story.find({
            user: { $in: userIds },
            createdAt: { $gte: twentyFourHoursAgo }
        }).populate('user').sort({ createdAt: -1 })

        res.json({ success: true, data: stories, stories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}