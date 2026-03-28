import User from '../models/User.js';
import Post from '../models/Post.js';
import Connection from '../models/Connection.js';

export const globalSearch = async (req, res) => {
    try {
        const { query } = req.query;

        const { userId } = await req.auth();

        if (!query || query.trim() === '') {
            return res.json({ success: true, users: [], posts: [] });
        }

        // Search Users by name or username (case-insensitive regex) while explicitly excluding the requesting User
        let users = await User.find({
            _id: { $ne: userId },
            $or: [
                { full_name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        // Defensive filtration layer to double-check exclusion
        users = users.filter(u => u._id.toString() !== userId.toString());

        // Fetch connections for current user to determine status
        const myConnections = await Connection.find({
            $or: [
                { from_user_id: userId },
                { to_user_id: userId }
            ]
        })

        const usersWithStatus = users.map(user => {
            const userObj = user.toObject();
            const connection = myConnections.find(conn =>
                conn.from_user_id === user._id.toString() || conn.to_user_id === user._id.toString()
            );

            if (connection) {
                userObj.connectionStatus = connection.status;
                userObj.connectionFrom = connection.from_user_id;
            } else {
                userObj.connectionStatus = null;
            }
            return userObj;
        });

        // Search Posts by content
        const posts = await Post.find({
            content: { $regex: query, $options: 'i' }
        })
        .populate('user', 'full_name username profile_picture')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({ success: true, users: usersWithStatus, posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
