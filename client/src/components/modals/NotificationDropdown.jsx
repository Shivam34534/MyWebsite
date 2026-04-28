import React, { useEffect, useState, useRef } from 'react';
import { Bell, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../mockClerk';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { getToken } = useAuth();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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
        else navigate(`/profile/${n.user}`);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all relative"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-[2rem] border border-gray-100 z-[100] overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
                        <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">Notifications</h3>
                        {unreadCount > 0 && <span className="text-[10px] font-black text-primary uppercase">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center gap-3">
                                <Sparkles className="text-gray-100 w-10 h-10" />
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Quiet for now</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n._id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`flex items-start gap-4 p-5 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-all ${!n.isRead ? 'bg-primary/5' : ''}`}
                                >
                                    <img
                                        src={n.sender?.profile_picture || '/default-avatar.png'}
                                        className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm"
                                        alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 font-medium leading-tight mb-1">
                                            <span className="font-bold text-gray-900">{n.sender?.username}</span>
                                            {n.type === 'like' && ' liked your post.'}
                                            {n.type === 'comment' && ' commented on your post.'}
                                            {n.type === 'follow' && ' started following you.'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{moment(n.createdAt).fromNow()}</p>
                                    </div>
                                    {!n.isRead && <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 bg-gray-50/50 text-center">
                        <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">Clear All</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
