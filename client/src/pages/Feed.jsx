import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import StoriesBar from '../components/modals/StoriesBar'
import PostCard from '../components/modals/PostCard'
import PostSkeleton from '../components/modals/PostSkeleton'
import RecentMessages from '../components/modals/RecentMessages'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user.value)
    const { getToken } = useAuth()

    // Feed State
    const [feeds, setfeeds] = useState([])
    const [loading, setLoading] = useState(true)
    
    // Pagination State
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
                toast.error(data.message || 'Failed to fetch posts')
            }
        } catch (error) {
            console.error('Error fetching feeds:', error)
            toast.error(error.response?.data?.message || 'Failed to fetch posts')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchFeeds(1)
    }, [])

    return (
        <div className='flex justify-center max-w-[1400px] mx-auto min-h-screen'>
            {/* 📸 Main Feed Stage */}
            <div className="w-full max-w-[640px] px-4 md:px-8 py-8 lg:py-12 flex flex-col gap-8">
                {/* Stories Section with Neo Border */}
                <div className='bg-white neo-border neo-shadow p-4 lg:p-6'>
                    <StoriesBar />
                </div>

                {/* Post Stream */}
                <section className="flex flex-col gap-8 md:gap-12 pb-12">
                    {loading ? (
                        [1, 2, 3].map((i) => <PostSkeleton key={i} />)
                    ) : feeds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-white neo-border neo-shadow-lg">
                            <div className='w-20 h-20 neo-border bg-accent flex items-center justify-center -rotate-3'>
                                <span className="material-symbols-outlined text-5xl text-black">image_search</span>
                            </div>
                            <div className='space-y-2'>
                                <h3 className="text-3xl font-black">FEED IS EMPTY!</h3>
                                <p className='text-sm font-bold uppercase tracking-tight max-w-[280px]'>Join the community and start following the vibes.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/discover')}
                                className="neo-button bg-primary"
                            >
                                EXPLORE NOW
                            </button>
                        </div>
                    ) : (
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}

                    {/* Infinite Exploration Handler */}
                    {hasMore && feeds.length > 0 && !loading && (
                        <div className='flex justify-center pt-4 pb-12'>
                            <button 
                                onClick={() => {
                                    const next = page + 1;
                                    setPage(next);
                                    fetchFeeds(next);
                                }} 
                                disabled={loadingMore}
                                className='neo-button bg-black text-white hover:bg-stone-800'
                            >
                                {loadingMore ? "LOADING..." : "LOAD MORE"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* ⚡ Neo Sidebar (Desktop Only) */}
            <aside className="hidden xl:flex w-[400px] flex-col gap-8 p-10 h-screen sticky top-0 overflow-y-auto no-scrollbar">
                {/* User Identity Card */}
                <div className="neo-card bg-secondary rotate-1 flex items-center justify-between gap-4 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div 
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="neo-border bg-white p-0.5">
                            <img 
                                className="w-12 h-12 object-cover" 
                                src={user?.profile_picture || assets.sample_profile} 
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt={user?.full_name} 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-sm uppercase tracking-tighter leading-none">@{user?.username}</span>
                            <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">{user?.full_name}</span>
                        </div>
                    </div>
                    <div className="bg-black text-white text-[10px] font-black px-2 py-1 neo-border">VIP</div>
                </div>

                {/* Suggestions Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="text-xl font-black uppercase tracking-tighter italic">HOT MESSAGES</h4>
                        <button onClick={() => navigate('/messages')} className="text-xs font-black underline hover:text-primary transition-colors">GO TO INBOX</button>
                    </div>
                    <div className='bg-white neo-border p-4 shadow-[4px_4px_0px_0px_#000]'>
                        <RecentMessages />
                    </div>
                </div>

                {/* Trending (Neo-Brutalism Style) */}
                <div className="space-y-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter italic">TOP TRENDS</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="neo-border bg-accent p-5 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                            <h5 className="text-2xl font-black italic">#NEO_REVOLUTION</h5>
                            <p className="text-xs font-bold mt-2 uppercase">12.4K BRUTALISTS ACTIVE</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="neo-border bg-tertiary p-4 cursor-pointer hover:bg-yellow-400 transition-colors">
                                <h5 className="text-sm font-black">#RAW_ART</h5>
                                <p className="text-[10px] font-bold opacity-60">5.2K POSTS</p>
                            </div>
                            <div className="neo-border bg-lime-400 p-4 cursor-pointer hover:bg-lime-500 transition-colors">
                                <h5 className="text-sm font-black">#AURA_VIBE</h5>
                                <p className="text-[10px] font-bold opacity-60">8.9K POSTS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Minimal Footer */}
                <footer className="mt-auto py-8">
                    <nav className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                        {['PRIVACY', 'TERMS', 'ARCHIVE', 'ABOUT'].map(link => (
                            <a key={link} className="text-[10px] font-black tracking-widest hover:text-primary transition-colors hover:underline" href="#">{link}</a>
                        ))}
                    </nav>
                    <div className='space-y-1 p-2 bg-black text-white neo-border shadow-[4px_4px_0px_0px_#A3E635]'>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">AURA PROTOCOL V3.0</p>
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">© 2026 UNTAMED DIGITAL LABS</p>
                    </div>
                </footer>
            </aside>
        </div>

    )
}

export default Feed

