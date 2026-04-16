import React, { useState, useEffect } from 'react'
import UserCard from '../components/modals/UserCard.jsx'
import PostCard from '../components/modals/PostCard.jsx'
import Loading from '../components/modals/Loading'
import api from '../api/axios'
import { useAuth } from '../mockClerk'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Discover = () => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchInitialDiscover = async () => {
      if (!input.trim()) {
        try {
          const token = await getToken();
          const { data } = await api.post('/api/user/discover', { input: '' }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setSuggestedUsers(data.users.slice(0, 8));
          }
        } catch (error) {
          console.error('Initial discover error', error);
        }
      } else {
        setSuggestedUsers([]);
      }
    };
    fetchInitialDiscover();
  }, [input, getToken]);

  useEffect(() => {
    if (!input.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await api.get(`/api/search?query=${input}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setUsers(data.users);
          setPosts(data.posts);
        } else {
          toast.error(data.message || 'Failed to search');
        }
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [input, getToken]);

  return (
    <div className='w-full min-h-screen bg-[#F2F2F2] px-4 sm:px-8 py-10 flex flex-col gap-12 overflow-y-auto no-scrollbar'>
      {/* Title Section */}
      <div className='flex flex-col gap-2 -rotate-1'>
          <h1 className='text-6xl font-black italic tracking-tighter text-black uppercase leading-none'>DISCOVER.NET</h1>
          <div className='bg-primary text-black px-3 py-1 neo-border text-[10px] font-black uppercase tracking-widest w-fit shadow-[4px_4px_0px_0px_#000]'>GLOBAL_ACCESS_ENABLED</div>
      </div>

      {/* Global Search Canvas */}
      <div className='relative w-full max-w-2xl group transition-all translate-y-2'>
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-black text-[28px] font-black">search</span>
          <input 
              type="text" 
              placeholder='SEARCH_THE_VOID...'
              className='w-full pl-16 pr-6 py-6 bg-white neo-border text-lg font-black placeholder:text-black/20 focus:bg-stone-50 outline-none transition-all uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
          />
      </div>
        
      {loading ? (
        <div className="py-20 flex justify-center items-center">
            <Loading />
        </div>
      ) : (
        <div className='flex flex-col gap-16 pb-24'>
            {/* Suggested Creators Stage */}
            {suggestedUsers.length > 0 && !input.trim() && (
                <div className='flex flex-col gap-8'>
                    <div className="flex items-center justify-between border-b-[4px] border-black pb-4">
                        <h2 className='text-2xl font-black uppercase tracking-tighter italic'>HOT_CREATORS</h2>
                        <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest neo-border">VERIFIED</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {suggestedUsers.map((user) => (
                            <UserCard user={user} key={user._id} />
                        ))}
                    </div>
                </div>
            )}

            {/* Search Result Creators */}
            {users.length > 0 && (
                <div className='flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500'>
                    <div className="flex items-center gap-4 border-b-[4px] border-black pb-4">
                        <h2 className='text-2xl font-black uppercase tracking-tighter italic'>IDENTITIES_FOUND</h2>
                        <span className="text-[10px] font-black text-black px-3 py-1 bg-accent neo-border shadow-[3px_3px_0px_0px_#000] uppercase">{users.length} HITS</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {users.map((user) => (
                            <UserCard user={user} key={user._id} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Search Result Gallery Items */}
            {posts.length > 0 && (
                <div className='flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500'>
                    <div className="flex items-center gap-4 border-b-[4px] border-black pb-4">
                        <h2 className='text-2xl font-black uppercase tracking-tighter italic'>STORY_FRAGMENTS</h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {posts.map((post) => (
                            <PostCard post={post} key={post._id} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty Context */}
            {input.trim() && users.length === 0 && posts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-white neo-border neo-shadow-lg max-w-xl mx-auto italic">
                    <div className="w-20 h-20 neo-border bg-stone-100 flex items-center justify-center -rotate-6">
                        <span className="material-symbols-outlined text-6xl font-black">error</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-4xl font-black uppercase tracking-tight">NULL_RESULTS</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">The void returned nothing for your request.</p>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>

  )
}

export default Discover
