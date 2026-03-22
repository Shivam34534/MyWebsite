import User from '../models/User.js';
import Post from '../models/Post.js';
import Story from '../models/Story.js';

// Get comprehensive analytical statistics for the Dashboard Top-Level View
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalStories = await Story.countDocuments();

        // Calculate a fake active metric or pull from today's logins if tracked
        const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).populate('user', 'username profile_picture');

        res.json({
            success: true,
            data: {
                totalUsers,
                totalPosts,
                totalStories,
                recentPosts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch every single user dynamically with pagination if necessary
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Force delete a user account securely
export const deleteUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;

        // Prevent admin suicide
        if (userId === (await req.auth()).userId) {
            return res.status(400).json({ success: false, message: "Cannot brutally delete your own Master Admin account from the UI!" });
        }

        await User.findByIdAndDelete(userId);
        
        // Cascading deletes (wipe their posts to keep the platform clean)
        await Post.deleteMany({ user: userId });
        await Story.deleteMany({ user: userId });

        res.json({ success: true, message: 'User account and all associated collateral permanently scrubbed!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Force delete a post physically from the database
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        await Post.findByIdAndDelete(postId);
        res.json({ success: true, message: 'Post permanently deleted from database.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
