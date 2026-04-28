import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import StoriesBar from '../components/modals/StoriesBar'
import PostCard from '../components/modals/PostCard'
import RecentMessages from '../components/modals/RecentMessages'
import api from '../api/axios'
import { Sparkles, TrendingUp, Users, Plus } from 'lucide-react'

const Feed = () => {
  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data } = await api.get('/api/post/feed')
        if (data.success) {
          setPosts(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch feed", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed Column */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          <StoriesBar user={user} />
          
          {/* Create Post Box (Quick Action) */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 mb-8 shadow-sm flex gap-4 items-center">
             <img src={user?.profile_picture || '/default-avatar.png'} className="w-11 h-11 rounded-full object-cover" alt="" />
             <div 
               onClick={() => navigate('/create-post')}
               className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-2xl px-6 py-3 text-gray-400 font-medium cursor-pointer transition-all"
             >
                What's on your mind, {user?.full_name?.split(' ')[0]}?
             </div>
             <button className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                <Plus size={20} />
             </button>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-gray-100" />
              ))
            ) : posts.length > 0 ? (
              posts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                <Sparkles className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Your feed is quiet</h3>
                <p className="text-gray-500 font-medium mt-2">Discover new creators to fill your space.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column (Desktop) */}
        <aside className="hidden xl:block w-80 space-y-6">
          {/* Profile Summary Card */}
          <div className="glass-card bg-white p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img 
                  src={user?.profile_picture || '/default-avatar.png'} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                  alt=""
                />
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm uppercase tracking-tighter">VIP</div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-gray-900 truncate">@{user?.username}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase truncate">{user?.full_name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-gray-50">
               <div className="text-center flex-1 border-r border-gray-50">
                  <p className="text-xs font-black text-gray-900">{user?.followers?.length || 0}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Followers</p>
               </div>
               <div className="text-center flex-1">
                  <p className="text-xs font-black text-gray-900">{user?.following?.length || 0}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Following</p>
               </div>
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl bg-gray-50 text-[10px] font-black text-gray-400 hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest">
               View My Profile
            </button>
          </div>

          <RecentMessages />

          {/* Trending Card */}
          <div className="glass-card bg-white/50">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Trending Topics</h3>
            </div>
            <div className="space-y-4">
              {['#modern_ui', '#aura_vibe', '#creative_tech', '#minimalism'].map((tag, i) => (
                <div key={i} className="flex flex-col group cursor-pointer">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{tag}</span>
                  <span className="text-[11px] text-gray-400 font-medium">2.4k interactions this hour</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default Feed
