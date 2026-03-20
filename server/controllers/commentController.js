import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { io, getReceiverSocketId } from '../socket/socket.js';

// Add Comment
// Add Comment
export const addComment = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { postId, text, content } = req.body;

        const commentText = text || content;

        if (!commentText) {
             return res.json({ success: false, message: "Comment text is required" });
        }

        const comment = await Comment.create({
            user: userId,
            post: postId,
            text: commentText
        });

        // Increment comment count on Post
        const postDoc = await Post.findByIdAndUpdate(postId, { $inc: { comments_count: 1 } });

        // Populate user details immediately for the response
        await comment.populate('user', 'full_name username profile_picture');

        // NOTIFICATION LOGIC
        if (postDoc.user.toString() !== userId.toString()) {
            const newNotification = await Notification.create({
                user: postDoc.user,
                sender: userId,
                post: postId,
                type: 'comment'
            });
            await newNotification.populate('sender', 'username profile_picture full_name');
            await newNotification.populate('post', 'content');

            const receiverSocketId = getReceiverSocketId(postDoc.user.toString());
            if(receiverSocketId){
                io.to(receiverSocketId).emit('getNotification', newNotification);
            }
        }

        res.json({ success: true, message: "Comment added", comment });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Post Comments (Route Param)
export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate('user', 'full_name username profile_picture')
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Post Comments List (Query Param)
export const getPostCommentsList = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.json({ success: false, message: "Post ID is required" });
        }

        const comments = await Comment.find({ post: postId })
            .populate('user', 'full_name username profile_picture')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: comments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
