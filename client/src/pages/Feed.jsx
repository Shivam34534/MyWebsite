import React, { useEffect, useState } from 'react'
import StoriesBar from '../components/modals/StoriesBar'
import PostCard from '../components/modals/PostCard'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { Sparkles, TrendingUp, Users } from 'lucide-react'

const Feed = () => {
  const user = useSelector((state) => state.user.value)
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

          {/* Suggested Users */}
          <div className="glass-card bg-white/50">
             <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Who to follow</h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200" />
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-900 leading-none mb-1">User Name</span>
                         <span className="text-[10px] text-gray-400">@username</span>
                      </div>
                   </div>
                   <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Follow</button>
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
