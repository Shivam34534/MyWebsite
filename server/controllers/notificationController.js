import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const notifications = await Notification.find({ user: userId })
            .populate('sender', 'username profile_picture full_name')
            .populate('post', 'content')
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { userId } = await req.auth();
        await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
