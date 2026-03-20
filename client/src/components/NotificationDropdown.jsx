import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../mockClerk';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { getToken } = useAuth();
    const { socket } = useSocket();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch initial notifications
    const fetchNotifications = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/notification', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Listen for Real-Time notifications
    useEffect(() => {
        if (!socket) return;
        socket.on('getNotification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });
        return () => socket.off('getNotification');
    }, [socket]);

    // Handle Mark as Read
    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            try {
                const token = await getToken();
                await api.put('/api/notification/mark-read', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch (error) {
                console.error('Error marking read:', error);
            }
        }
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (n) => {
        setIsOpen(false);
        if (n.type === 'follow') navigate(`/profile/${n.sender._id}`);
        else navigate(`/profile/${n.user}`); // Or to the specific post if you have a single post view
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={handleOpen} 
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition relative cursor-pointer"
            >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                            <p className="p-6 text-center text-gray-500 text-sm">No new notifications</p>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n._id} 
                                    onClick={() => handleNotificationClick(n)}
                                    className={`flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <img 
                                        src={n.sender?.profile_picture || 'https://via.placeholder.com/150'} 
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt="" 
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-800 leading-tight">
                                            <span className="font-semibold">{n.sender?.username}</span>
                                            {n.type === 'like' && ' liked your post.'}
                                            {n.type === 'comment' && ' commented on your post.'}
                                            {n.type === 'follow' && ' started following you.'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{moment(n.createdAt).fromNow()}</p>
                                    </div>
                                    {!n.isRead && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
