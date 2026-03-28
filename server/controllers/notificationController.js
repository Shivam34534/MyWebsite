import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const { userId } = await req.auth();
        let notifications = await Notification.find({ user: userId })
            .populate('sender', 'username profile_picture full_name')
            .populate('post', 'content')
            .sort({ createdAt: -1 })
            .limit(50);
            
        // Sorting priority
        const priorityScore = { follow: 3, comment: 2, like: 1 };
        
        notifications.sort((a, b) => {
            if (a.isRead !== b.isRead) return a.isRead ? 1 : -1; // Unread first
            if (priorityScore[a.type] !== priorityScore[b.type]) {
                return priorityScore[b.type] - priorityScore[a.type];
            }
            return b.createdAt - a.createdAt;
        });

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
