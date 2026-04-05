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
        <div className='lg:ml-64 flex justify-center min-h-screen bg-surface'>
            <div className="w-full max-w-[630px] px-4 py-8 flex flex-col gap-10">
                {/* Stories Section */}
                <StoriesBar />

                {/* Feed Section */}
                <section className="flex flex-col gap-12 pb-20">
                    {loading ? (
                        [1, 2, 3].map((i) => <PostSkeleton key={i} />)
                    ) : feeds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
                            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">perm_media</span>
                            <h3 className="font-headline font-bold text-lg text-on-surface">No posts in your gallery yet</h3>
                            <button 
                                onClick={() => navigate('/discover')}
                                className="text-primary font-bold hover:underline"
                            >
                                Discover new creators
                            </button>
                        </div>
                    ) : (
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}

                    {/* Load More System */}
                    {hasMore && feeds.length > 0 && !loading && (
                        <div className='flex justify-center pt-2 pb-10'>
                            <button 
                                onClick={() => {
                                    const next = page + 1;
                                    setPage(next);
                                    fetchFeeds(next);
                                }} 
                                disabled={loadingMore}
                                className='px-8 py-3 bg-white text-primary rounded-2xl font-bold shadow-sm hover:shadow-xl hover:shadow-stone-200 border border-stone-200/50 transition-all active:scale-95 disabled:opacity-50 text-sm'
                            >
                                {loadingMore ? "Refining Gallery..." : "Explore More"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Right Sidebar (Suggestions & Trending) */}
            <aside className="hidden xl:flex w-80 flex-col gap-8 p-8 border-l border-stone-200/15 h-screen sticky top-0 overflow-y-auto no-scrollbar bg-stone-50/50">
                {/* User Profile Quick View */}
                <div className="flex items-center justify-between gap-4 p-2">
                    <div 
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="relative">
                            <img 
                                className="w-12 h-12 rounded-full object-cover border-2 border-surface shadow-sm transition-transform group-hover:scale-105" 
                                src={user?.profile_picture || assets.sample_profile} 
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt={user?.full_name} 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{user?.username}</span>
                            <span className="text-xs text-on-surface-variant truncate max-w-[120px]">{user?.full_name}</span>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-primary hover:text-primary-dim transition-colors">Switch</button>
                </div>

                {/* Suggestions */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-headline font-bold text-on-surface-variant text-sm">Suggested Creators</h4>
                        <button className="text-xs font-bold text-on-surface hover:underline">See All</button>
                    </div>
                    <RecentMessages />
                </div>

                {/* Trending Topics (Bento Style) */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-headline font-bold text-on-surface-variant text-sm">Trending now</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container transition-all cursor-pointer group border border-outline-variant/5">
                            <p className="text-[10px] uppercase font-bold text-primary-dim mb-1 tracking-widest">Photography</p>
                            <h5 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">#GoldenHourVibes</h5>
                            <p className="text-[11px] text-on-surface-variant mt-2 font-medium">42.5k posts this week</p>
                        </div>
                        <div className="bg-surface-container-low p-3 rounded-xl hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/5 group">
                            <h5 className="font-bold text-[12px] group-hover:text-primary transition-colors">#DesignInspo</h5>
                            <p className="text-[10px] text-on-surface-variant">12k posts</p>
                        </div>
                        <div className="bg-surface-container-low p-3 rounded-xl hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/5 group">
                            <h5 className="font-bold text-[12px] group-hover:text-primary transition-colors">#OsloLife</h5>
                            <p className="text-[10px] text-on-surface-variant">5.2k posts</p>
                        </div>
                    </div>
                </div>

                {/* Ads Card */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-stone-200/30">
                    <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={assets.sponsored_img} 
                        alt="Sponsored" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[8px] text-white/70 uppercase tracking-widest font-bold mb-1">Sponsored</span>
                        <h6 className="text-white font-bold text-sm">Upgrade your studio today.</h6>
                    </div>
                </div>

                {/* Small Footer Links */}
                <nav className="flex flex-wrap gap-x-3 gap-y-1 mt-auto pb-8">
                    <a className="text-[10px] text-on-surface-variant hover:underline" href="#">About</a>
                    <a className="text-[10px] text-on-surface-variant hover:underline" href="#">Help</a>
                    <a className="text-[10px] text-on-surface-variant hover:underline" href="#">Privacy</a>
                    <a className="text-[10px] text-on-surface-variant hover:underline" href="#">Terms</a>
                    <span className="text-[10px] text-on-surface-variant mt-2 w-full font-medium uppercase tracking-tighter">© 2026 GALLERY FROM EDITORIAL SOCIAL</span>
                </nav>
            </aside>
        </div>
    )
}

export default Feed

