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
            <div className="w-full max-w-[640px] px-4 md:px-8 py-8 lg:py-12 flex flex-col gap-10">
                {/* Stories Section with Glass Border */}
                <div className='bg-surface-container-lowest/40 backdrop-blur-sm rounded-[2rem] p-4 lg:p-6 border border-stone-200/40'>
                    <StoriesBar />
                </div>

                {/* Post Stream */}
                <section className="flex flex-col gap-10 md:gap-14 pb-12">
                    {loading ? (
                        [1, 2, 3].map((i) => <PostSkeleton key={i} />)
                    ) : feeds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-surface-container-low/50 rounded-[2.5rem] border border-dashed border-stone-300/50">
                            <div className='w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center'>
                                <span className="material-symbols-outlined text-4xl text-stone-400">filter_none</span>
                            </div>
                            <div className='space-y-1'>
                                <h3 className="font-headline font-black text-xl text-on-surface">Your gallery is waiting</h3>
                                <p className='text-sm text-on-surface-variant max-w-[240px]'>Start following creators to populate your personalized editorial feed.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/discover')}
                                className="px-6 py-2.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Find Connections
                            </button>
                        </div>
                    ) : (
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}

                    {/* Infinite Exploration Handler */}
                    {hasMore && feeds.length > 0 && !loading && (
                        <div className='flex justify-center pt-8 pb-12'>
                            <button 
                                onClick={() => {
                                    const next = page + 1;
                                    setPage(next);
                                    fetchFeeds(next);
                                }} 
                                disabled={loadingMore}
                                className='group px-10 py-3.5 bg-stone-900 text-white rounded-2xl font-bold shadow-xl shadow-stone-200/50 hover:bg-black transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest'
                            >
                                {loadingMore ? "Optimizing Stream..." : "View Archive"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* 💎 Editorial Sidebar (Desktop Only) */}
            <aside className="hidden xl:flex w-[380px] flex-col gap-10 p-8 h-screen sticky top-0 overflow-y-auto no-scrollbar">
                {/* Curator Briefing */}
                <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-stone-100 shadow-sm">
                    <div 
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="relative p-0.5 rounded-full border border-stone-200 shadow-sm transition-transform group-hover:scale-105">
                            <img 
                                className="w-12 h-12 rounded-full object-cover" 
                                src={user?.profile_picture || assets.sample_profile} 
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt={user?.full_name} 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-headline font-black text-sm text-on-surface leading-tight transition-colors">{user?.username}</span>
                            <span className="text-[11px] font-medium text-stone-400">{user?.full_name}</span>
                        </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary-dim transition-colors">Curator</button>
                </div>

                {/* Suggestions Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="font-headline font-black text-[12px] uppercase tracking-widest text-on-surface-variant/40">Suggested for you</h4>
                        <button className="text-[10px] font-bold text-on-surface hover:text-primary transition-colors">See All</button>
                    </div>
                    <div className='bg-surface-container-lowest/50 rounded-[2rem] p-2 border border-stone-100'>
                        <RecentMessages />
                    </div>
                </div>

                {/* Weekly Trends (Bento Styling) */}
                <div className="space-y-6">
                    <h4 className="font-headline font-black text-[12px] uppercase tracking-widest text-on-surface-variant/40 px-2">Trending curation</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 bg-gradient-to-br from-primary to-primary-dim p-5 rounded-3xl hover:translate-y-[-2px] transition-all cursor-pointer group relative overflow-hidden">
                            <div className='absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
                            <p className="text-[10px] uppercase font-bold text-white/50 mb-1 tracking-[0.2em]">Featured</p>
                            <h5 className="font-headline font-black text-lg text-white mb-4">#MetropolisDesign</h5>
                            <div className='flex items-center gap-2'>
                                <div className='flex -space-x-2'>
                                    {[1,2,3].map(i => <div key={i} className='w-5 h-5 rounded-full border border-white/20 bg-white/30' />)}
                                </div>
                                <p className="text-[10px] text-white/70 font-bold uppercase tracking-tighter">8.4k Curators</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl hover:border-primary/20 transition-all cursor-pointer border border-stone-100 group">
                            <h5 className="font-bold text-[13px] text-on-surface group-hover:text-primary transition-colors">#ArtWeek</h5>
                            <p className="text-[10px] text-stone-400 mt-0.5">14.2k Posts</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl hover:border-primary/20 transition-all cursor-pointer border border-stone-100 group">
                            <h5 className="font-bold text-[13px] text-on-surface group-hover:text-primary transition-colors">#Minimalism</h5>
                            <p className="text-[10px] text-stone-400 mt-0.5">5.1k Posts</p>
                        </div>
                    </div>
                </div>

                {/* Minimal Footer */}
                <footer className="mt-auto pt-16 pb-12 opacity-40 hover:opacity-100 transition-opacity">
                    <nav className="flex flex-wrap gap-x-3 gap-y-1 mb-6">
                        {['About', 'Privacy', 'Terms', 'Archive', 'Creator Studio'].map(link => (
                            <a key={link} className="text-[10px] font-bold tracking-tight text-on-surface-variant hover:text-primary" href="#">{link}</a>
                        ))}
                    </nav>
                    <div className='space-y-1'>
                        <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Gallery Social Platform</p>
                        <p className="text-[9px] font-medium text-on-surface-variant/60">Version 2.0.4 - Spring Editorial</p>
                    </div>
                </footer>
            </aside>
        </div>
    )
}

export default Feed

