import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth, useUser } from '../mockClerk';
import toast from 'react-hot-toast';
import { Users, FileText, LayoutDashboard, Trash2 } from 'lucide-react';
import Loading from '../components/modals/Loading';

const Admin = () => {
    const { getToken, user } = useAuth();
    const currentUser = useSelector((state) => state.user.value);
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        // Master Role-Based Security: Kick out non-admins instantly
        if (currentUser && currentUser.role !== 'admin') {
            toast.error("Security Override: You do not have Administrative Clearance!");
            navigate('/');
            return;
        }

        if (currentUser && currentUser.role === 'admin') {
            fetchStats();
            fetchAllUsers();
        }
    }, [currentUser, navigate]);

    const fetchStats = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Stats error", error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAllUsers(data.data);
            }
        } catch (error) {
            console.error("Users fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("CRITICAL WARNING: Are you sure you want to completely wipe this user and all their posts?")) return;

        try {
            const token = await getToken();
            const { data } = await api.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(data.message);
                fetchAllUsers(); // Refresh the GUI table
                fetchStats();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to scrub user");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Delete this specific post payload?")) return;
        try {
            const token = await getToken();
            const { data } = await api.delete(`/api/admin/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(data.message);
                fetchStats(); // Update Recent Posts Table
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to purge post");
        }
    };

    if (loading || !stats) return <Loading />;

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
            <div className="bg-slate-900 text-white p-6 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-indigo-400" />
                    <h1 className="text-3xl font-bold">Aura Master Control</h1>
                </div>
            </div>

            <div className="max-w-6xl w-full mx-auto p-6 flex flex-col md:flex-row gap-6">
                {/* Lateral Navigation Menu */}
                <div className="w-full md:w-64 bg-white rounded-xl shadow p-4 flex flex-col gap-2 h-max">
                    <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <LayoutDashboard className="w-5 h-5" /> Analytics
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Users className="w-5 h-5" /> Manage Users
                    </button>
                    <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${activeTab === 'content' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <FileText className="w-5 h-5" /> Moderate Content
                    </button>
                </div>

                {/* Intelligent Workspace Context */}
                <div className="flex-1 bg-white rounded-xl shadow p-6 min-h-[500px]">
                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Database Health Analytics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col items-center justify-center">
                                    <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Total Users</span>
                                    <span className="text-4xl font-extrabold text-indigo-900 mt-2">{stats.totalUsers}</span>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex flex-col items-center justify-center">
                                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Total Posts</span>
                                    <span className="text-4xl font-extrabold text-emerald-900 mt-2">{stats.totalPosts}</span>
                                </div>
                                <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl flex flex-col items-center justify-center">
                                    <span className="text-sm font-semibold text-purple-600 uppercase tracking-widest">Live Stories</span>
                                    <span className="text-4xl font-extrabold text-purple-900 mt-2">{stats.totalStories}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Database Access</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">User & Email</th>
                                            <th className="px-6 py-3">Clearance</th>
                                            <th className="px-6 py-3 text-right">Action Target</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map((u) => (
                                            <tr key={u._id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={u.profile_picture || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" alt="" />
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900">{u.username}</span>
                                                        <span className="text-gray-500">{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {u.role !== 'admin' && (
                                                        <button 
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition"
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Scrub
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Payload Submissions</h2>
                            <div className="flex flex-col gap-4">
                                {stats.recentPosts.map((post) => (
                                    <div key={post._id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center shadow-sm">
                                        <div className="flex flex-col max-w-[70%]">
                                            <span className="font-semibold text-indigo-600 mb-1">@{post.user?.username}</span>
                                            <p className="text-gray-700 truncate">{post.content || "(Media Only)"}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeletePost(post._id)}
                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                                        >
                                            <Trash2 className="w-4 h-4" /> Purge
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
