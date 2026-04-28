import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { Search, Sparkles, TrendingUp, Filter, ArrowRight } from 'lucide-react'

const Discover = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.post('/api/user/discover', { input: search })
        if (data.success) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error("Discovery failed", error)
      } finally {
        setLoading(false)
      }
    }
    const timer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-500 font-medium text-lg">Discover the next wave of creative minds.</p>
      </div>

      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, username, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/30 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg font-medium"
          />
        </div>
        <button className="px-8 py-5 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-2 font-bold text-gray-600 hover:text-primary transition-all">
          <Filter size={20} /> <span>Filters</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Discovery Grid */}
        <div className="lg:col-span-2 space-y-10">
          <section>
             <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                   <Sparkles className="text-primary w-5 h-5" />
                   <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider text-xs">Suggested for you</h2>
                </div>
                <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                   See All <ArrowRight size={12} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                   [1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2rem] animate-pulse" />)
                ) : users.map(user => (
                   <div key={user._id} className="glass-card bg-white hover:border-primary/20 group">
                      <div className="flex items-start justify-between mb-4">
                         <img 
                            src={user.profile_picture || '/default-avatar.png'} 
                            className="w-16 h-16 rounded-[1.4rem] object-cover border-2 border-white shadow-sm"
                            alt="" 
                         />
                         <button className="button-primary px-4 py-1.5 text-xs">Follow</button>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{user.full_name}</h3>
                      <p className="text-xs text-gray-400 font-medium mb-4">@{user.username}</p>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-2">
                         {user.bio || "No bio yet. This user is keeping it mysterious."}
                      </p>
                   </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar Trends */}
        <aside className="space-y-10">
           <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-secondary w-5 h-5" />
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider text-xs">Trending Curations</h2>
              </div>
              <div className="space-y-4">
                 {[
                   { title: 'Digital Art', posts: '12k+' },
                   { title: 'Minimalism', posts: '8.4k' },
                   { title: 'UI Design', posts: '5.2k' },
                   { title: 'Web3', posts: '3.1k' }
                 ].map((trend, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex items-center justify-between">
                         <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">{trend.title}</span>
                         <span className="text-[10px] font-black text-gray-400">{trend.posts} posts</span>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </aside>
      </div>
    </div>
  )
}

export default Discover
