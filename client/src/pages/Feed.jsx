import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import PostSkeleton from '../components/PostSkeleton'
import RecentMessages from '../components/RecentMessages'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'

const Feed = () => {


  // Feed State
  const [feeds, setfeeds] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sponsored State
  const [sponsoredImg, setSponsoredImg] = useState(assets.sponsored_img)
  const [sponsoredTitle, setSponsoredTitle] = useState("Email marketing")
  const [sponsoredDesc, setSponsoredDesc] = useState("Supercharge your marketing with a powerful, easy-to-use platform built for results.")
  const { getToken } = useAuth()


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
    <div className='h-full overflow-y-scroll no-scrollbar py-6 xl:pr-5 flex
    items-start justify-center xl:gap-8 bg-slate-50/50'>
      {/* Stories and post list */}
      <div className='w-full max-w-[36rem]'>
        <StoriesBar />
        <div className='p-4 space-y-8 mt-4'>
          {loading ? (
            // Render 3 skeletons initial load
            [1, 2, 3].map((i) => <PostSkeleton key={i} />)
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
                    className='px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold shadow-sm hover:shadow-md border border-gray-100 transition-all active:scale-95 disabled:opacity-50 text-sm'
                >
                    {loadingMore ? "Loading..." : "Load More Posts"}
                </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='max-xl:hidden sticky top-6 space-y-6'>
        <div className='w-80 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4' >
          <div className='flex items-center justify-between'>
            <h1 className='text-slate-900 font-bold'>Sponsored</h1>
            <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Ad</span>
          </div>
          
          <div className='relative group cursor-pointer overflow-hidden rounded-2xl shadow-inner' onClick={() => document.getElementById('sponsored-upload').click()}>
            <img src={sponsoredImg} className='w-full h-44 rounded-2xl object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100' alt="" />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
              <p className='text-white font-bold text-xs'>Change Image</p>
            </div>
          </div>
          <input
            type="file"
            id="sponsored-upload"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSponsoredImg(URL.createObjectURL(e.target.files[0]))
              }
            }}
          />
          <div>
            <input
                type="text"
                value={sponsoredTitle}
                onChange={(e) => setSponsoredTitle(e.target.value)}
                className='text-slate-900 font-bold bg-transparent outline-none border-none w-full text-sm'
            />
            <textarea
                value={sponsoredDesc}
                onChange={(e) => setSponsoredDesc(e.target.value)}
                className='text-slate-500 font-medium text-xs bg-transparent outline-none border-none w-full resize-none mt-1'
                rows={2}
            />
          </div>
          <button className='w-full py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors'>
            Learn More
          </button>
        </div>
        <RecentMessages />
      </div>
    </div>
  )
}

export default Feed
