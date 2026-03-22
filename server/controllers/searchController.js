import User from '../models/User.js';
import Post from '../models/Post.js';

export const globalSearch = async (req, res) => {
    try {
        const { query } = req.query;

        const { userId } = await req.auth();

        if (!query || query.trim() === '') {
            return res.json({ success: true, users: [], posts: [] });
        }

        // Search Users by name or username (case-insensitive regex) while explicitly excluding the requesting User
        const users = await User.find({
            _id: { $ne: userId },
            $or: [
                { full_name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        // Search Posts by content
        const posts = await Post.find({
            content: { $regex: query, $options: 'i' }
        })
        .populate('user', 'full_name username profile_picture')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({ success: true, users, posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
