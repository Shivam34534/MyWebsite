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
        <div className="flex flex-col h-full bg-[#F2F2F2] overflow-y-auto">
            <div className="bg-black text-white p-8 border-b-[6px] border-black shadow-[0_10px_0_0_#A3E635]">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 -rotate-1">
                        <div className="bg-white p-2 neo-border">
                             <LayoutDashboard className="w-10 h-10 text-black stroke-[3px]" />
                        </div>
                        <div>
                             <h1 className="text-5xl font-black italic tracking-tighter leading-none">SYSTEM_OVERRIDE</h1>
                             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A3E635]">ADMINISTRATIVE_ACCESS_GRANTED</span>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end opacity-40">
                         <span className="text-[8px] font-black uppercase tracking-widest">ENCRYPTION: 256-BIT_RAW</span>
                         <span className="text-[8px] font-black uppercase tracking-widest">UID: {currentUser?._id}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto p-10 flex flex-col lg:flex-row gap-10">
                {/* Lateral Navigation Menu */}
                <div className="w-full lg:w-72 flex flex-col gap-4">
                    <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-4 p-5 neo-border font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-[#A3E635] text-black shadow-[6px_6px_0_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-white text-black hover:bg-stone-50'}`}>
                        <LayoutDashboard className="w-5 h-5 stroke-[2.5px]" /> ANALYTICS_CORE
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex items-center gap-4 p-5 neo-border font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-[#A3E635] text-black shadow-[6px_6px_0_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-white text-black hover:bg-stone-50'}`}>
                        <Users className="w-5 h-5 stroke-[2.5px]" /> USER_DATABASE
                    </button>
                    <button onClick={() => setActiveTab('content')} className={`flex items-center gap-4 p-5 neo-border font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-[#A3E635] text-black shadow-[6px_6px_0_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-white text-black hover:bg-stone-50'}`}>
                        <FileText className="w-5 h-5 stroke-[2.5px]" /> CONTENT_MODERATION
                    </button>

                    <div className="mt-6 p-6 bg-black text-white neo-border shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                         <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 text-primary">SERVER_STATUS</h4>
                         <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                                   <span>LATENCY</span>
                                   <span className="text-lime-400">0.12ms</span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                                   <span>UPTIME</span>
                                   <span className="text-lime-400">99.9%</span>
                              </div>
                              <div className="w-full h-1 bg-stone-800 mt-2">
                                   <div className="w-3/4 h-full bg-primary"></div>
                              </div>
                         </div>
                    </div>
                </div>

                {/* Intelligent Workspace Context */}
                <div className="flex-1 bg-white neo-border neo-shadow-lg p-10 min-h-[600px]">
                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <h2 className="text-3xl font-black text-black mb-10 uppercase tracking-tight italic border-b-[4px] border-black pb-4">HEALTH_METRICS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="bg-white neo-border p-8 flex flex-col items-center justify-center shadow-[6px_6px_0_0_#000] hover:translate-y-[-2px] transition-all">
                                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">TOTAL_IDENTITIES</span>
                                    <span className="text-6xl font-black text-black mt-3 italic leading-none">{stats.totalUsers}</span>
                                </div>
                                <div className="bg-white neo-border p-8 flex flex-col items-center justify-center shadow-[6px_6px_0_0_#000] hover:translate-y-[-2px] transition-all">
                                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">TOTAL_PAYLOADS</span>
                                    <span className="text-6xl font-black text-black mt-3 italic leading-none">{stats.totalPosts}</span>
                                </div>
                                <div className="bg-white neo-border p-8 flex flex-col items-center justify-center shadow-[6px_6px_0_0_#000] hover:translate-y-[-2px] transition-all">
                                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">ACTIVE_THREADS</span>
                                    <span className="text-6xl font-black text-black mt-3 italic leading-none">{stats.totalStories}</span>
                                </div>
                            </div>

                            <div className="p-6 bg-stone-100 neo-border italic">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-black/40">SYSTEM_NOTE: AUTOMATIC_BACKUPS_SCHEDULED_EVERY_24H. CURRENT_DATA_INTEGRITY: NORMAL.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <h2 className="text-3xl font-black text-black mb-10 uppercase tracking-tight italic border-b-[4px] border-black pb-4">IDENTITY_LOOKUP</h2>
                            <div className="overflow-x-auto neo-border">
                                <table className="w-full text-left bg-white">
                                    <thead className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="px-6 py-4">CREATOR_ID</th>
                                            <th className="px-6 py-4">CLEARANCE</th>
                                            <th className="px-6 py-4 text-right">OPERATIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-[2px] divide-black">
                                        {allUsers.map((u) => (
                                            <tr key={u._id} className="bg-white hover:bg-stone-50 transition-colors">
                                                <td className="px-6 py-5 flex items-center gap-4">
                                                    <div className="w-12 h-12 neo-border bg-black p-0.5">
                                                         <img src={u.profile_picture || 'https://via.placeholder.com/40'} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-black uppercase text-sm tracking-tight">{u.username}</span>
                                                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 neo-border text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-400 text-black' : 'bg-lime-400 text-black shadow-[2px_2px_0_0_#000]'}`}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    {u.role !== 'admin' && (
                                                        <button 
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="neo-button bg-red-600 text-white text-[10px] px-5 py-2 hover:bg-red-700 transition"
                                                        >
                                                            PURGE_DATA
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
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <h2 className="text-3xl font-black text-black mb-10 uppercase tracking-tight italic border-b-[4px] border-black pb-4">PAYLOAD_AUDIT</h2>
                            <div className="flex flex-col gap-6">
                                {stats.recentPosts.map((post) => (
                                    <div key={post._id} className="p-6 bg-white neo-border flex justify-between items-center shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#000] transition-all">
                                        <div className="flex flex-col max-w-[70%]">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">SOURCE: @{post.user?.username}</span>
                                            <p className="text-sm font-black text-black uppercase tracking-tight truncate leading-none">{post.content || "BINARY_MEDIA_ONLY"}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeletePost(post._id)}
                                            className="neo-button bg-black text-white text-[10px] py-3 px-6 hover:bg-stone-800"
                                        >
                                            MODERATION: DELETE
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
