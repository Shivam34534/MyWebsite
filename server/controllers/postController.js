import fs from 'fs'
import path from 'path'
import imagekit from '../configs/imageKit.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { content, post_type } = req.body;
        const images = req.files

        let image_urls = []

        // Check if files exist and is an array (multiple files) or object (single file)
        if (images) {
            // Convert to array if single file
            const filesArray = Array.isArray(images) ? images : [images];

            image_urls = await Promise.all(
                filesArray.map(async (image) => {
                    // Use buffer directly from multer's memory storage
                    if (process.env.IMAGEKIT_PRIVATE_KEY) {
                        const response = await imagekit.upload({
                            file: image.buffer,
                            fileName: image.originalname,
                            folder: "posts"
                        })

                        const isVideo = image.mimetype.startsWith('video/')

                        const url = imagekit.url({
                            path: response.filePath,
                            transformation: isVideo ? [] : [
                                { quality: 'auto' },
                                { format: 'webp' },
                                { width: '1280' },
                            ]
                        })
                        return url;
                    } else {
                        const uploadsDir = path.resolve(process.cwd(), 'uploads', 'posts')
                        fs.mkdirSync(uploadsDir, { recursive: true })
                        const filename = `${Date.now()}_${image.originalname.replace(/\s+/g, '_')}`
                        const filepath = path.join(uploadsDir, filename)
                        fs.writeFileSync(filepath, image.buffer)
                        const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`
                        return `${baseUrl}/uploads/posts/${filename}`
                    }
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })

        res.json({ success: true, message: "Post created successfully" })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Posts with Pagination
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const user = await User.findById(userId)

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //User's connections and followings
        const userIds = [userId, ...user.connections, ...user.following]
        
        const posts = await Post.find({ user: { $in: userIds } })
            .populate('user')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ 
            success: true, 
            data: posts,
            hasMore: posts.length === limit
        })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePost = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()

            res.json({ success: true, message: "Post unliked" })
        } else {
            post.likes_count.push(userId)
            await post.save()

            res.json({ success: true, message: "Post liked" })
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Share Post
export const sharePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const post = await Post.findByIdAndUpdate(postId, { $inc: { shares_count: 1 } }, { new: true })

        res.json({ success: true, message: "Post shared", data: post })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}