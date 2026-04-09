import React, { useEffect, useState } from 'react'
import StoriesBar from '../components/modals/StoriesBar'
import PostCard from '../components/modals/PostCard'
import PostSkeleton from '../components/modals/PostSkeleton'
import RecentMessages from '../components/modals/RecentMessages'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Users, Archive, Compass, Search } from 'lucide-react'

const Feed = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user.value)
    const { getToken } = useAuth()

    const [feeds, setfeeds] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchFeeds = async (pageNum = 1) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const token = await getToken()
            const { data } = await api.get(`/api/post/feed?page=${pageNum}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                if (pageNum === 1) {
                    setfeeds(data.data);
                } else {
                    setfeeds(prev => [...prev, ...data.data]);
                }
                setHasMore(data.hasMore);
            } else {
                toast.error('FEED_FETCH_ERROR')
            }
        } catch (error) {
            toast.error('NETWORK_PROTOCOL_ERROR')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchFeeds(1)
    }, [])

    return (
        <div className='flex flex-col xl:flex-row gap-8 min-h-screen'>
            {/* 📸 MAIN VIEWPORT */}
            <div className="flex-1 flex flex-col gap-8 max-w-4xl">
                
                {/* ⚡ Stories Sector */}
                <div className='neo-box bg-white p-6 rotate-1'>
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active_Identities</span>
                    </div>
                    <StoriesBar />
                </div>

                {/* ⚡ Content Stream */}
                <div className="flex flex-col gap-12">
                    {loading ? (
                        [1, 2, 3].map((i) => <PostSkeleton key={i} />)
                    ) : feeds.length === 0 ? (
                        <div className="neo-box bg-white p-12 text-center flex flex-col items-center gap-6 border-dashed">
                            <div className='neo-box bg-accent p-6 -rotate-6'>
                                <Archive className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic">EMPTY_ARCHIVE</h3>
                                <p className='font-bold text-black/60 uppercase text-xs mt-2'>Your gallery hasn't been populated with any data yet.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/discover')}
                                className="neo-button bg-main px-8 py-3"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                SCAN_DISCOVER
                            </button>
                        </div>
                    ) : (
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}

                    {/* Infinite Exploration */}
                    {hasMore && feeds.length > 0 && !loading && (
                        <div className='flex justify-center pb-12'>
                            <button 
                                onClick={() => {
                                    const next = page + 1;
                                    setPage(next);
                                    fetchFeeds(next);
                                }} 
                                disabled={loadingMore}
                                className='neo-button-secondary py-4 px-12 text-lg'
                            >
                                {loadingMore ? "RETRIEVING_DATA..." : "ACCESS_ARCHIVE_LEVEL_0" + (page + 1)}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 💎 DATA SIDEBAR */}
            <aside className="w-full xl:w-[380px] flex flex-col gap-8 sticky top-8 h-fit">
                
                {/* ⚡ Personal Node */}
                <div className="neo-box bg-white p-6 flex items-center justify-between group cursor-pointer hover:-translate-y-1 neo-transition" onClick={() => navigate('/profile')}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 neo-box bg-main overflow-hidden -rotate-3 group-hover:rotate-0 neo-transition">
                            <img 
                                className="w-full h-full object-cover" 
                                src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                                alt={user?.full_name} 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black uppercase text-base italic tracking-tighter">@{user?.username}</span>
                            <span className="text-[10px] font-bold text-black/50 uppercase">{user?.full_name}</span>
                        </div>
                    </div>
                    <div className="neo-box bg-black px-2 py-1 rotate-6">
                        <span className="text-white text-[10px] font-black uppercase">CURATOR</span>
                    </div>
                </div>

                {/* ⚡ Recent Transmissions */}
                <div className="neo-box bg-white p-6">
                    <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
                        <h4 className="font-black text-xs uppercase tracking-widest">RECENT_MESSAGES</h4>
                        <Compass className="w-4 h-4" />
                    </div>
                    <div className="p-2 border-2 border-black bg-[#f0f0f0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <RecentMessages />
                    </div>
                </div>

                {/* ⚡ Trending Protocols */}
                <div className="neo-box bg-white p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5" />
                        <h4 className="font-black text-xs uppercase tracking-widest">TRENDING_PROTOCOLS</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="neo-box bg-secondary p-4 hover:rotate-1 neo-transition cursor-pointer group">
                            <span className="text-[10px] uppercase font-black text-white/60 mb-1 block">RANK_01</span>
                            <h5 className="font-black text-xl text-white italic tracking-tighter">#NEO_BRUTALISM</h5>
                            <p className="text-[10px] text-white/80 font-bold mt-2 uppercase">12.4K ACTIVE_NODES</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="neo-box bg-accent p-4 cursor-pointer hover:scale-105 neo-transition">
                                <h5 className="font-black text-sm uppercase">#MINIMAL</h5>
                                <p className="text-[9px] font-bold text-black/50">8.2K ENTRIES</p>
                            </div>
                            <div className="neo-box bg-white p-4 cursor-pointer hover:scale-105 neo-transition">
                                <h5 className="font-black text-sm uppercase">#RAW_DATA</h5>
                                <p className="text-[9px] font-bold text-black/50">3.1K ENTRIES</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ⚡ Legal Protocols */}
                <footer className="opacity-40 hover:opacity-100 transition-opacity p-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                        {['PRIVACY', 'TERMS', 'API', 'ARCHIVE'].map(link => (
                            <a key={link} className="text-[10px] font-black underline hover:text-secondary" href="#">{link}</a>
                        ))}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">VERSION_2.0.4_ULTRA</p>
                </footer>
            </aside>
        </div>
    )
}

export default Feed
